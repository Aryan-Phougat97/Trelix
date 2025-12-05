mod auth;
mod config;
mod error;
mod state;
mod sync;
mod users;

use tower_http::cors::{ CorsLayer, AllowOrigin };
use auth::backend::Backend;
use axum::{ Router, http::{ header, Method }};
use axum_login::AuthManagerLayerBuilder;
use config::Config;
use sqlx::postgres::PgPoolOptions;
use state::AppState;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use auth::router::router as auth_router;
use sync::router as sync_router;

#[tokio::main]
async fn main() {
    // Logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Config & DB
    let config = Config::from_env().expect("❌ Failed to load configuration");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&config.database_url)
        .await
        .expect("❌ Failed to connect to Postgres");

    // Run Migrations
    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("❌ Failed to run migrations");

    // Setup Auth Layers
    let session_store = auth::session::setup(pool.clone(), &config.auth_secret).await;

    let backend = Backend::new(pool.clone());
    let auth_layer = AuthManagerLayerBuilder::new(backend, session_store).build();

    // Initialize Global State
    let app_state = AppState::new(pool);

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:8080".parse::<axum::http::HeaderValue>().unwrap()) 
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION, header::ACCEPT])
        .allow_credentials(true);

    // Build Router
    let app = Router::new()
        .merge(auth_router())
        .merge(sync_router())
        // Simple health check logic directly in main for now
        .route("/me", axum::routing::get(me_handler))
        .layer(auth_layer)
        .with_state(app_state)
        .layer(cors);

    // Start
    let addr: SocketAddr = format!("{}:{}", config.host, config.port)
        .parse()
        .expect("Invalid address format");

    tracing::info!("🚀 Trelix Server listening on {}", addr);
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

use axum_login::AuthSession;
async fn me_handler(auth: AuthSession<Backend>) -> impl axum::response::IntoResponse {
    match auth.user {
        Some(user) => axum::Json(serde_json::json!({ "user": user })),
        None => axum::Json(serde_json::json!({ "error": "Not logged in" })),
    }
}