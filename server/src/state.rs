use axum::extract::FromRef;
use sqlx::PgPool;
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub tx: broadcast::Sender<String>,
}

impl AppState {
    pub fn new(pool: PgPool) -> Self {
        let (tx, _rx) = broadcast::channel(100);
        Self { pool, tx }
    }
}

impl FromRef<AppState> for PgPool {
    fn from_ref(state: &AppState) -> Self {
        state.pool.clone()
    }
}