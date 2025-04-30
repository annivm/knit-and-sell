
Market Place Application

This is a full-stack web application for managing and selling items. The application consists of a frontend built with React and a backend built with Node.js, Express, and PostgreSQL.

Requirements:
- Node.js
- Docker and DockerCompose
- PostgreSQL

Installation (Git Bash):

1. Clone the repository
    git clone git@github.com:5G00EV16-3004/2025-final-project-annivm.git
    cd 2025-final-project-annivm

2. Set up the backend
    cd backend
    npm install

    Create .env -file in the backend folder
        PORT=5000
        DB_USER=postgres
        DB_HOST=localhost
        DB_NAME=market_db
        DB_PASSWORD=market_password
        DB_PORT=5432
        JWT_KEY=my_secret_jwt_key

    (If running database locally:
    psql -U postgres -c "CREATE DATABASE market_db;"
    psql -U postgres -d market_db -f ../db/init.sql)

    npm run dev

    -> The backend will be available at http://localhost:5002

3. Set up the frontend
    cd ../frontend
    npm install

    Create .env -file in the frontend folder
        VITE_API_URL=http://localhost:5002
        VITE_APP_TITLE="My Market Place"

    npm run dev

    -> The frontend will be available at http://localhost:5173


Running the application using Docker:

1. Build and start the containers:
    Go to the root folder
        docker-compose up --build

    -> Backend http://localhost:5002
    -> Frontend http://localhost:8082
    -> Adminer(Database): http://localhost:8081