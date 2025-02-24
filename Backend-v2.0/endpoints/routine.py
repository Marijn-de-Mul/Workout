import logging
from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Routine

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

ns_routine = Namespace('Routine', description='Routine operations', path='/api/Routine')

routine_model = ns_routine.model('RoutineRequest', {
    'name': fields.String(required=True, description='The routine name'),
    'description': fields.String(description='The routine description'),
    'categoryId': fields.Integer(required=True, description='The category ID')
})

@ns_routine.route('/')
class RoutineList(Resource):
    @ns_routine.marshal_list_with(routine_model)
    @jwt_required()
    def get(self):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Fetching routines for user id: {current_user_id}")
        routines = Routine.query.all()
        return routines

    @ns_routine.expect(routine_model)
    @jwt_required()
    def post(self):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Creating a new routine for user id: {current_user_id}")
        data = request.get_json()
        new_routine = Routine(name=data['name'], description=data['description'], category_id=data['categoryId'])
        db.session.add(new_routine)
        db.session.commit()
        return {'message': 'Create routine successful'}

@ns_routine.route('/<int:id>')
class RoutineById(Resource):
    @ns_routine.marshal_with(routine_model)
    @jwt_required()
    def get(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Fetching routine with id {id} for user id: {current_user_id}")
        routine = Routine.query.get_or_404(id)
        return routine

    @ns_routine.expect(routine_model)
    @jwt_required()
    def put(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Updating routine with id {id} for user id: {current_user_id}")
        data = request.get_json()
        routine = Routine.query.get_or_404(id)
        routine.name = data['name']
        routine.description = data['description']
        routine.category_id = data['categoryId']
        db.session.commit()
        return {'message': 'Update routine successful'}

    @jwt_required()
    def delete(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Deleting routine with id {id} for user id: {current_user_id}")
        routine = Routine.query.get_or_404(id)
        db.session.delete(routine)
        db.session.commit()
        return {'message': 'Delete routine successful'}