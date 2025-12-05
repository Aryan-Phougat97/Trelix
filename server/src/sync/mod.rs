pub mod handlers;
pub mod socket;

use crate::state::AppState;
use axum::{routing::get, Router};

pub fn router() -> Router<AppState> {
    Router::new().route("/sync", get(handlers::ws_handler))
}