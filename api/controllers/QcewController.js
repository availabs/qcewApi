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
 *                 -> endpoint sends decoded request to db module
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
	var flat = req.param('flat');
	console.log('flat',flat);
	console.log(fields);
	var postObj = parseBody(req.body)

	if(postObj){
	    opts = postObj.opts
	    fields = postObj.fields
	    flat = postObj.flat
	}

	console.log(opts)
	try{
	    bqdb.querydb(opts,fields,flat,(err,data)=>{
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
    var params = req.param('0').split('/').filter(a=>a); //remove empty string
    return params
}

function parseBody(body) {
    console.log(body)
    var obj = {}
    if(body.query)
	obj.opts = body.query.split('/').filter(a=>a)
    if(body.fields)
	obj.fields = body.fields
    if(body.flat)
	obj.flat = body.flat
    console.log(obj)
    if(Object.keys(obj).length)
	return obj
}
