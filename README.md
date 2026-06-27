# Blue-Green Deployment Demo

> A production‑grade **Blue‑Green Deployment** example using Node.js, MongoDB, Docker, Docker‑Compose, Nginx, Ansible, Terraform, and GitHub Actions. The repository showcases a complete DevOps pipeline that lets you switch traffic between a **blue** and a **green** version of the API without downtime.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=flat-square&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

---

## Overview

This project demonstrates a **Blue‑Green deployment** strategy. Two identical API containers – `api-blue` and `api-green` – run side‑by‑side behind an Nginx reverse‑proxy. Traffic can be shifted from blue to green by updating the Nginx configuration and reloading the proxy, enabling zero‑downtime releases.

Key components:

* **Node.js + Express** – simple TODO REST API.
* **MongoDB** – persistent data store (single instance shared by both API versions).
* **Docker & Docker‑Compose** – container runtime and orchestration.
* **Nginx** – reverse proxy that routes traffic to either the blue or green API.
* **Ansible** – provisions a fresh Ubuntu VM, installs Docker, copies the compose file, and starts the stack.
* **Terraform** – optionally provisions the whole stack using the `kreuzwerker/docker` provider.
* **GitHub Actions** – CI/CD pipeline that builds, pushes Docker images and triggers a blue‑green rollout.
* **Secure remote access** – Tailscale creates a private tunnel for the CI runner to reach the VM.

---

## Features

- **Blue‑Green release** – switch traffic by editing a single line in `nginx/default.conf`.
- **Zero‑downtime upgrades** – the old version stays alive while the new one boots.
- **Full CRUD API** – manage todos stored in MongoDB.
- **Infrastructure as Code** – Docker‑Compose, Terraform, Ansible.
- **Automated CI/CD** – GitHub Actions builds & deploys on each push.
- **Secure remote access** – Tailscale creates a private tunnel for the CI runner to reach the VM.

---

## Tech Stack

| Layer               | Technology |
|---------------------|------------|
| Runtime             | Node.js |
| Framework           | Express |
| Database            | MongoDB + Mongoose |
| Containerization    | Docker, Docker‑Compose |
| IaC                 | Terraform (kreuzwerker/docker) |
| Configuration Mgmt  | Ansible |
| CI/CD               | GitHub Actions |
| Image Registry      | Docker Hub |
| Reverse Proxy       | Nginx |
| OS                  | Ubuntu Linux |
| Secure Tunnel       | Tailscale |

---

## Project Structure

```text
Blue-Green Deployment/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── ansible/
│   ├── deploy.yml              # Ansible playbook
│   ├── inventory.ini           # Target host definition
│   └── files/
│       ├── docker-compose.yml  # Production compose file
│       └── .env                # Production env vars
├── terraform/
│   ├── main.tf                 # Docker resources (network, volume, containers)
│   ├── variables.tf            # Port configuration
│   └── outputs.tf              # Outputs (container IDs)
└── todo-api/
    ├── Dockerfile              # Node image definition
    ├── docker-compose.yml      # Local dev compose file
    ├── .env                    # Local env (not committed)
    ├── server.js               # Express entry point
    ├── package.json
    ├── models/
    │   └── Todo.js             # Mongoose schema
    └── routes/
        └── todoRoutes.js       # CRUD routes
```

---

## API Reference

Base URL (local): `http://localhost:3000`

### Todo Schema

```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "completed": "boolean (default: false)"
}
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/todos` | Retrieve all todos |
| `POST` | `/todos` | Create a new todo |
| `GET`  | `/todos/:id` | Retrieve a single todo |
| `PUT`  | `/todos/:id` | Update a todo |
| `DELETE`| `/todos/:id` | Delete a todo |

---

## Local Development

### Prerequisites

- Docker & Docker‑Compose
- Git

### Run the stack

```bash
# Clone the repository
git clone https://github.com/Yandex-ssh/Blue-Green-Deployment.git
cd "Blue-Green Deployment"

# Start the blue and green API containers together with MongoDB and Nginx
cd todo-api
docker compose up --build
```

The API will be reachable at `http://localhost:80`. By default Nginx forwards traffic to **api-blue** (see `nginx/default.conf`). To switch to the green version, edit line 5 in that file:

```nginx
proxy_pass http://api-green:3000;  # change from api-blue to api-green
```

Then reload Nginx inside the container:

```bash
docker exec $(docker ps -q -f "name=nginx") nginx -s reload
```

### Quick Test

```bash
# Health check
curl http://localhost:80

# Create a todo
curl -X POST http://localhost:80/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Blue‑Green"}'

# List todos
curl http://localhost:80/todos
```

---

## Deployment

### Server Provisioning with Ansible

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

The playbook installs Docker, copies `docker-compose.yml` and `.env` to `/home/yandex/todo-app` on the target VM, pulls the latest images and starts the containers.

### CI/CD Pipeline (GitHub Actions)

The workflow defined in `.github/workflows/deploy.yml` runs on every push to `main`:

1. Checkout code
2. Log in to Docker Hub
3. Build and push the `todo-api:latest` image
4. Connect to the VM via Tailscale
5. Pull the new image & restart the stack (`docker compose pull && docker compose up -d`)

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `DOCKER_PASSWORD` | Docker Hub access token |
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth secret |
| `VM_HOST` | Tailscale IP of the VM |
| `VM_USER` | SSH username |
| `VM_SSH_KEY` | Private SSH key |

