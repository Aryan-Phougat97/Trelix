# Trelix Server Component 🦀

This is the backend for **Trelix Personal OS**, built with **Rust** to provide high-performance synchronization, authentication, and data persistence.

It serves as the "Central Nervous System" for Trelix, handling:
1.  **Sync Relay:** Real-time WebSocket synchronization between devices.
2.  **Authentication:** Secure user sessions and password management.
3.  **Persistence:** Encrypted storage of user data in PostgreSQL.

---

## 🛠️ The Tech Stack

We chose this stack for maximum type safety, performance, and reliability:

* **Runtime:** [Tokio](https://tokio.rs/) (Async Rust runtime)
* **Web Framework:** [Axum](https://github.com/tokio-rs/axum) (Ergonomic and modular)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (The world's most advanced open source database)
* **ORM / Query Builder:** [SQLx](https://github.com/launchbadge/sqlx) (Compile-time checked SQL queries)
* **Authentication:** `axum-login` + `tower-sessions`
* **Security:** `argon2` (Password hashing) + `rand_core` (Salting)

---

## 📂 Project Structure

This project follows a **Domain-Driven Design (DDD)** approach. Each major feature has its own module.

```text
server/
├── migrations/             # SQL files for database schema changes
├── src/
│   ├── main.rs             # Entry point: Wiring and server startup
│   ├── config.rs           # Environment variable loader
│   ├── state.rs            # Shared AppState (DB Pool + Sync Channels)
│   ├── error.rs            # Centralized error handling
│   │
│   ├── auth/               # THE BOUNCER 🛡️
│   │   ├── mod.rs          # Auth module definition
│   │   ├── backend.rs      # User fetching logic for sessions
│   │   └── router.rs       # Login / Logout / Register endpoints
│   │
│   ├── users/              # THE DATA DOMAIN 👤
│   │   ├── mod.rs
│   │   ├── model.rs        # User struct & SQL mappings
│   │   └── service.rs      # Business logic (Create User, Verify Password)
│   │
│   └── sync/               # THE TRAFFIC CONTROLLER 🚥
│       ├── mod.rs
│       ├── handlers.rs     # WebSocket upgrade handler (with Auth check)
│       └── socket.rs       # The raw real-time message relay
````

-----

## 🚀 Getting Started

### 1\. Prerequisites

* **Rust:** [Install Rust](https://rustup.rs/) (`cargo`)
* **PostgreSQL:** Install via Docker or native package manager.
* **SQLx CLI:** `cargo install sqlx-cli` (for running migrations)

### 2\. Setup the Database

Start a Postgres instance (e.g., via Docker):

```bash
docker run --name trelix-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
```

Create the `.env` file (see below) and then run:

```bash
# Create the database
sqlx database create

# Run migrations (create tables)
sqlx migrate run
```

### 3\. Run the Server

```bash
# Development mode (auto-reloads if you use cargo-watch)
cargo run

# Production build
cargo build --release
./target/release/trelix-server
```

-----

## 🔐 Configuration (`.env`)

Create a `.env` file in the `server/` root:

```ini
# Database Connection
DATABASE_URL=postgres://postgres:secret@localhost:5432/trelix

# Server Settings
HOST=0.0.0.0
PORT=3000

# Logging Level (trace, debug, info, warn, error)
RUST_LOG=debug

# Security Secrets (Generate these with `openssl rand -hex 64`)
AUTH_SECRET=super_long_secret_key_for_signing_session_cookies
```

-----

## 🔌 API Endpoints

### Authentication

* `POST /auth/register` - Create a new account
* `POST /auth/login` - Create a session
* `POST /auth/logout` - Destroy session

### Synchronization

* `GET /sync` - WebSocket endpoint.
    * **Requires:** Valid Session Cookie.
    * **Protocol:** Relays JSON diffs between connected clients in the same user room.

-----

## 🧪 Testing

Run the test suite (requires a running DB or mock):

```bash
cargo test
```
