# Cloit Full Stack Assignment

This guide will help you set up and run the Cloit Full Stack assignment on your local machine.

## Prerequisites

Ensure you have the following tools installed on your machine:
- Node.js (v14+)
- Yarn
- PostgreSQL

## Step 1: Database Setup

1. **Create a `.env` file** in the root of the project.
2. **Start a PostgreSQL database** and obtain the connection string.
3. Add the connection string to the `.env` file as an environment variable:
   ```bash
   DATABASE_URL=your_postgres_connection_string_here

## Step 2: Running the Code

1. Clone the repository:
   ```bash
   git clone https://github.com/jatinder14/hypire-full-stack-assignment.git

2. install corepack, npm and yarn
3. Yarn install
4. cd packages/prisma
5. npx prisma migrate dev
6. npx prisma generate
7. cd apps/cloit-be
8. npm run start:dev
9. cd apps/cloit-fe
10. npm run dev

The backend API runs on http://localhost:8080
The frontend application runs on http://localhost:3000