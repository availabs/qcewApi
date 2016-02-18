/**
 * Server Actions
 *
 *
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var GeoConstants = require('../constants/GeoConstants');
var ActionTypes = GeoConstants.GeoTypes;


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

};