---

## Environment Variables

Create a `.env` file in `todo-api/` (local) or in `ansible/files/` (production):

```env
MONGO_URI=mongodb://mongo:27017/todos
```

> **Note:** Never commit secrets to the repository.

---

## Learning Objectives

- Implement a blue‑green deployment pattern.
- Use Docker‑Compose for multi‑container orchestration.
- Provision infrastructure with Terraform and Docker provider.
- Automate server setup with Ansible.
- Build a CI/CD pipeline with GitHub Actions and Tailscale.
- Configure Nginx as a reverse proxy.

---

## Roadmap

- [ ] Add JWT authentication.
- [ ] Enable HTTPS with Let’s Encrypt.
- [ ] Centralised logging (Loki + Grafana).
- [ ] Metrics & alerting (Prometheus + Grafana).
- [ ] Kubernetes deployment manifests.
- [ ] Terraform‑provisioned cloud VM (e.g. AWS EC2 or DigitalOcean Droplet).

---

## Author

Built by **Yandex‑ssh** as part of the **Blue‑Green Deployment** learning project.

**Project:** [roadmap.sh — Blue‑Green Deployment](https://roadmap.sh/projects/blue-green-deployment)


> A production-style REST API built with Node.js, MongoDB, Docker, Ansible, Terraform, and GitHub Actions — demonstrating a real-world DevOps deployment pipeline.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=flat-square&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

---

## Overview

*See the earlier Overview section for details.*


---

## API Reference

Base URL (local): `http://localhost:3000`

### Todo Schema

```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "completed": "boolean (default: false)"
}
```

### Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/todos` | Retrieve all todos |
| `POST` | `/todos` | Create a new todo |
| `GET` | `/todos/:id` | Retrieve a single todo by ID |
| `PUT` | `/todos/:id` | Update a todo by ID |
| `DELETE` | `/todos/:id` | Delete a todo by ID |

#### Create a Todo

```http
POST /todos
Content-Type: application/json

{
  "title": "Learn Docker Compose"
}
```

#### Update a Todo

```http
PUT /todos/:id
Content-Type: application/json

{
  "title": "Learn Docker Compose",
  "completed": true
}
```

#### Delete a Todo

```http
DELETE /todos/:id
```

Response:

```json
{ "message": "Todo deleted" }
```

---

## Local Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Git

### Run with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd Multi-Container-Application

# Start API + MongoDB containers
cd todo-api
docker compose up --build
```

The API will be available at `http://localhost:3000`.

### Run with Terraform

```bash
cd terraform
terraform init
terraform apply
```

Terraform provisions the Docker network, volume, MongoDB container, and API container using the local Docker socket.

### Quick Test

```bash
# Health check
curl http://localhost:3000/

# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker"}'

# Fetch all todos
curl http://localhost:3000/todos
```

---

## Deployment

### Server Provisioning with Ansible

Ansible is used to configure a fresh Ubuntu server for production. The playbook:

1. Installs Docker and the Docker Compose plugin
2. Ensures the Docker service is running and enabled on boot
3. Creates the deployment directory (`/home/yandex/todo-app`)
4. Copies `docker-compose.yml` and `.env` to the server
5. Pulls the latest image from Docker Hub and starts the containers

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

### CI/CD Pipeline with GitHub Actions

The pipeline triggers automatically on every push to `main`.

```
Push to main
     │
     ▼
Checkout code
     │
     ▼
Login to Docker Hub
     │
     ▼
Build Docker image
     │
     ▼
Push image to Docker Hub
     │
     ▼
Connect to VM via Tailscale
     │
     ▼
SSH into server
     │
     ├── docker compose pull
     └── docker compose up -d
```

#### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKER_PASSWORD` | Docker Hub access token |
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth secret |
| `VM_HOST` | Server's Tailscale IP (`100.x.x.x`) |
| `VM_USER` | SSH username on the server |
| `VM_SSH_KEY` | Private SSH key for the server |

### Production Traffic Flow

```
Client Request
      │
      ▼
   Nginx (Reverse Proxy)
      │
      ▼
   Node.js API  (:3000)
      │
      ▼
   MongoDB      (:27017)
```

---

## Environment Variables

Create a `.env` file in `todo-api/` for local development:

```env
MONGO_URI=mongodb://mongo:27017/todos
```

> **Note:** Never commit `.env` files containing secrets. The `.env` in `ansible/files/` is the production copy deployed by Ansible.

---

## Learning Objectives

This project was built to practice:

- Docker fundamentals and image building
- Multi-container orchestration with Docker Compose
- Infrastructure as Code with Terraform
- Container networking and named volumes
- MongoDB integration via Mongoose
- Linux server administration
- Remote server configuration with Ansible
- Building CI/CD pipelines with GitHub Actions
- Reverse proxy configuration with Nginx
- Secure remote access using Tailscale

---

## Roadmap

- [ ] JWT authentication and user accounts
- [ ] HTTPS with Let's Encrypt SSL certificates
- [ ] Centralised logging (Loki + Grafana)
- [ ] Metrics and alerting (Prometheus + Grafana)
- [ ] Kubernetes deployment manifests
- [ ] Terraform-provisioned cloud VM (e.g. AWS EC2 or DigitalOcean Droplet)

---

## Author

Built as part of a DevOps and Backend Engineering learning project.

**Project:** [roadmap.sh — Multi-Container Service](https://roadmap.sh/projects/multi-container-service)
