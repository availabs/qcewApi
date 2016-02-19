'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher');
var GeoConstants = require('../constants/GeoConstants');
var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');
var SailsWebApi = require('../utils/sailsWebApi');
var ActionTypes = GeoConstants.GeoTypes;
var CHANGE_EVENT = 'change';
var topojson = require('topojson');
var _geos = {},
    _MetaData=[],
    loading = '';
    

function fromTopo(topology,geom){
    var f = topojson.feature(topology,geom,function(a,b){return true});
    
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

    getMeta : function(){
	return _MetaData;
    },

});


GeoStore.dispatchToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    switch(action.type) {
	case ActionTypes.GET_GEO_DATA:
	var data = action.data;
	if(Array.isArray(action.data))
	    data = action.data[0];
	getGeoData(data);
	break;
	
	case ActionTypes.SET_GEO_DATA:

	_geos = convertTopo(action.data);
	GeoStore.emitChange();
	break;
	

	case ActionTypes.GET_GEO_META_DATA:
	console.log(action.data);
	break;

	case ActionTypes.SET_GEO_META_DATA:
	console.log('Setting MSA ids',action.data);
	processMeta(action.data);
	_MetaData = action.data;
	GeoStore.emitChange();
	break;
	default:
	//do nothing
    }

});

function processMeta(metaMsa){
    metaMsa.forEach( msa =>{
	msa.area_fips = msa.area_fips.substr(1,msa.area_fips.length) + '0';
    });
    
}

function getGeoData(ids){

    SailsWebApi.getGeoData('MSA',ids);

}
module.exports = GeoStore;
