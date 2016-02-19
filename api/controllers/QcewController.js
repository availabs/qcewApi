/**
 * QcewController
 *
 * @description :: Server-side logic for managing qcews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var lodash = sails.util._;

var bqdb = require('../services/FieldService');

var metadb = require('../services/idservice');
/**
 *This module should only handle the processing of the 
 *api query string, no data processing or data querying 
 *should live here
 *
 *Project Overview -> request to api endpoint
 *                 -> endpoint dynamically constructed
 *                 -> endpoint sends decoded requrest to db module
 *                 -> db module validates query 
 *                 -> db module constructs actual query
 *                 -> db connection receives query 
 *                 -> db module passes results to processing module
 *                 -> db receives results and passes back to controller
 *                 -> controller recieves results
 *                 -> controller decides response type and responds
 */



module.exports = {
    endpoint:function(req,res){
	var opts = getUrlParams(req);
	var fields = req.param('fields');
	console.log(fields);
	var columns = null;
	var params = [];
	console.log(opts)
	try{
	    bqdb.querydb(opts,fields,(err,data)=>{
		if(err){
		    return res.send(err,500); 
		}

		return res.json(data);
	    });
	}catch(err){
	    console.log(err);
	    return res.send(err,500);
	}
    },
    
    idEndpoint : function(req,res){
	var opts = getUrlParams(req);
	var type = opts.splice(0,1)[0] //data type to be listed first
	var criterion = opts; //rest of params all for criteria
	
	console.log(opts);
	try{
	    metadb.querydb(type,criterion,(data) => {
		res.json(data);
	    });
	}catch(err){
	    console.log(err);
	    return res.send(err,500);
	}
    }
};

function getUrlParams(req){
    var params = req.param('0').split('/').filter(a=>a); //remove empty strings
    return params
}
