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

class RoutineResponseModel(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    categoryId: Optional[int] = None  

    class Config:
        orm_mode = True

class RoutinesListResponse(BaseModel):
    id: str = Field("routineResponse", alias="$id")
    values: List[RoutineResponseModel] = Field(..., alias="$values")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/get', response_model=RoutinesListResponse)
def get_routines(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching routines for user id: {current_user_id}")
    routines = db.query(Routine).all()
    return RoutinesListResponse(id="routineResponse", values=routines).dict(by_alias=True)

@router.post('/post', response_model=RoutineResponseModel)
def create_routine(routine: RoutineResponseModel, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Creating a new routine for user id: {current_user_id}")
    new_routine = Routine(
        name=routine.name,
        description=routine.description,
        category_id=routine.categoryId  
    )
    db.add(new_routine)
    db.commit()
    db.refresh(new_routine)
    return new_routine

@router.get('/get/{id}', response_model=RoutineResponseModel)
def get_routine(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching routine with id {id} for user id: {current_user_id}")
    routine = db.query(Routine).get(id)
    if not routine:
        logger.debug("Routine not found")
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine

@router.put('/put/{id}', response_model=RoutineResponseModel)
def update_routine(id: int, routine: RoutineResponseModel, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Updating routine with id {id} for user id: {current_user_id}")
    db_routine = db.query(Routine).get(id)
    if not db_routine:
        logger.debug("Routine not found")
        raise HTTPException(status_code=404, detail="Routine not found")
    db_routine.name = routine.name
    db_routine.description = routine.description
    db_routine.category_id = routine.categoryId
    db.commit()
    db.refresh(db_routine)
    return db_routine

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