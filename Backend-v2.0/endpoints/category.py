from flask import request
from flask_restx import Namespace, Resource, fields
from models import db, Category

ns_category = Namespace('Category', description='Category operations')

category_model = ns_category.model('CategoryRequest', {
    'name': fields.String(required=True, description='The category name'),
    'description': fields.String(description='The category description'),
    'type': fields.String(description='The category type')
})

@ns_category.route('/')
class CategoryList(Resource):
    @ns_category.marshal_list_with(category_model)
    def get(self):
        categories = Category.query.all()
        return categories

    @ns_category.expect(category_model)
    def post(self):
        data = request.get_json()
        new_category = Category(name=data['name'], description=data['description'], type=data['type'])
        db.session.add(new_category)
        db.session.commit()
        return {'message': 'Create category successful'}

@ns_category.route('/<int:id>')
class CategoryById(Resource):
    @ns_category.marshal_with(category_model)
    def get(self, id):
        category = Category.query.get_or_404(id)
        return category

    @ns_category.expect(category_model)
    def put(self, id):
        data = request.get_json()
        category = Category.query.get_or_404(id)
        category.name = data['name']
        category.description = data['description']
        category.type = data['type']
        db.session.commit()
        return {'message': 'Update category successful'}

    def delete(self, id):
        category = Category.query.get_or_404(id)
        db.session.delete(category)
        db.session.commit()
        return {'message': 'Delete category successful'}