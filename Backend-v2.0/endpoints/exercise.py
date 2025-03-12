import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.orm import Session
from models import Exercise, SessionLocal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

# Response model matching Swift's expectations.
class ExerciseResponseModel(BaseModel):
    id: int
    userId: str
    routineId: int
    name: str
    description: Optional[str] = None
    # exerciseCategories and routine can be added here if needed

    class Config:
        orm_mode = True

# Wrapper for list responses using "$id" and "$values"
class ExercisesListResponse(BaseModel):
    id: str = Field("exerciseResponse", alias="$id")
    values: List[ExerciseResponseModel] = Field(..., alias="$values")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

# Request model for creating/updating exercises.
class ExerciseCreateRequest(BaseModel):
    routineId: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Map SQLAlchemy Exercise to our response model. The userId is taken from the JWT.
def exercise_to_response(exercise: Exercise, user_id: str = "") -> ExerciseResponseModel:
    return ExerciseResponseModel(
        id=exercise.id,
        userId=user_id,
        routineId=exercise.routine_id,
        name=exercise.name,
        description=exercise.description
    )

@router.get('/get', response_model=ExercisesListResponse)
def get_exercises(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching exercises for user id: {current_user_id}")
    exercises = db.query(Exercise).all()
    response = [exercise_to_response(e, current_user_id) for e in exercises]
    return ExercisesListResponse(id="exerciseResponse", values=response).dict(by_alias=True)

@router.post('/post', response_model=ExerciseResponseModel)
def create_exercise(request: ExerciseCreateRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Creating a new exercise for user id: {current_user_id}")
    new_exercise = Exercise(
        name=request.name,
        description=request.description,
        routine_id=request.routineId
    )
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return exercise_to_response(new_exercise, current_user_id)

@router.get('/get/{id}', response_model=ExerciseResponseModel)
def get_exercise(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching exercise with id {id} for user id: {current_user_id}")
    exercise = db.query(Exercise).get(id)
    if not exercise:
        logger.debug("Exercise not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise_to_response(exercise, current_user_id)

@router.put('/put/{id}', response_model=ExerciseResponseModel)
def update_exercise(id: int, request: ExerciseCreateRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Updating exercise with id {id} for user id: {current_user_id}")
    db_exercise = db.query(Exercise).get(id)
    if not db_exercise:
        logger.debug("Exercise not found")
        raise HTTPException(status_code=404, detail="Exercise not found")
    db_exercise.name = request.name
    db_exercise.description = request.description
    db_exercise.routine_id = request.routineId
    db.commit()
    db.refresh(db_exercise)
    return exercise_to_response(db_exercise, current_user_id)

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