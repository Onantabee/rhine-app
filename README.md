# Rhine: A Real-Time Task Management Application

Rhine is a full-featured, real-time task management application designed for seamless collaboration. It provides a robust, professional platform for teams to organize, track, and discuss tasks and projects with high performance and data integrity.

The application is built with a modern tech stack, featuring a React frontend and a Spring Boot backend, all containerized with Docker and ready for production-grade deployment via Kubernetes.

## Features

### Project Management
- **Centralized Project Control:** Easily create and manage multiple projects to compartmentalize work.
- **Dynamic Project Switching:** A persistent project picker that synchronizes state across refreshed and deep links.
- **Role-Based Membership:** Invite team members with specific roles (Admin/Member) and manage their access.

### Task Management
- **Full CRUD Suite:** Create, update, and delete tasks with instant UI 반영.
- **Rich Task Details:** Comprehensive drawer view for task descriptions, priority levels, due dates, and assignees.
- **Status Workflow:** Track progress through "TO DO", "ONGOING", and "COMPLETED" states.

### Real-Time Collaboration
- **Low-Latency Updates:** Powered by Raw WebSockets (STOMP), ensuring that comments and task changes are reflected instantly across all clients without manual refreshing.
- **Interactive Commenting:** Discuss task details with team members directly within the task view, featuring unread message counters.
- **Developer-Friendly Logging:** Enhanced WebSocket tracing in the console for easy debugging.

### Security & Authentication
- **Unified Auth Module:** Consolidated authentication architecture powered by Spring Security and JWT.
- **Email Verification:** OTP-based verification for new accounts and invitation-driven project onboarding.
- **Automatic Cache Purging:** High-security session management that wipes all sensitive RTK Query data from memory upon logout or 401 expiration.

---

## Tech Stack

| Category      | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| **Frontend**  | React 19, Vite, Redux Toolkit (RTK Query), Tailwind CSS, Lucide Icons   |
| **Backend**   | Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, MySQL       |
| **Real-Time** | WebSockets (Native / STOMP)                                             |
| **API**       | RESTful API with OpenAPI v3 (Swagger UI) documentation                  |
| **DevOps**    | Docker, Docker Compose, Jenkins, Ansible, Kubernetes (K8s)              |
| **Testing**   | JUnit 5, Mockito, H2 (In-memory Test Database)                          |

---

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd rhine-app
    ```

2.  **Set up environment variables:**
    Navigate to the `ops` directory and create your `.env` file:
    ```bash
    cd ops
    cp .env.example .env
    ```
    Open `.env` and configure your credentials:
    - `SPRING_MAIL_USERNAME`: Your SMTP email address.
    - `SPRING_MAIL_PASSWORD`: Your SMTP App Password.
    - `JWT_SECRET_KEY`: A secure, random string for token signing.
    - `VITE_API_BASE_URL`: Set to `http://localhost:8080` for local dev.

3.  **Launch with Docker Compose:**
    From the `ops` directory, build and start the cluster:
    ```bash
    docker-compose up --build
    ```
    This launches the backend, frontend, and MySQL database in a unified network.

4.  **Access points:**
    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **API Documentation (Swagger):** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
    - **H2 Console (Internal Testing):** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## Project Structure

```text
rhine-app/
├── backend/      # Spring Boot application (Maven)
├── frontend/     # React application (Vite/Redux)
├── ops/          # Infrastructure-as-code (Docker, Jenkins, Ansible, K8s)
└── README.md     # Project documentation
```

- **`backend/`**: Handles business logic, real-time messaging, and JWT security.
- **`frontend/`**: Modern SPA with centralized state management and WebSocket middleware.
- **`ops/`**: Contains full CI/CD pipeline definitions and production deployment manifests.
