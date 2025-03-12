CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(200),
    type VARCHAR(80)
);

CREATE TABLE Exercises (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(200),
    routine_id INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES Routines(id)
);

CREATE TABLE ExerciseCategories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    exercise_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES Exercises(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

CREATE TABLE Routines (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(200)
);

CREATE TABLE RoutineCategories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    routine_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES Routines(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);