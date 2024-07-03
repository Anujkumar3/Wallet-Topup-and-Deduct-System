# Wallet System

This project implements a robust, high-performance API for a wallet topup and deduct system. It supports both HTTP and gRPC protocols, using Node.js and PostgreSQL.

## Features

- HTTP and gRPC APIs
- Atomic operations for topup and deduct actions
- Comprehensive logging and monitoring
- Unit and integration tests
- Dockerized environment

## Prerequisites

- Node.js (v14 or higher)
- Docker
- Docker Compose

## Setup and Running the Application

### Locally

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/wallet-system.git
    cd wallet-system
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up PostgreSQL:
    ```sh
    docker-compose up db
    ```

4. Apply database schema:
    ```sh
    docker-compose exec db psql -U your_db_user -d wallet -f src/models/schema.sql
    ```

5. Run the application:
    ```sh
    npm start
    ```

### Docker

1. Build and start the services:
    ```sh
    docker-compose up --build
    ```

## API Documentation

### HTTP Endpoints

#### POST /api/topup

- Request Body:
    ```json
    {
        "user_id": "string",
        "amount": "float"
    }
    ```

- Response:
    ```json
    {
        "status": true,
        "new_balance": "float",
        "transaction_id": "string"
    }
    ```

#### POST /api/deduct

- Request Body:
    ```json
    {
        "user_id": "string",
        "amount": "float"
    }
    ```

- Response:
    ```json
    {
        "status": true,
        "new_balance": "float",
        "transaction_id": "string"
    }
    ```

#### GET /api/balance

- Request Params:
    ```json
    {
        "user_id": "string"
    }
    ```

- Response:
    ```json
    {
        "balance": "float"
    }
    ```

### gRPC Methods

#### Topup

- Request:
    ```protobuf
    message TopupRequest {
        string user_id = 1;
        float amount = 2;
    }
    ```

- Response:
    ```protobuf
    message TopupResponse {
        bool status = 1;
        float new_balance = 2;
        string transaction_id = 3;
    }
    ```

#### Deduct

- Request:
    ```protobuf
    message DeductRequest {
        string user_id = 1;
        float amount = 2;
    }
    ```

- Response:
    ```protobuf
    message DeductResponse {
        bool status = 1;
        float new_balance = 2;
        string transaction_id = 3;
    }
    ```

#### GetBalance

- Request:
    ```protobuf
    message GetBalanceRequest {
        string user_id = 1;
    }
    ```

- Response:
    ```protobuf
    message GetBalanceResponse {
        float balance = 1;
    }
    ```

## Database Schema and Setup

### Schema (schema.sql)

```sql
CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    balance FLOAT NOT NULL DEFAULT 0
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
