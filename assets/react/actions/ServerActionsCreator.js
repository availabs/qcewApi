/**
 * Server Actions
 *
 *
 */

var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var GeoTypes = require('../constants/GeoConstants').GeoTypes;
var QCEWTypes = require('../constants/QCEWConstants').QCEWTypes;
var ActionTypes = {};

ActionTypes = _.merge(GeoTypes,QCEWTypes);

module.exports = {

    

  //-----------------------------------
  // GeoData
  //-----------------------------------
  

    // deleteData:function(type,id){
    // 	var actiontype = 'DELETE_'+type.toUpperCase()
    // 	AppDispatcher.handleServerAction({
    // 	    type: ActionTypes[actiontype],
    // 	    Id: id
    // 	});
    // },
   setData : function(type,data,id){
       var actiontype = 'SET_'+type.toUpperCase() + '_DATA';
       var action = {
	   type: ActionTypes[actiontype],
	   data:data,
       };
       if(id)
	   action.id = id;
       AppDispatcher.handleServerAction(action);
   },
   
   setMetaData : function(type,data,id){
       var actiontype= 'SET_'+type.toUpperCase() + '_META_DATA';
       var action = {
	  type: ActionTypes[actiontype],
	  data:data,
      };
       if(id)
	   action.id = id;
      AppDispatcher.handleServerAction(action);
   },

};
