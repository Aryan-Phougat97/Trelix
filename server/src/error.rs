use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::fmt; 

#[derive(Debug)]
pub enum AppError {
    DatabaseError(sqlx::Error),
    UserAlreadyExists,
    InvalidCredentials,
    InternalServerError,
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for AppError {}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::DatabaseError(e) => {
                tracing::error!("Database Error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database Error")
            }
            AppError::UserAlreadyExists => (StatusCode::CONFLICT, "Username already exists"),
            AppError::InvalidCredentials => (StatusCode::UNAUTHORIZED, "Invalid username or password"),
            AppError::InternalServerError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error"),
        };

        let body = Json(json!({ "error": message }));
        (status, body).into_response()
    }
}