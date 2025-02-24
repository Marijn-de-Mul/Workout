from flask import request
from flask_restx import Namespace, Resource, fields
from models import db, Routine

ns_routine = Namespace('Routine', description='Routine operations')

routine_model = ns_routine.model('RoutineRequest', {
    'name': fields.String(required=True, description='The routine name'),
    'description': fields.String(description='The routine description'),
    'categoryId': fields.Integer(required=True, description='The category ID')
})

@ns_routine.route('/')
class RoutineList(Resource):
    @ns_routine.marshal_list_with(routine_model)
    def get(self):
        routines = Routine.query.all()
        return routines

    @ns_routine.expect(routine_model)
    def post(self):
        data = request.get_json()
        new_routine = Routine(name=data['name'], description=data['description'], category_id=data['categoryId'])
        db.session.add(new_routine)
        db.session.commit()
        return {'message': 'Create routine successful'}

@ns_routine.route('/<int:id>')
class RoutineById(Resource):
    @ns_routine.marshal_with(routine_model)
    def get(self, id):
        routine = Routine.query.get_or_404(id)
        return routine

    @ns_routine.expect(routine_model)
    def put(self, id):
        data = request.get_json()
        routine = Routine.query.get_or_404(id)
        routine.name = data['name']
        routine.description = data['description']
        routine.category_id = data['categoryId']
        db.session.commit()
        return {'message': 'Update routine successful'}

    def delete(self, id):
        routine = Routine.query.get_or_404(id)
        db.session.delete(routine)
        db.session.commit()
        return {'message': 'Delete routine successful'}