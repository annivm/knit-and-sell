
Market Place Application

This is a full-stack web application for managing and selling items. The application consists of a frontend built with React and a backend built with Node.js, Express, and PostgreSQL. Project is fully deployed on Render and images are uploaded to Cloudinary.

🌐 Deployed project: https://knit-and-sell.onrender.com/



🖥️ RUNNING LOCALLY:

    Requirements:
    - Node.js
    - Docker and DockerCompose
    - PostgreSQL
    - Cloudinary (optional, used for image uploads)


    Installation (Git Bash):

    1. Clone the repository
        git clone git@github.com:5G00EV16-3004/2025-final-project-annivm.git
        cd 2025-final-project-annivm

    2. Set up the backend
        cd backend
        npm install

        Create .env -file in the backend folder
            PORT=5002
            DB_USER=postgres
            DB_HOST=localhost
            DB_NAME=market_db
            DB_PASSWORD=market_password
            DB_PORT=5432
            JWT_KEY=my_secret_jwt_key

            # optional: for image uploads
            CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
            CLOUDINARY_API_KEY=<your-cloudinary-key>
            CLOUDINARY_API_SECRET=<your-cloudinary-secret>

        (If running database locally, not with docker, run these commands to create and initialize it:
            psql -U postgres -c "CREATE DATABASE market_db;"
            psql -U postgres -d market_db -f ../db/init.sql
        )

        npm run dev

        -> The backend will be available at http://localhost:5002

    3. Set up the frontend
        cd ../frontend
        npm install

        Create .env -file in the frontend folder
            VITE_API_URL=http://localhost:5002

        npm run dev

        -> The frontend will be available at http://localhost:5173


🐳 RUNNING THE APPLICATION USING DOCKER:

    Requirements:
    - Docker and Docker Compose
    - Cloudinary (optional, for image uploads)

    1. Create .env -file in the backend folder:
        PORT=5002
        DB_USER=postgres
        DB_HOST=localhost
        DB_NAME=market_db
        DB_PASSWORD=market_password
        DB_PORT=5432
        JWT_KEY=my_secret_jwt_key

        # optional: for image uploads
        CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
        CLOUDINARY_API_KEY=<your-cloudinary-key>
        CLOUDINARY_API_SECRET=<your-cloudinary-secret>

    2. Create .env -file in the frontend folder:
        VITE_API_URL=http://localhost:5002

    3. Build and start the containers:
        Go to the root folder
            docker-compose up --build

        -> Backend http://localhost:5002
        -> Frontend http://localhost:8082
        -> Adminer(Database): http://localhost:8081