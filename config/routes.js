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
    //'/demo' : 'LandingController.index',
    'GET /data*' : 'QcewController.endpoint',
    'POST /data*': 'QcewController.endpoint',
    'GET /ids*'  : 'QcewController.idEndpoint', 

    'PUT /*': {response: 'notFound'},
    'POST /*':{response: 'notFound'},
    'DELETE /*':{response: 'notFound'},

    
};
