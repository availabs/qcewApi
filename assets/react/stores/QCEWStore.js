'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher');
var QCEWConstants = require('../constants/QCEWConstants');
var EventEmitter = require('events').EventEmitter;
var SailsWebApi  = require('../utils/sailsWebApi');
var assign = require('object-assign');

var ActionTypes = QCEWConstants.QCEWTypes;
var CHANGE_EVENT = 'change';

var _qcew = {},
    _naics = [],
    loading = '';

var QCEWStore = assign({},EventEmitter.prototype,{
    
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
	return _qcew[id];
    },

    getAll : function(){
	return _qcew;
    },
    getNaics : function(){
	return _naics;
    },
});


QCEWStore.dispatchToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    switch(action.type) {
	case ActionTypes.GET_QCEW_DATA:
	console.log(action);
	SailsWebApi.getQCEWData(action.criteria);
	break;
	
	case ActionTypes.SET_QCEW_DATA:
	console.log(action.data);
	processQCEWData(action.data);
	QCEWStore.emitChange();
	break;

	case ActionTypes.SET_NAICS_META_DATA:
	console.log(action.data);
	_naics = action.data;
	QCEWStore.emitChange();
	break;
	
	

	default:
	//do nothing
    }

});
module.exports = QCEWStore;

function processQCEWData(data){
    var keymap = data.schema.reduce( (a,b,i) =>{
	a[b] = i;
	return a
    },{});
    var aggregate  = 
	d3.nest()
          .key( d => d[keymap['industry_code']])
          .entries(data.rows)
    
    _qcew=data;
}
