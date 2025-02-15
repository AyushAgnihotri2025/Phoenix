# Phoenix: Gadget Management API

## Overview

Phoenix is a RESTful API designed for managing gadgets efficiently. Built using Node.js and Express, it leverages Prisma as an ORM and PostgreSQL as the database. The API allows users to create, update, and manage gadgets with various statuses while ensuring data security and validation.

## Features

- CRUD operations for gadgets
- Prisma ORM integration for database interactions
- API documentation with Swagger
- Authentication and authorization using JWT
- Validation using Zod
- Dockerized setup for seamless deployment

## Tech Stack

- **Backend:** Node.js, Express.js, Zod, Bcrypt
- **Database:** PostgreSQL
- **ORM:** Prisma
- **API Documentation:** Swagger
- **Containerization:** Docker, Docker Compose

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AyushAgnihotri2025/Phoenix.git
cd Phoenix
```

### 2. Set Up Environment Variables

Copy the sample environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your database credentials and other necessary configurations.

### 3. Run with Docker

Ensure Docker and Docker Compose are installed. Then, run:

```bash
docker-compose up --build
```

This will start the application along with a PostgreSQL database.

### 4. Run Locally (Without Docker)

If running without Docker, ensure PostgreSQL is running, then:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## API Documentation

After starting the server, access the API documentation at:

```
http://localhost:PORT/api-docs
```

This provides an interactive way to test and understand API endpoints.

## Troubleshooting

- Ensure `.env` is correctly configured with the right `DATABASE_URL`.
- Check if Docker and PostgreSQL are running properly.
- Use `npx prisma studio` to inspect the database visually.
- View logs for errors using `docker logs phoenix-api`.

## License

See the [GNU General Public License](https://github.com/AyushAgnihotri2025/Phoenix/blob/master/LICENSE) for more details.

This project needs a star️ from you. Don't forget to leave a star✨
Follow my Github for content
<br>
<br>
<hr>
<h6 align="center">© Ayush Agnihotri 2025 
<br>
All Rights Reserved</h6>
