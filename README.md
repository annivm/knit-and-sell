
🛒🛒🛒**Market Place Application**🛒🛒🛒

This is a full-stack web application for managing and selling items. The application consists of a frontend built with React, a backend built with Node.js and Express and a database using PostgreSQL. Project is fully deployed on Render and images are uploaded to Cloudinary.

🌐 Deployed project: https://knit-and-sell.onrender.com/


🐳 RUNNING THE APPLICATION LOCALLY USING DOCKER:

Requirements:
- Docker and Docker Compose
- Cloudinary (optional, for image uploads)

1. Clone the repository
    git clone git@github.com:5G00EV16-3004/2025-final-project-annivm.git
    cd 2025-final-project-annivm

2. Create .env -file in the backend folder:
    PORT=5002
    DB_USER=postgres
    DB_HOST=db
    DB_NAME=market_db
    DB_PASSWORD=market_password
    DB_PORT=5432
    JWT_KEY=my_secret_jwt_key
    FRONTEND_URL=http://localhost:8082

    # optional: for image uploads
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
    CLOUDINARY_API_KEY=<your-cloudinary-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-secret>

3. Create .env -file in the frontend folder:
    VITE_API_URL=http://localhost:5002

4. Build and start the containers:
    Go to the root folder
        docker-compose up --build

-> Backend http://localhost:5002
-> Frontend http://localhost:8082
-> Adminer(Database): http://localhost:8081


📄SUMMARY:

This site is a marketplace for selling handmade items (knitting, crochet etc.).
Here you can browse listings, signup, login and post their own items. Logged-in users can edit and delete their own listings.
The site is designed for hobby-based buyers and sellers.

Note! Buy-button does not have proper functionality yet. It only shows confirmation message as a placeholder.

Base for this project is from "Diner project".

Key features:
- user authentication (login/signup)
- Product listing (all and users own)
- Add, edit and delete items
- error handling to guide the user
- Image uploads using Cloudinary (with fallback for running locally)

Challenges:

Trying to start project from scratch
    I initially tried to build the project completely from scratch but quickly felt overwhelmed.
    To help structure my work, I created some Figma layouts, but progress was slow.
    Eventually, I used the Diner project as a base, which helped things move forward.

Understanding ports
    It took some effort to understand how ports worked across the backend, frontend, and Docker containers, but experimenting helped clarify this.

Deploying
    Deployment was time-consuming.
    I experimented with different platforms before choosing Render as the simplest solution.
    Setting up the deployment pipeline and managing environment secrets took effort.
    Initially, I tried deploying to AWS via Learner Lab, but I didn’t realize it shuts down instances after the lab ends — lesson learned!
    I looked up last falls course records and youtube for deploying on Render and got it running quite nicely.

Images
    I chose to try implement image upload. This was a rewarding but challenging task.
    At first, I stored images locally, but this failed in deployment.
    Switching to Cloudinary was a good move -> setup was simple and effective.
    For running the project locally I made Cloudinary optional with a fallback setup for local use.
    This required some workaround logic that may not follow best practices, but it works for now!

