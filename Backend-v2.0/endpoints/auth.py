import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from models import User, SessionLocal

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    confirmPassword: str

class UserLogin(BaseModel):
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/login')
def login(user: UserLogin, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    logger.debug(f"Login attempt with email: {user.email}")
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user and check_password_hash(db_user.password, user.password):
        access_token = Authorize.create_access_token(identity=str(db_user.id))
        logger.debug(f"Login successful for user id: {db_user.id}")
        return {'message': 'Login successful', 'token': access_token}
    logger.debug("Invalid credentials")
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post('/register')
def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.debug(f"Registration attempt with email: {user.email}")
    if user.password != user.confirmPassword:
        logger.debug("Passwords do not match")
        raise HTTPException(status_code=400, detail="Passwords do not match")
    hashed_password = generate_password_hash(user.password, method='pbkdf2:sha256')
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.debug(f"Registration successful for user id: {new_user.id}")
    return {'message': 'Registration successful'}

@router.get('/me')
def get_me(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    current_user_id = Authorize.get_jwt_identity()
    logger.debug(f"Fetching user info for user id: {current_user_id}")
    user = db.query(User).get(current_user_id)
    if user:
        return {'username': user.username, 'email': user.email}
    logger.debug("User not found")
    raise HTTPException(status_code=404, detail="User not found")