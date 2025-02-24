from flask import request
from flask_restx import Namespace, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

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
        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password, data['password']):
            return {'message': 'Login successful'}
        return {'message': 'Invalid credentials'}, 401

@ns_auth.route('/register')
class Register(Resource):
    @ns_auth.expect(register_model)
    def post(self):
        data = request.get_json()
        if data['password'] != data['confirmPassword']:
            return {'message': 'Passwords do not match'}, 400
        hashed_password = generate_password_hash(data['password'], method='sha256')
        new_user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Registration successful'}

@ns_auth.route('/me')
class GetMe(Resource):
    def get(self):
        # Implement get me logic here
        return {'message': 'Get me successful'}