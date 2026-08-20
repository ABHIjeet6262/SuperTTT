# SuperTTT — Strategic Full-Stack Super Tic-Tac-Toe

SuperTTT is a full-stack, real-time multiplayer implementation of **Super Tic-Tac-Toe**. The application features registered and guest play, live WebSocket state synchronization, active-board highlighting, rematch handling, quick emoji reactions, and player statistics.

---

## Technical Stack

- **Frontend**: React.js, React Router, CSS Modules, SockJS & STOMP WebSocket Client.
- **Backend**: Java 21, Spring Boot 3.3, Spring Web, Spring Security (JWT), Spring WebSocket, Spring Data JPA.
- **Database**: MySQL 8.0 with Hibernate ORM.

---

## Project Structure

```
SuperTTT/
├── frontend/             # React SPA (Vite)
│   ├── src/
│   │   ├── components/  # Game board, cells, overlay, navigation
│   │   ├── pages/       # Home, Login, Register, Lobby, Game, HowToPlay
│   │   ├── services/    # REST API & WebSocket service wrappers
│   │   └── context/     # Auth & Game React contexts
│   └── package.json
├── backend/              # Spring Boot REST & WebSocket Service
│   ├── src/
│   │   ├── main/java/com/supertictactoe/
│   │   └── main/resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── pom.xml
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 21+
- MySQL Server 8.0+

### Database Setup
1. Start MySQL Server (Port 3306).
2. Create database `supertictactoe_db` or let Spring Boot create it automatically:
   ```sql
   CREATE DATABASE IF NOT EXISTS supertictactoe_db;
   ```

### Running Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
