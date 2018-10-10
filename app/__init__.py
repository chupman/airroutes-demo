from flask_api import FlaskAPI

# local import
from instance.config import app_config

from flask import requesy, jsonify, abort

# JanusGraph Python Driver import
from janusgraph_python.driver.ClientBuilder import JanusGraphClient
connection = JanusGraphClient().connect(url="127.0.0.1", port="8182", graph="airroutes_traversal").get_connection()
g = Graph().traversal().withRemote(connection)

def create_app(config_name):
    app = FlaskAPI(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')

    return app
