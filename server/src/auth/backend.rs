use crate::users::{model::User, service::UserService};
use axum_login::{AuthnBackend, UserId};
use sqlx::PgPool;

// We wrap the pool in a struct to implement the Trait on it
#[derive(Clone)]
pub struct Backend {
    pub pool: PgPool,
}

impl Backend {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

// Tell axum-login what our "User" and "ID" look like
impl AuthnBackend for Backend {
    type User = User;
    type Credentials = crate::users::model::CreateUserPayload; // We reuse this struct for login (username/password)
    type Error = crate::error::AppError;

    // How to authenticate (Check password)
    async fn authenticate(
        &self,
        creds: Self::Credentials,
    ) -> Result<Option<Self::User>, Self::Error> {
        match UserService::verify_user(&self.pool, &creds.username, &creds.password).await {
            Ok(user) => Ok(Some(user)),
            Err(_) => Ok(None), // Return None on invalid password
        }
    }

    // How to fetch a user by ID (Session hydration)
    async fn get_user(
        &self,
        user_id: &UserId<Self>,
    ) -> Result<Option<Self::User>, Self::Error> {
        UserService::get_user_by_id(&self.pool, *user_id).await
    }
}