use super::model::{CreateUserPayload, User};
use crate::error::AppError; 
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use sqlx::PgPool;
use uuid::Uuid;

pub struct UserService;

impl UserService {
    // Create a new user (Hash password -> Insert DB)
    pub async fn create_user(pool: &PgPool, payload: CreateUserPayload) -> Result<User, AppError> {
        // Generate a random salt
        let salt = SaltString::generate(&mut OsRng);

        // Hash the password (Argon2id)
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(payload.password.as_bytes(), &salt)
            .map_err(|_| AppError::InternalServerError)?
            .to_string();

        // Insert into Postgres
        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            RETURNING *
            "#,
        )
            .bind(payload.username)
            .bind(password_hash)
            .fetch_one(pool)
            .await
            .map_err(|e| {
                // Check for unique constraint violation (duplicate username)
                if let Some(db_err) = e.as_database_error() {
                    if db_err.is_unique_violation() {
                        return AppError::UserAlreadyExists;
                    }
                }
                AppError::DatabaseError(e)
            })?;

        Ok(user)
    }

    // Verify credentials (Login)
    pub async fn verify_user(pool: &PgPool, username: &str, password: &str) -> Result<User, AppError> {
        // Fetch user by username
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1")
            .bind(username)
            .fetch_optional(pool)
            .await
            .map_err(AppError::DatabaseError)?
            .ok_or(AppError::InvalidCredentials)?;

        // Verify password hash
        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| AppError::InternalServerError)?;

        Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .map_err(|_| AppError::InvalidCredentials)?;

        Ok(user)
    }

    // Get User by ID (Session hydration)
    pub async fn get_user_by_id(pool: &PgPool, id: Uuid) -> Result<Option<User>, AppError> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await
            .map_err(AppError::DatabaseError)
    }
}