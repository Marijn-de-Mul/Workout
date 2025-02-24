import logging
from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

ns_category = Namespace('Category', description='Category operations', path='/api/Category')

category_model = ns_category.model('CategoryRequest', {
    'name': fields.String(required=True, description='The category name'),
    'description': fields.String(description='The category description'),
    'type': fields.String(description='The category type')
})

@ns_category.route('/')
class CategoryList(Resource):
    @ns_category.marshal_list_with(category_model)
    @jwt_required()
    def get(self):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Fetching categories for user id: {current_user_id}")
        categories = Category.query.all()
        return categories

    @ns_category.expect(category_model)
    @jwt_required()
    def post(self):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Creating a new category for user id: {current_user_id}")
        data = request.get_json()
        new_category = Category(name=data['name'], description=data['description'], type=data['type'])
        db.session.add(new_category)
        db.session.commit()
        return {'message': 'Create category successful'}

@ns_category.route('/<int:id>')
class CategoryById(Resource):
    @ns_category.marshal_with(category_model)
    @jwt_required()
    def get(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Fetching category with id {id} for user id: {current_user_id}")
        category = Category.query.get_or_404(id)
        return category

    @ns_category.expect(category_model)
    @jwt_required()
    def put(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Updating category with id {id} for user id: {current_user_id}")
        data = request.get_json()
        category = Category.query.get_or_404(id)
        category.name = data['name']
        category.description = data['description']
        category.type = data['type']
        db.session.commit()
        return {'message': 'Update category successful'}

    @jwt_required()
    def delete(self, id):
        logger.debug(f"Authorization Header: {request.headers.get('Authorization')}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Deleting category with id {id} for user id: {current_user_id}")
        category = Category.query.get_or_404(id)
        db.session.delete(category)
        db.session.commit()
        return {'message': 'Delete category successful'}