use std::env;
use dotenvy::dotenv;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub host: String,
    pub port: u16,
    pub auth_secret: String,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL")
            .map_err(|_| "DATABASE_URL must be set")?;

        let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());

        let port = env::var("PORT")
            .unwrap_or_else(|_| "3000".to_string())
            .parse::<u16>()
            .map_err(|_| "PORT must be a number")?;

        let auth_secret = env::var("AUTH_SECRET")
            .map_err(|_| "AUTH_SECRET must be set")?;

        Ok(Config {
            database_url,
            host,
            port,
            auth_secret,
        })
    }
}