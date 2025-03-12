import logging
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from endpoints.auth import router as auth_router
from endpoints.category import router as category_router
from endpoints.exercise import router as exercise_router
from endpoints.routine import router as routine_router

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATABASE_URL = 'mysql+mysqlconnector://workout:workout@192.168.178.245:3502/workout'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI(
    title="Workout.API",
    description="A simple Workout API",
    version="2.0"
)

Base.metadata.create_all(bind=engine)

@AuthJWT.load_config
def get_config():
    return {
        "authjwt_secret_key": "ya172914d82aa8cc99c5e5ae937acfdfbd6144a0291bf978fc63ce0656aaa89787dc0bafcb5cae384990acc2434f1311840524a71cb7dff644b4bce60bf7f19a32869b62d7b63eba48442b0757a77524b931996181c1dd910bbfdcb3a5bdb6acddfc29be08522eee645a7cace12937133f4b1052a7a6ae198c03563fe1dc169316a1bca94787a17ee8dc8dadac3fd3bc4cc28408a00969cf71884828dd8ccb1fd4a3ec0a9bc869e88ab19f3037e6079011dc0d01edb445cf2ee4b3fa1417d03a42dc071b8c9ec710cb6a7dd63c1241de94b0fbb9267e22d080cdc9cb48d95e52929ec8c955d10503aa4b5a5aa09325dcbf2af5f885d8ee7b38c0a0cc990905efd"
    }

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.debug(f"Request Headers: {request.headers}")
    logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
    logger.debug(f"Request Body: {await request.body()}")
    response = await call_next(request)
    logger.debug(f"Response Status: {response.status_code}")
    logger.debug(f"Response Headers: {response.headers}")
    logger.debug(f"Response Body: {response.body}")
    return response

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

app.include_router(auth_router, prefix="/api/Auth")
app.include_router(category_router, prefix="/api/Category")
app.include_router(exercise_router, prefix="/api/Exercise")
app.include_router(routine_router, prefix="/api/Routine")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="debug")