module.exports = function() {
    var mod;
    var query;
    var bigquery;

    mod  = {
	
	pass : function(fields,conditions,cb){
	    if(!bigquery)//defined in the global namespace see bootstrap.js
		bigquery = bigQuery();
	    var err;

	    query = this._buildQuery(fields,conditions);
	    console.log(query);
	    console.log("STARTING BIGQUERY");
	    console.time("FINISHED BIG QUERY");
	    bigquery(query,(err,data) =>{
		console.timeEnd("FINISHED BIG QUERY");
		if(err){
		    console.log('on error')
		    return cb(err);
		}
		console.log('on success');
		data = this._processData(data);
		cb(err,data);
	    });
	},
	    
	_processData : (response) =>{
	    var simpleD =bigquery.parseResult(response)
	    return simpleD;
	    
	},
    
	_buildQuery : function(fields,conditions){
	    var query = `SELECT ${fields.toString()} from [tmasWIM12.qcewMetro]
	    where ${conditions.join(' AND ')}`;
	    return query
	},
    };
    return mod;
};
