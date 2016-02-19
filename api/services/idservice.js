var lodash = sails.util._;

var defaultCritera = {
    naics : {},
    msa   : {area_title :{'endsWith':'MSA'}}, 
};


//meta db
module.exports = {
    sourceMapping : function(type){
	switch(type){
	    case 'naics':
	    return Naics;
	    break;

	    case 'msa':
	    return Areas;
	    break;
	    
	    default:
	}
    },
    
    querydb : function(type,criteria,cb){
	console.log(type,criteria);
	var model = this.sourceMapping(type);
	var where = defaultCritera[type];
	if(!model)
	    throw new Error('Undefined meta type');
	if(criteria){
	    
	}
	model.find(where).exec( (err,data) => {
	    console.log(err,data);
	    if(err){
		console.log(err);
		throw err;
	    }else{
		cb(data);
	    }
	    
	});
    },

};
