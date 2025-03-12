import logging
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse, Response, StreamingResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from endpoints.auth import router as auth_router
from endpoints.category import router as category_router
from endpoints.exercise import router as exercise_router
from endpoints.routine import router as routine_router
from config import settings

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
    return settings

# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     logger.debug(f"Request Headers: {request.headers}")
#     logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
#     logger.debug(f"Request Body: {await request.body()}")
#     response = await call_next(request)
#     logger.debug(f"Response Status: {response.status_code}")
#     logger.debug(f"Response Headers: {response.headers}")
    
#     try:
#         response_body = b""
#         async for chunk in response.body_iterator:
#             response_body += chunk
#         logger.debug(f"Response Body: {response_body.decode('utf-8')}")

#         async def new_body_iterator():
#             yield response_body

#         response.body_iterator = new_body_iterator()
#     except Exception as e:
#         logger.error(f"Error logging response body: {e}")
    
#     return response

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

app.include_router(auth_router, prefix="/api/Auth/")
app.include_router(category_router, prefix="/api/Category/")
app.include_router(exercise_router, prefix="/api/Exercise/")
app.include_router(routine_router, prefix="/api/Routine/")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="debug")