const express = require('express');
const router = express.Router();

const config = require('../config');
const Gremlin = require('gremlin');
const client = Gremlin.createClient(config.port, config.host, {session: true});
const gremlin = Gremlin.makeTemplateTag(client);
const CGF = "graph = ConfiguredGraphFactory.open('airroutes');g = graph.traversal();"
const csrf = require('csurf')


/**
 * @api {get} /routes?start=SFO&dest=JFK&limit=3&hops=2  Request arrays of routes using query strings
 * @apiName GetRoutes
 * @apiGroup Routes
 * @apiVersion 0.1.0
 * @apiParam {string} start 3 character airport code of starting airport
 * @apiParam {string} dest  3 character airport code of desired destination
 * @apiParam {number} limit max number of routes to be returned
 * @apiParam {number} hops number of hops between start and destination
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "objects": [
 *           "SFO",
 *           "ANC",
 *           "IAH",
 *           "JFK"
 *         ]
 *       }
 *     ]
 *
 * @apiError RouteNotFound will return an empty array
 *
 * @apiErrorExample Error-Response:
 *     [ ]
 */
router.get('/', function getRoutes(req, res, next) {
  start = req.query.start;
  dest = req.query.dest;
  limit = req.query.limit;
  hops = req.query.hops;
  
  client.execute(`graph = ConfiguredGraphFactory.open("airroutes");g = graph.traversal();
                  g.V().has('code', '${start}').repeat(out('route').simplePath()).times(${hops}).has('code', '${dest}').path().by(valueMap()).limit(${limit})`, (err, results) => {
  // Alternate query
  //client.execute("g.V().has('code', 'SFO').repeat(both().simplePath()).until(has('code','JFK')).path().limit(3)", (err, results) => {
    if (!err) {
      // clean up the empty labels array that the query returns
      results = cleanResults(results);
      res.json(results);
    } else {
      res.send(err);
    }
  });

});

function cleanResults(results) {
  for (i = 0; i < results.length; i++){
    delete results[i]["labels"];
  }
  return results;
}

module.exports = router;
