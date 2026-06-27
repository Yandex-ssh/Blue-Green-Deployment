🚀 Blue-Green Deployment

  A production-style Blue-Green Deployment demonstration built with
  Node.js, Express, MongoDB, Docker Compose, and Nginx.

------------------------------------------------------------------------

📖 Overview

This project demonstrates a Blue-Green Deployment strategy using a
simple Todo REST API.

Two identical application environments run simultaneously:

-   Blue – the currently active version serving users.
-   Green – the new version deployed alongside Blue.

Traffic is routed through Nginx, allowing requests to be switched
between Blue and Green without stopping the application. If the new
deployment fails, traffic can immediately be switched back to the
previous version.

------------------------------------------------------------------------

🏗️ Architecture

                        Client
                           │
                           ▼
                  http://localhost
                           │
                     Nginx Proxy
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
         API Blue                  API Green
        (Version Blue)           (Version Green)
              │                         │
              └────────────┬────────────┘
                           ▼
                        MongoDB

------------------------------------------------------------------------

✨ Features

-   Blue-Green deployment strategy
-   Zero-downtime traffic switching
-   Docker Compose orchestration
-   Nginx reverse proxy
-   Shared MongoDB database
-   Todo REST API
-   /version endpoint
-   /health endpoint

------------------------------------------------------------------------

🛠️ Tech Stack

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   Docker
-   Docker Compose
-   Nginx

------------------------------------------------------------------------

📁 Project Structure

    Blue-Green-Deployment/
    ├── .github/
    ├── ansible/
    ├── terraform/
    ├── nginx/
    │   └── default.conf
    ├── todo-api/
    │   ├── Dockerfile
    │   ├── server.js
    │   ├── package.json
    │   ├── models/
    │   └── routes/
    ├── docker-compose.yml
    └── README.md

------------------------------------------------------------------------

🚀 Running the Project

Prerequisites

-   Docker
-   Docker Compose

Start

    docker compose up --build

Visit:

    http://localhost

------------------------------------------------------------------------

🔄 Blue-Green Deployment Demo

By default, Nginx routes traffic to:

    proxy_pass http://api-blue:3000;

Check the active version:

    curl http://localhost/version

Example response:

    {
      "version": "Blue"
    }

To switch to Green:

1.  Edit nginx/default.conf

    proxy_pass http://api-green:3000;

2.  Reload Nginx

    docker compose exec nginx nginx -s reload

3.  Verify

    curl http://localhost/version

Response:

    {
      "version": "Green"
    }

Rollback simply changes the proxy back to api-blue and reloads Nginx.

------------------------------------------------------------------------

❤️ Health Check

    curl http://localhost/health

Example response:

    {
      "status": "healthy",
      "version": "Green"
    }

------------------------------------------------------------------------

📚 API Endpoints

  Method   Endpoint     Description
  -------- ------------ ----------------------------
  GET      /todos       Retrieve all todos
  POST     /todos       Create a todo
  GET      /todos/:id   Retrieve a todo
  PUT      /todos/:id   Update a todo
  DELETE   /todos/:id   Delete a todo
  GET      /version     Current deployment version
  GET      /health      Health status

------------------------------------------------------------------------

🔮 Future Improvements

-   GitHub Actions CI/CD
-   Prometheus monitoring
-   Grafana dashboards
-   HTTPS with Let’s Encrypt
-   Kubernetes deployment

------------------------------------------------------------------------

👨‍💻 Author

Built as part of the roadmap.sh Blue-Green Deployment project to
practice container orchestration, reverse proxies, and deployment
strategies.
https://roadmap.sh/projects/blue-green-deployment