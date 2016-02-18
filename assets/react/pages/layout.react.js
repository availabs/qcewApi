var React = require('react'),
    RouteHandler = require('react-router').RouteHandler,
    
    //-- Stores
    GeoStore = require('../stores/GeoStore'),
    QCEWStore = require('../stores/QCEWStore');





var App = React.createClass({

    getState : function(){
        return {
	    GeoData: GeoStore.getAll(),
	    QCEWData: QCEWStore.getAll(),
        };
    },

    getInitialState: function(){
        return this.getState();
    },

    _onChange: function() {
        this.setState(this.getState());
    },

    componentDidMount: function() {
	GeoStore.addChangeListener(this._onChange);
	QCEWStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
	GeoStore.removeChangeListener(this._onChange);
	QCEWStore.removeChangeListener(this._onChange);
    },


    render: function() {
	console.log(this.state);
        return (
        	<div>
    	    	<div className="row">
                
	        <RouteHandler
	         geoData={this.state.GeoData}
	         qcewData={this.state.QCEWData}
 		/>
                
		
    	    	</div>
        	</div>
        );
    },

    

});

module.exports = App;
