use sqlx::PgPool;
use tower_sessions::{cookie::Key, service::SignedCookie, Expiry, SessionManagerLayer};
use tower_sessions_sqlx_store::PostgresStore;

pub type SessionLayer = SessionManagerLayer<PostgresStore, SignedCookie>;

pub async fn setup(pool: PgPool, secret: &str ) -> SessionLayer {
    // Create the store (this uses the 'sessions' table we created)
    let store = PostgresStore::new(pool);

    // Run internal migrations for the session store if needed
    store.migrate().await.expect("Failed to migrate session store");

    let key = Key::from(secret.as_bytes());

    // Configure the middleware
    SessionManagerLayer::new(store)
        .with_signed(key)
        .with_secure(false)
        .with_expiry(Expiry::OnInactivity(time::Duration::days(30))) // Keep logged in for 30 days
}