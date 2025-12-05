use crate::auth::backend::Backend;
use crate::error::AppError;
use crate::state::AppState;
use axum::{
    extract::State,
    Json,
};
use axum_login::AuthSession;
use serde_json::Value;
use sqlx::Row;

// GET /api/store
// Returns the full JSON blob for the logged-in user
pub async fn load_store(
    auth: AuthSession<Backend>,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let user = auth.user.ok_or(AppError::InvalidCredentials)?;

    let row = sqlx::query("SELECT data FROM cloud_store WHERE user_id = $1")
        .bind(user.id)
        .fetch_optional(&state.pool)
        .await
        .map_err(AppError::DatabaseError)?;

    match row {
        Some(r) => {
            let data: Value = r.try_get("data").map_err(|_| AppError::InternalServerError)?;
            Ok(Json(data))
        }
        // If no data exists yet, return an empty object (or default TinyBase structure)
        None => Ok(Json(serde_json::json!({}))),
    }
}

// POST /api/store
// Overwrites the JSON blob (Last Write Wins)
pub async fn save_store(
    auth: AuthSession<Backend>,
    State(state): State<AppState>,
    Json(data): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let user = auth.user.ok_or(AppError::InvalidCredentials)?;

    sqlx::query(
        r#"
        INSERT INTO cloud_store (user_id, data, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET data = $2, updated_at = NOW()
        "#
    )
    .bind(user.id)
    .bind(data)
    .execute(&state.pool)
    .await
    .map_err(AppError::DatabaseError)?;

    Ok(Json(serde_json::json!({ "success": true })))
}