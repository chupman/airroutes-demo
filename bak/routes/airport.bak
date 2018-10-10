const express = require('express');
const router = express.Router();

const config = require('../config');
const Gremlin = require('gremlin');
const client = Gremlin.createClient(config.port, config.host, {session: true});
const gremlin = Gremlin.makeTemplateTag(client);
const CGF = "graph = ConfiguredGraphFactory.open('airroutes');g = graph.traversal();"
const csrf = require('csurf')



/**
 * @api {get} /airport get properties of an Airport by airport code
 * @apiName GetAirport
 * @apiGroup Airport
 * @apiVersion 0.1.0
 * @apiParam {string} code 3 character airport code of starting airport
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         id: 4160,
 *         label: "airport",
 *         type: "vertex",
 *         properties: {
 *           country: [
 *             {
 *               id: "16w-37k-4qt",
 *               value: "US"
 *             }
 *           ],
 *           code: [
 *             {
 *               id: "1l4-37k-1l1",
 *               value: "SFO"
 *             }
 *           ],
 *           ...
 *       }
 *     ]
 *
 * @apiError AirportNotFound will return an empty array
 *
 * @apiErrorExample Error-Response:
 *     [ ]
 */
router.get('/', function(req, res, next) {
  code = req.query.code;
  
  client.execute(`graph = ConfiguredGraphFactory.open("airroutes");g = graph.traversal();
                  g.V().has('code', '${code}')`, (err, results) => {
  // Alternate query
  //client.execute("g.V().has('code', 'SFO').repeat(both().simplePath()).until(has('code','JFK')).path().limit(3)", (err, results) => {
    if (!err) {
      res.json(results);
    } else {
      res.send(err);
    }
  });

});


/**
 * @api {post} /airport add a new airport
 * @apiName PostAirport
 * @apiGroup Airport
 * @apiVersion 0.1.0
 * @apiParam {string} code 3 character airport code of starting airport
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         id: 4160,
 *         label: "airport",
 *         type: "vertex",
 *         properties: {
 *           country: [
 *             {
 *               id: "16w-37k-4qt",
 *               value: "US"
 *             }
 *           ],
 *           code: [
 *             {
 *               id: "1l4-37k-1l1",
 *               value: "SFO"
 *             }
 *           ],
 *           ...
 *       }
 *     ]
 *
 * @apiError AirportNotFound will return an empty array
 *
 * @apiErrorExample Error-Response:
 *     [ ]
 */
router.post('/', function(req, res) {
  start = req.body.start;
  dest = req.body.dest;
  limit = req.body.limit;

  client.execute(`graph = ConfiguredGraphFactory.open("airroutes");g = graph.traversal();
                  g.V().has('code', '${start}').repeat(out('route').simplePath()).times(3).has('code', '${dest}').path().by('code').limit(${limit})`, (err, results) => {
  // Alternate query
  //client.execute("g.V().has('code', 'SFO').repeat(both().simplePath()).until(has('code','JFK')).path().limit(3)", (err, results) => {
    if (!err) {
      res.json({req: req.body, results: results});
    } else {
      res.send(err);
    }
  });

});

module.exports = router;
