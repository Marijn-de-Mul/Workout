import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Category, SessionLocal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class CategoryRequest(BaseModel):
    name: str
    description: str = None
    type: str = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/get', response_model=list[CategoryRequest])
def get_categories(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching categories for user id: {current_user_id}")
    categories = db.query(Category).all()
    return categories

@router.post('/post')
def create_category(category: CategoryRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Creating a new category for user id: {current_user_id}")
    new_category = Category(name=category.name, description=category.description, type=category.type)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return {'message': 'Create category successful'}

@router.get('/get/{id}', response_model=CategoryRequest)
def get_category(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Fetching category with id {id} for user id: {current_user_id}")
    category = db.query(Category).get(id)
    if not category:
        logger.debug("Category not found")
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put('/put/{id}')
def update_category(id: int, category: CategoryRequest, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Updating category with id {id} for user id: {current_user_id}")
    db_category = db.query(Category).get(id)
    if not db_category:
        logger.debug("Category not found")
        raise HTTPException(status_code=404, detail="Category not found")
    db_category.name = category.name
    db_category.description = category.description
    db_category.type = category.type
    db.commit()
    db.refresh(db_category)
    return {'message': 'Update category successful'}

@router.delete('/delete/{id}')
def delete_category(id: int, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_subject()
    logger.debug(f"Deleting category with id {id} for user id: {current_user_id}")
    category = db.query(Category).get(id)
    if not category:
        logger.debug("Category not found")
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {'message': 'Delete category successful'}