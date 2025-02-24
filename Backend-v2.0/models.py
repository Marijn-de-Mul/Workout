from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Category(db.Model):
    __tablename__ = 'Categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    type = db.Column(db.String(80))

class ExerciseCategory(db.Model):
    __tablename__ = 'ExerciseCategories'
    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('Exercises.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.id'), nullable=False)

class Exercise(db.Model):
    __tablename__ = 'Exercises'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    routine_id = db.Column(db.Integer, db.ForeignKey('Routines.id'), nullable=False)
    categories = db.relationship('ExerciseCategory', backref='exercise', lazy=True)

class RoutineCategory(db.Model):
    __tablename__ = 'RoutineCategories'
    id = db.Column(db.Integer, primary_key=True)
    routine_id = db.Column(db.Integer, db.ForeignKey('Routines.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('Categories.id'), nullable=False)

class Routine(db.Model):
    __tablename__ = 'Routines'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    categories = db.relationship('RoutineCategory', backref='routine', lazy=True)