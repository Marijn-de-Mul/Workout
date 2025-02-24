import logging
from flask import Flask, request
from flask_restx import Api
from flask_jwt_extended import JWTManager
from models import db
from endpoints.auth import ns_auth
from endpoints.category import ns_category
from endpoints.exercise import ns_exercise
from endpoints.routine import ns_routine

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://workout:workout@192.168.178.228:3502/workout'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'ya172914d82aa8cc99c5e5ae937acfdfbd6144a0291bf978fc63ce0656aaa89787dc0bafcb5cae384990acc2434f1311840524a71cb7dff644b4bce60bf7f19a32869b62d7b63eba48442b0757a77524b931996181c1dd910bbfdcb3a5bdb6acddfc29be08522eee645a7cace12937133f4b1052a7a6ae198c03563fe1dc169316a1bca94787a17ee8dc8dadac3fd3bc4cc28408a00969cf71884828dd8ccb1fd4a3ec0a9bc869e88ab19f3037e6079011dc0d01edb445cf2ee4b3fa1417d03a42dc071b8c9ec710cb6a7dd63c1241de94b0fbb9267e22d080cdc9cb48d95e52929ec8c955d10503aa4b5a5aa09325dcbf2af5f885d8ee7b38c0a0cc990905efd'  
app.config['PREFERRED_URL_SCHEME'] = 'https'
app.config['FORWARDED_ALLOW_IPS'] = '*'
app.config['RESTX_MASK_SWAGGER'] = False
app.config['RESTX_VALIDATE'] = True
app.config['RESTX_JSON'] = {'ensure_ascii': False, 'indent': 4}
app.config['RESTX_ERROR_404_HELP'] = False
app.config['RESTX_TRAILING_SLASH'] = False
db.init_app(app)

jwt = JWTManager(app)

api = Api(app, version='2.0', title='Workout.API', description='A simple Workout API')

api.add_namespace(ns_auth, path='/api/Auth')
api.add_namespace(ns_category, path='/api/Category')
api.add_namespace(ns_exercise, path='/api/Exercise')
api.add_namespace(ns_routine, path='/api/Routine')

@app.before_request
def log_request_info():
    logger.debug(f"Request Headers: {request.headers}")
    logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
    logger.debug(f"Request Body: {request.get_data()}")

@app.after_request
def log_response_info(response):
    logger.debug(f"Response Status: {response.status}")
    logger.debug(f"Response Headers: {response.headers}")
    logger.debug(f"Response Body: {response.get_data()}")
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)