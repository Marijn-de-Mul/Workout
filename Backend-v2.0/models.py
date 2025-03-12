from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(120), nullable=False)

class Category(Base):
    __tablename__ = 'Categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    description = Column(String(200))
    type = Column(String(80))

class ExerciseCategory(Base):
    __tablename__ = 'ExerciseCategories'
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey('Exercises.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('Categories.id'), nullable=False)

class Exercise(Base):
    __tablename__ = 'Exercises'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    description = Column(String(200))
    routine_id = Column(Integer, ForeignKey('Routines.id'), nullable=False)
    categories = relationship('ExerciseCategory', backref='exercise', lazy=True)

class RoutineCategory(Base):
    __tablename__ = 'RoutineCategories'
    id = Column(Integer, primary_key=True, index=True)
    routine_id = Column(Integer, ForeignKey('Routines.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('Categories.id'), nullable=False)

class Routine(Base):
    __tablename__ = 'Routines'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    description = Column(String(200))
    categories = relationship('RoutineCategory', backref='routine', lazy=True)