# Workout

**This project is in active development, there may be bugs and a lack of features until version 1 is released.**

Workout is an open-source workout planner designed to store and organize structured workout schematics. Instead of manually searching for routines, users can quickly pull up pre-built workout plans.

## Features

- **Workout Categories** – Organize workouts by type (Push, Pull, Legs, Full Body, etc.).
- **Exercise Library** – Store predefined and custom exercises with descriptions and media.
- **Routine Builder** – Create structured workout plans with sets, reps, and rest times.
- **Quick Access Mode** – Instantly pull up today’s workout without distractions.
- **Cloud Sync** – Access workouts from multiple devices.
- **Minimal & Gym-Friendly UI** – Designed for quick navigation and readability.

## Tech Stack

### Backend:
- .NET (C#) for API development
- Entity Framework for database management
- MySQL for data storage

### Frontend:
- React with Remix.run 

## Installation

A installation command to run it without docker will be added as soon as the script is ready. 

### Docker Setup
To run the application using Docker, ensure you have Docker and Docker Compose installed.

### Docker Compose
Create a docker-compose.yml file with the following content:

```
services:
  workout_db:
    image: mysql:8.0
    container_name: workout_db
    platform: linux/amd64
    environment:
      MYSQL_ROOT_PASSWORD: workout
      MYSQL_DATABASE: workout
      MYSQL_USER: workout
      MYSQL_PASSWORD: workout
    ports:
      - "3502:3306"
    volumes:
      - workout_db_data:/var/lib/mysql

  workout_backend:
    image: marijndemul16/workout.backend:latest
    container_name: workout_backend
    platform: linux/amd64
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=workout_db;Database=workout;User=workout;Password=workout;
    ports:
      - "3501:8080"
    depends_on:
      - workout_db

  workout_frontend:
    image: marijndemul16/workout.frontend:latest
    container_name: workout_frontend
    platform: linux/amd64
    ports:
      - "3500:3000"
    depends_on:
      - workout_backend

  workout_watchtower:
    image: containrrr/watchtower
    container_name: workout_watchtower
    platform: linux/amd64
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=300

volumes:
  workout_db_data:
```

#### Running the Application
To start the application with Docker Compose, run the following command from the root of the project directory:

```sh
docker-compose up -d
```

This will start the database, backend, frontend, and watchtower services.

### Contributing
We welcome contributions! Feel free to submit issues, feature requests, or pull requests.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

🚀 Get started with Workout and streamline your training plans!
