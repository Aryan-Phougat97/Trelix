pub mod handlers;
pub mod socket;
pub mod storage;

use crate::state::AppState;
use axum::{routing::get, Router};

pub fn router() -> Router<AppState> {
    Router::new().route("/sync", get(handlers::ws_handler))
        .route("/api/store", get(storage::load_store).post(storage::save_store))
}