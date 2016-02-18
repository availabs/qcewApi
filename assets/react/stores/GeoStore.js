'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher');
var GeoConstants = require('../constants/GeoConstants');
var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');

var ActionTypes = GeoConstants.GeoTypes;
var CHANGE_EVENT = 'change';
var topojson = require('topojson');
var _geos = {},
    loading = '';
    

function fromTopo(topology,geom){
    var swap = {type:'GeometryCollection',geometries:[geom]}
    var mesh = topojson.mesh(topology,swap,function(a,b){return true});
    var f    = {type:'Feature',
		properties:geom.properties, 
		geometry:{type:mesh.type,
			  coordinates:mesh.coordinates
			  }
	       };
    return f;
}

function convertTopo(topo){
    var json = {type:'FeatureCollection',features:[],
		bbox:topo.bbox, transform:topo.transform};
    if(topo.objects.objs.geometries.forEach){
	topo.objects.objs.geometries.forEach( d => {
	    var f = fromTopo(topo,d);
	    json.features.push(f);
	});
    }else{
	json.features.push(fromTopo(topo,topo.objects.states.objs));
    }
    return json;
}

var GeoStore = assign({},EventEmitter.prototype,{

    emitChange: function(){
	this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback){
	this.on(CHANGE_EVENT,callback);
    },
  
    removeChangeListener: function(callback){
	this.removeListener(CHANGE_EVENT,callback);
    },

    get: function(id){
	return _geos[id];
    },

    getAll : function(){
	return _geos
    },

});


GeoStore.dispatchToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    switch(action.type) {
	case ActionTypes.GET_GEO_DATA:
	console.log(action.data);
	break;
	
	case ActionTypes.SET_GEO_DATA:

	_geos = convertTopo(action.data);
	GeoStore.emitChange();
	break;
	
	default:
	//do nothing
    }

});

module.exports = GeoStore;
