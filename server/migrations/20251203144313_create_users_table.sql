-- Users Table
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username TEXT NOT NULL UNIQUE,
                       password_hash TEXT NOT NULL,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions Table (Required by tower-sessions-sqlx-store)
CREATE TABLE sessions (
                          id TEXT PRIMARY KEY,
                          data BYTEA NOT NULL,
                          expiry_date TIMESTAMPTZ NOT NULL
);
