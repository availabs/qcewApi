var AppDispatcher = require('../dispatcher/AppDispatcher');
var GeoTypes= require('../constants/GeoConstants').GeoTypes;

var QCEWTypes = require('../constants/QCEWConstants').QCEWTypes;

module.exports = {

    getMSAData : function(ids){
	var actiontype = 'GET_GEO_DATA'
	AppDispatcher.handleViewAction({
	    type: GeoTypes[actiontype],
	    data: ids,
	});
    },

    getNaicsData : function(ids){
	var actiontype = 'GET_NAICS_DATA';
	AppDispatcher.handleViewAction({
	   type: QCEWTypes[actiontype],
	    data: ids,
	});

    },

}
