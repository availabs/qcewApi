/**
 * Route Mappings
* (sails.config.routes)
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {

  //----------Main Page----------------------------
    '/': {view:'homepage'},
    '/demo' : 'LandingController.index',
    'PUT /*': {response: 'notFound'},
    'POST /*':{response: 'notFound'},
    'DELETE /*':{response: 'notFound'},

    'GET /data*' : 'QcewController.endpoint',
    'GET /ids*'  : 'QcewController.idEndpoint', 
};
