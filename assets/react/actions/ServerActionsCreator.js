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
   setData : function(type,data){
       var actiontype = 'SET_'+type.toUpperCase() + '_DATA';
       AppDispatcher.handleServerAction({
	   type: ActionTypes[actiontype],
	   data:data,
       });
   },
   
   setMetaData : function(type,data){
      var actiontype= 'SET_'+type.toUpperCase() + '_META_DATA';
      console.log
      AppDispatcher.handleServerAction({
	  type: ActionTypes[actiontype],
	  data:data,
      });
   },

};
