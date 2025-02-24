import logging
from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

ns_auth = Namespace('Auth', description='Authentication operations')

login_model = ns_auth.model('LoginRequest', {
    'email': fields.String(required=True, description='The user email'),
    'password': fields.String(required=True, description='The user password')
})

register_model = ns_auth.model('RegisterRequest', {
    'username': fields.String(required=True, description='The user username'),
    'email': fields.String(required=True, description='The user email'),
    'password': fields.String(required=True, description='The user password'),
    'confirmPassword': fields.String(required=True, description='The user password confirmation')
})

@ns_auth.route('/login')
class Login(Resource):
    @ns_auth.expect(login_model)
    def post(self):
        data = request.get_json()
        logger.debug(f"Login attempt with email: {data['email']}")
        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=str(user.id))
            logger.debug(f"Login successful for user id: {user.id}")
            return {'message': 'Login successful', 'token': access_token}
        logger.debug("Invalid credentials")
        return {'message': 'Invalid credentials'}, 401

@ns_auth.route('/register')
class Register(Resource):
    @ns_auth.expect(register_model)
    def post(self):
        data = request.get_json()
        logger.debug(f"Registration attempt with email: {data['email']}")
        if data['password'] != data['confirmPassword']:
            logger.debug("Passwords do not match")
            return {'message': 'Passwords do not match'}, 400
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        logger.debug(f"Registration successful for user id: {new_user.id}")
        return {'message': 'Registration successful'}

@ns_auth.route('/me')
class GetMe(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        logger.debug(f"Fetching user info for user id: {current_user_id}")
        user = User.query.get(current_user_id)
        if user:
            return {'username': user.username, 'email': user.email}
        logger.debug("User not found")
        return {'message': 'User not found'}, 404