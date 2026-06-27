# 🚀 Blue-Green Deployment

> A production-style **Blue-Green Deployment** demonstration built with **Node.js**, **Express**, **MongoDB**, **Docker Compose**, and **Nginx**. This project showcases how to deploy a new version of an application alongside the current version and seamlessly switch traffic with minimal downtime.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square\&logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square\&logo=docker\&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square\&logo=docker\&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square\&logo=nginx\&logoColor=white)

---

## 📖 Overview

Blue-Green Deployment is a release strategy that minimizes application downtime by maintaining two identical environments:

* **Blue** – the currently active version serving production traffic.
* **Green** – the new version deployed alongside the Blue environment.

Instead of replacing the running application, the Green environment is deployed independently. After verifying that the new version is healthy, traffic is switched from Blue to Green through an **Nginx reverse proxy**. If any issues occur, traffic can be immediately switched back to the Blue environment.

This project uses a simple **Todo REST API** as the sample application and demonstrates how Docker networking, Docker Compose, and Nginx work together to implement a Blue-Green deployment strategy.

---

## 🏗️ Architecture

```text
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
```

Only one API version receives traffic at a time. Switching deployments only requires updating the Nginx configuration and reloading the proxy, resulting in a near zero-downtime deployment.
