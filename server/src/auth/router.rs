use super::backend::Backend;
use crate::{
    error::AppError,
    state::AppState,
    users::{model::CreateUserPayload, service::UserService},
};
use axum::{
    extract::State, 
    routing::post,
    Json, Router,
};
use axum_login::AuthSession;
use serde_json::{json, Value};

type Auth = AuthSession<Backend>;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/logout", post(logout))
}

async fn register(
    mut auth: Auth,
    State(state): State<AppState>,
    Json(payload): Json<CreateUserPayload>,
) -> Result<Json<Value>, AppError> {
    let user = UserService::create_user(&state.pool, payload).await?;

    auth.login(&user).await.expect("Failed to login after register");

    Ok(Json(json!({ "message": "User created", "user": user })))
}

async fn login(
    mut auth: Auth,
    Json(creds): Json<CreateUserPayload>,
) -> Result<Json<Value>, AppError> {
    let user = auth.authenticate(creds).await
        .map_err(|_| AppError::InternalServerError)?
        .ok_or(AppError::InvalidCredentials)?;

    auth.login(&user).await.expect("Failed to login");

    Ok(Json(json!({ "message": "Logged in", "user": user })))
}

async fn logout(mut auth: Auth) -> Json<Value> {
    auth.logout().await.expect("Failed to logout");
    Json(json!({ "message": "Logged out" }))
}