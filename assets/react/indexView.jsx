/*globals require,console,module,window*/
'use strict';
//---------------------------------------
// App Controller View
// One Per Server Side Route
//
//---------------------------------------

//  --- Libraries
var React = require('react'),
    Router = require('react-router'),
    Route = Router.Route,
    Routes = Router.Routes,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute,
    
    //  --- Layout Controller View
    App = require('./pages/layout.react'),

    //  --- Pages
    page = require('./pages/Page.react.js');
// --- Server API
var sailsWebApi = require('./utils/sailsWebApi.js');

// ---
    sailsWebApi.init();


var i18n = {
  locales: ["en-US"]
};


//  --- Routes
var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={page}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler locales={i18n.locales}/>, document.body);
});
