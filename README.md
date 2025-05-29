# Todo Task Manager Backend

RESTful API backend for the Todo Task Management application.

## Features

- Social authentication (Google, GitHub, Facebook)
- JWT-based authentication
- User-specific task management
- CRUD operations for tasks
- Input validation and error handling
- MongoDB integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/social-login` - Social login callback
- GET `/api/auth/me` - Get current user

### Tasks
- GET `/api/tasks` - Get all tasks for current user
- POST `/api/tasks` - Create new task
- PATCH `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

## Development

The server uses nodemon for development, which automatically restarts when files change.

## Production

For production deployment:
1. Set appropriate environment variables
2. Run `npm start`

This project is a part of a hackathon run by https://www.katomaran.com
