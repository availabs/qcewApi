'use strict'

var AppDispatcher = require('../dispatcher/AppDispatcher');
var QCEWConstants = require('../constants/QCEWConstants');
var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');

var ActionTypes = QCEWConstants.QCEWTypes;
var CHANGE_EVENT = 'change';

var _qcew = {},
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
});


QCEWStore.dispatchToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    switch(action.type) {
	case ActionTypes.GET_QCEW_DATA:
	console.log(action.data);
	break;
	
	case ActionTypes.SET_QCEW_DATA:
	console.log(action.data);
	break;
	
	default:
	//do nothing
    }

});

module.exports = QCEWStore;
