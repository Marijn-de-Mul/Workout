import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Exercise, SessionLocal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class ExerciseRequest(BaseModel):
    name: str
    description: str = None
    routineId: int
    categoryId: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/get', response_model=list[ExerciseRequest])
def get_exercises(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching exercises for user id: {current_user_id}")
    exercises = db.query(Exercise).all()
    return exercises

@router.post('/post', response_model=ExerciseRequest)
def create_exercise(exercise: ExerciseRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Creating a new exercise for user id: {current_user_id}")
    new_exercise = Exercise(
        name=exercise.name, 
        description=exercise.description, 
        routine_id=exercise.routineId, 
        category_id=exercise.categoryId
    )
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return new_exercise

@router.get('/get/{id}', response_model=ExerciseRequest)
def get_exercise(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching exercise with id {id} for user id: {current_user_id}")
    exercise = db.query(Exercise).get(id)
    if not exercise:
        logger.debug("Exercise not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

@router.put('/put/{id}', response_model=ExerciseRequest)
def update_exercise(id: int, exercise: ExerciseRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Updating exercise with id {id} for user id: {current_user_id}")
    db_exercise = db.query(Exercise).get(id)
    if not db_exercise:
        logger.debug("Exercise not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    db_exercise.name = exercise.name
    db_exercise.description = exercise.description
    db_exercise.routine_id = exercise.routineId
    db_exercise.category_id = exercise.categoryId
    db.commit()
    db.refresh(db_exercise)
    return db_exercise

@router.delete('/delete/{id}')
def delete_exercise(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Deleting exercise with id {id} for user id: {current_user_id}")
    exercise = db.query(Exercise).get(id)
    if not exercise:
        logger.debug("Exercise not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    db.delete(exercise)
    db.commit()
    return {'message': 'Delete exercise successful'}