from flask import Flask
from flask_restx import Api
from models import db
from endpoints.auth import ns_auth
from endpoints.category import ns_category
from endpoints.exercise import ns_exercise
from endpoints.routine import ns_routine

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://workout:workout@192.168.178.228:3502/workout'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

api = Api(app, version='1.0', title='Workout.API', description='A simple Workout API')

api.add_namespace(ns_auth)
api.add_namespace(ns_category)
api.add_namespace(ns_exercise)
api.add_namespace(ns_routine)

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)