use super::socket::handle_socket;
use crate::{auth::backend::Backend, state::AppState};
use axum::{
    extract::{ws::WebSocketUpgrade, State},
    response::IntoResponse,
    http::StatusCode,
};
use axum_login::AuthSession;

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    auth: AuthSession<Backend>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    if auth.user.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    ws.on_upgrade(|socket| handle_socket(socket, state))
}