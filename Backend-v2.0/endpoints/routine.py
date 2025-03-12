import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.orm import Session
from models import Routine, SessionLocal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models that match Swift’s decoding expectations

class RoutineCategoryResponseModel(BaseModel):
    routineId: int
    categoryId: int

    class Config:
        orm_mode = True

class RoutineCategoriesResponse(BaseModel):
    values: List[RoutineCategoryResponseModel] = Field(..., alias="$values")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class RoutineResponseModel(BaseModel):
    id: int
    userId: str   # Swift expects a userId; we set this from the JWT subject
    name: str
    description: str
    routineCategories: Optional[RoutineCategoriesResponse] = None

    class Config:
        orm_mode = True

class RoutinesListResponse(BaseModel):
    id: str = Field("routineResponse", alias="$id")
    values: List[RoutineResponseModel] = Field(..., alias="$values")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

# Request model for creating/updating routines
class RoutineCreateRequest(BaseModel):
    name: str
    description: str

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper to convert an SQLAlchemy Routine into our response model.
def routine_to_response(routine: Routine, user_id: str) -> RoutineResponseModel:
    return RoutineResponseModel(
        id=routine.id,
        userId=user_id,
        name=routine.name,
        description=routine.description,
        # Convert related routine categories if present.
        routineCategories=RoutineCategoriesResponse(values=routine.categories) if routine.categories else None
    )

@router.get('/get', response_model=RoutinesListResponse)
def get_routines(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching routines for user id: {current_user_id}")
    routines = db.query(Routine).all()
    response = [routine_to_response(r, current_user_id) for r in routines]
    return RoutinesListResponse(id="routineResponse", values=response).dict(by_alias=True)

@router.post('/post', response_model=RoutineResponseModel)
def create_routine(routine_req: RoutineCreateRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Creating a new routine for user id: {current_user_id}")
    # Create a new Routine using only name and description.
    new_routine = Routine(
        name=routine_req.name,
        description=routine_req.description
    )
    db.add(new_routine)
    db.commit()
    db.refresh(new_routine)
    return routine_to_response(new_routine, current_user_id)

@router.get('/get/{id}', response_model=RoutineResponseModel)
def get_routine(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching routine with id {id} for user id: {current_user_id}")
    routine = db.query(Routine).get(id)
    if not routine:
        logger.debug("Routine not found")
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine_to_response(routine, current_user_id)

@router.put('/put/{id}', response_model=RoutineResponseModel)
def update_routine(id: int, routine_req: RoutineCreateRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Updating routine with id {id} for user id: {current_user_id}")
    db_routine = db.query(Routine).get(id)
    if not db_routine:
        logger.debug("Routine not found")
        raise HTTPException(status_code=404, detail="Routine not found")
    db_routine.name = routine_req.name
    db_routine.description = routine_req.description
    db.commit()
    db.refresh(db_routine)
    return routine_to_response(db_routine, current_user_id)

@router.delete('/delete/{id}')
def delete_routine(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Deleting routine with id {id} for user id: {current_user_id}")
    routine = db.query(Routine).get(id)
    if not routine:
        logger.debug("Routine not found")
        raise HTTPException(status_code=404, detail="Routine not found")
    db.delete(routine)
    db.commit()
    return {'message': 'Delete routine successful'}