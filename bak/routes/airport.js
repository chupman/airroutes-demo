const express = require('express');
const router = express.Router();

const config = require('../config');
const Gremlin = require('gremlin');
const client = Gremlin.createClient(config.port, config.host, {session: true});
const gremlin = Gremlin.makeTemplateTag(client);
const CGF = "graph = ConfiguredGraphFactory.open('airroutes');g = graph.traversal()"
const csrf = require('csurf')


/**
 * @api {get} /airports?start=true&airport="San Fr"  Request arrays of routes using query strings
 * @apiName GetRoutes
 * @apiGroup Routes
 * @apiVersion 0.1.0
 * @apiParam {string} start substrings match desc, code,icao, or city
 * @apiParam {string} dest substrings match desc, code,icao, or city
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
  start = req.query.start == 'true' ? true : false;
  dest = req.query.dest == 'true' ? true : false;
  str = req.query.str;
  
  client.execute(`graph = ConfiguredGraphFactory.open('airroutes');g = graph.traversal(); 
                  g.V().or(has('desc', textContainsRegex('.*${str}.*')), has('code', textContainsPrefix('${str}')),
                           has('icao', textContainsPrefix('${str}')), has('city', textContainsPrefix('.*${str}.*'))).valueMap('code', 'desc')`, (err, results) => {
    if (!err) {
      // clean up the empty labels array that the query returns
      results = cleanResults(results);
      res.json(results);
    } else {
      res.send(err);
    }
  });

});

router.get('/string/', function getRoutes(req, res, next) {
  start = req.query.start == 'true' ? true : false;
  dest = req.query.dest == 'true' ? true : false;
  str = req.query.str;

  client.execute(`graph = ConfiguredGraphFactory.open('airroutes');g = graph.traversal();
                  g.V().or(has('desc', textRegex('.*${str}.*')), has('code', textPrefix('${str}')),
                           has('icao', textPrefix('${str}')), has('city', textRegex('.*${str}.*'))).valueMap('code', 'desc')`, (err, results) => {
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
  clean = [];
  for (i = 0; i < results.length; i++){
    map = {};
    map["code"] = results[i]["code"][0];
    map["desc"] = results[i]["desc"][0];
    clean[i] = map;
  }
  return clean;
}

module.exports = router;
