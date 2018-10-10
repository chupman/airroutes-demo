import os
import json
import ast

from flask import Flask, render_template, request, jsonify
# JanusGraph Python driver imports
"""
from janusgraph_python.driver.ClientBuilder import JanusGraphClient
from janusgraph_python.core.attribute.TextPredicate.Text import Text

from janusgraph_python.serializer.CircleSerializer import CircleSerializer, Circle
from janusgraph_python.serializer.GeoShapeDeserializer import GeoShapeDeserializer
from gremlin_python.process.graph_traversal import __

# All Geoshapes in JanusGraph are identified by `Geoshape`
# while Relation Identifier by `RelationIdentifier`
geoshape_identifier = "Geoshape"

# The Deserializer class to deserialize into Python object
geoshape_deserializer = GeoShapeDeserializer
# The Python object which needs to be deserialized into JanusGraph object.
obj_to_register = Circle
# The class to Serialize Python object into its GraphSON correspondent
circle_serializer = CircleSerializer

# Register Serializer and Deserializer with JanusGraphReader and Writer service
from janusgraph_python.structure.io.GraphsonWriter import JanusGraphSONWriter
from janusgraph_python.structure.io.GraphsonReader import JanusGraphSONReader
from janusgraph_python.structure.io.GraphsonReader import JanusGraphSONReader

reader = JanusGraphSONReader().register_deserializer(geoshape_identifier, geoshape_deserializer)
writer = JanusGraphSONWriter().register_serializer(obj_to_register, circle_serializer)
"""
# Apply the connected reader and writer service while creating JanusGraph connection
from gremlin_python.structure.graph import Graph
#from janusgraph_python.driver.ClientBuilder import JanusGraphClient

from gremlin_python import statics
from gremlin_python.structure.graph import Graph
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.strategies import *
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

from gremlin_python.structure.io.graphsonV2d0 import GraphSONWriter
from gremlin_python.structure.io.graphsonV2d0 import GraphSONReader
from gremlin_python.structure.io.graphsonV2d0 import PathDeserializer

graph = Graph() # no need to create a TinkerGraph
g = graph.traversal().withRemote(DriverRemoteConnection('ws://localhost:8182/gremlin','airroutes_traversal'))


#connection = JanusGraphClient().connect(url="0.0.0.0", port="8182", graph="airroutes_traversal", graphson_reader=reader, graphson_writer=writer).get_connection()
# connection = JanusGraphClient().connect(url="0.0.0.0", port="8182", graph="airroutes_traversal",).get_connection()
#g = Graph().traversal().withRemote(connection)
out = __.out
has = __.has
times = __.times
propertyMap= __.propertyMap
valueMap = __.valueMap

app = Flask(__name__)

@app.route("/")

def index():
    svg = './static/usa.svg'
    return render_template('index.html', svg=svg)

@app.route("/routes/", methods=['get'])
def get_routes():
    start = request.args.get('start')
    dest = request.args.get('dest')
    numResults = int(request.args.get('limit'))
    hops = int(request.args.get('hops'))

    response = g.V().has('code', start).repeat(out('route').simplePath()).times(hops).has('code', dest).path().by(valueMap()).limit(numResults).toList()
    return jsonify(ast.literal_eval(response.__str__()))

if __name__ == '__main__':
    app.run(debug=True)
