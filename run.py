import os
import json
import ast

from flask import Flask, render_template, request, jsonify
# JanusGraph Python driver imports

from janusgraph_python.driver.ClientBuilder import JanusGraphClient
from janusgraph_python.core.attribute.Text import Text
from gremlin_python.process.graph_traversal import __

from janusgraph_python.serializer.CircleSerializer import CircleSerializer, Circle
from janusgraph_python.serializer.GeoShapeDeserializer import GeoShapeDeserializer

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

reader = JanusGraphSONReader().register_deserializer(geoshape_identifier, geoshape_deserializer)
writer = JanusGraphSONWriter().register_serializer(obj_to_register, circle_serializer)

# Apply the connected reader and writer service while creating JanusGraph connection
from gremlin_python.structure.graph import Graph
from janusgraph_python.driver.ClientBuilder import JanusGraphClient

from janusgraph_python.core.datatypes.GeoShape import GeoShape
from janusgraph_python.core.attribute import Geo



client = JanusGraphClient().connect(url="0.0.0.0", port="8182", graph="airroutes_traversal", graphson_reader=reader, graphson_writer=writer)
connection = client.get_connection()
g = Graph().traversal().withRemote(connection)

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

@app.route("/airports/", methods=['get'])
def get_airports():
    airport = request.args.get('airport')

    response = g.V().or_(has('desc', Text.textRegex('.*(?i)' + airport + '.*')), has('code', Text.textRegex('.*(?i)' + airport + '.*')), has('icao', Text.textRegex('.*(?i)' + airport + '.*')), has('city', Text.textRegex('.*(?i)' + airport + '.*'))).valueMap('code','desc').toList()
    return jsonify(ast.literal_eval(response.__str__()))

# Currently has deserialization issues and is not working properly.
@app.route("/nearby/", methods=['get'])
def get_nearby():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    distance = int(request.args.get('distance')) # Will need to convert to float once driver is updated.
    area = GeoShape.Circle(lon, lat, distance) # Will need to swap lon and lat once it's fixed in the driver.
#    area = GeoShape.Circle(lat, lon, distance) # Will need to swap lon and lat once it's fixed in the driver.

    response = g.V().has("coords", Geo.geoWithin(area)).valueMap('code', 'desc').toList()

    return jsonify(ast.literal_eval(response.__str__()))


if __name__ == '__main__':
    app.run(debug=True)
