from flask import request
from flask_restx import Namespace, Resource, fields
from models import db, Exercise

ns_exercise = Namespace('Exercise', description='Exercise operations')

exercise_model = ns_exercise.model('ExerciseRequest', {
    'name': fields.String(required=True, description='The exercise name'),
    'description': fields.String(description='The exercise description'),
    'routineId': fields.Integer(required=True, description='The routine ID'),
    'categoryId': fields.Integer(required=True, description='The category ID')
})

@ns_exercise.route('/')
class ExerciseList(Resource):
    @ns_exercise.marshal_list_with(exercise_model)
    def get(self):
        exercises = Exercise.query.all()
        return exercises

    @ns_exercise.expect(exercise_model)
    def post(self):
        data = request.get_json()
        new_exercise = Exercise(name=data['name'], description=data['description'], routine_id=data['routineId'])
        db.session.add(new_exercise)
        db.session.commit()
        return {'message': 'Create exercise successful'}

@ns_exercise.route('/<int:id>')
class ExerciseById(Resource):
    @ns_exercise.marshal_with(exercise_model)
    def get(self, id):
        exercise = Exercise.query.get_or_404(id)
        return exercise

    @ns_exercise.expect(exercise_model)
    def put(self, id):
        data = request.get_json()
        exercise = Exercise.query.get_or_404(id)
        exercise.name = data['name']
        exercise.description = data['description']
        exercise.routine_id = data['routineId']
        db.session.commit()
        return {'message': 'Update exercise successful'}

    def delete(self, id):
        exercise = Exercise.query.get_or_404(id)
        db.session.delete(exercise)
        db.session.commit()
        return {'message': 'Delete exercise successful'}