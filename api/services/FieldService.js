/** FieldService.js
 */

var lodash = sails.util._;
var d3 = require('d3');
var dbconn = require('../services/dbBridge')();
var meta_data= {
    fields:[
	'area_fips',
	'own_code',
	'industry_code',
	'agglvl_code',
	'size_code',
	'year',
	'qtr',
	'disclosure_code',
	'area_title',
	'own_title',
	'industry_title',
	'agglvl_title',
	'size_title',
	
	'qtrly_estabs_count',
	'month1_emplvl',
	'month2_emplvl',
	'month3_emplvl',
	'total_qtrly_wages',
	'taxable_qtrly_wages',
	'qtrly_contributions',
	'avg_wkly_wage',
	'lq_disclosure_code',
	'lq_qtrly_estabs_count',
	'lq_month1_emplvl',
	'lq_month2_emplvl',
	'lq_month3_emplvl',
	'lq_total_qtrly_wages',
	'lq_taxable_qtrly_wages',
	'lq_qtrly_contributions',
	'lq_avg_wkly_wage',
	'oty_disclosure_code',
	'oty_qtrly_estabs_count_chg',
	'oty_qtrly_estabs_count_pct_chg',
	'oty_month1_emplvl_chg',
	'oty_month1_emplvl_pct',
	'oty_month2_emplvl_chg',
	'oty_month2_emplvl_pct',
	'oty_month3_emplvl_chg',
	'oty_month3_emplvl_pct',
	'oty_total_qtrly_wages_chg',
	'oty_total_qtrly_wages_pct',
	'oty_taxable_qtrly_wages_chg',
	'oty_taxable_qtrly_wages_pct',
	'oty_qtrly_contributions_chg',
	'oty_qtrly_contributions_pct',
	'oty_avg_wkly_wage_chg',
	'oty_avg_wkly_wage_pct',
    ],
    defaultFields : [
	'area_fips',
	'own_code',
	'industry_code',
	'qtr',
	'year',
	'qtrly_estabs_count',
	'lq_qtrly_estabs_count',

    ],
    valid:{
	mandatory : ['fips','yr'],
	queryable: {
	    'qtr':true,
	    'yr':true,
	    'fips':true,
	    'ind':true,
	    'oc':true,
	    'alvl':true,

	},
	keymap:{
	    'qtr':'qtr',
	    'yr':'year',
	    'fips':'area_fips',
	    'ind':'industry_code',
	    'oc':'own_code',
	    'alvl':'agglvl_code',

	},
	formatmap:{
	    'qtr':1,
	    'yr':4,
	    'fips':5,
	    'ind':6,
	    'oc':1,
	    'alvl':2,

	},
    },
};
module.exports = {
    /**
     *This function is a convenience function
     *to access this modules data definition
     */
    _meta_data : function(){
	return meta_data;
    },

    /**
     *This function is used to determine if the list of 
     *fields being queried is valid from the structure 
     *of the data.
     */
    _isValid : function(fieldmap){
	var params = lodash.keys(fieldmap);
	var validConstraints = params.reduce((p,c) =>{//over passed fields
	    var len = meta_data.valid.formatmap[c];   //get field constraint
	    if(!len)                                  //if it doesn't exists
		return false;                         //all is lost,otherwise
	    return fieldmap[c].reduce((a,b) =>{       //check that every param
		console.log('field',c,'value',b,'len',len,'vs',b.length);
		return (len === b.length) && a;       //is valid 
	    
	    },true) && p ;
	},true);                                      //if no constraints 
	                                             //passed then it is valid
	
	var fields = lodash.keys(meta_data.valid.queryable);
	var validFields = lodash.intersection(fields,params);
	var areValidFields = validFields.length === params.length;
	console.log('valid check');
	console.log(fields);
	console.log(params);
	console.log(validFields);
	
	//makesure constaints valid, field valid,
	//and that year and area are both constrained
	console.log('constraints',validConstraints,
		    '\nillegal Fields',     !areValidFields)

	var check = x => fieldmap[x] && fieldmap[x].length > 0;
	var fipscheck = check('fips');
	var indcheck = check('ind');
	var yrcheck = check('yr');
	
		    
	return validConstraints && areValidFields &&
	    ((fipscheck && indcheck) || (fipscheck && yrcheck)
	     || (yrcheck && indcheck))


	    
    },
    
    /**
     *This function returns an array of actual column names of the fields
     *being queried
     */
    _columns : function(params){
	var columns;
	console.log('My params',params);
	var keymap = meta_data.valid.keymap;
	var fields = meta_data.fields;
	console.log(params.map(f=>f.toLowerCase()))
	if(params.map(f=>f.toLowerCase()).indexOf('all') >=0)
	    return meta_data.fields;
	if(params){
	    columns = lodash.filter(params, (field) =>{
		console.log(field,keymap[field],fields.indexOf(field));
		return (keymap[field] || fields.indexOf(field) >= 0) 
	    })
	}
	
	if(!columns || !columns.length)
	    columns = this._defaultColumns();
	console.log('My requested columns',columns);
	return columns; 
    },
    

    /**
     *This function retrieves the correctly formated
     *data from the field specified
     *
     *yr2005 ->  [2005]
     */

    _fieldConditions : function(field){
	var w = 1;
	var flag;
	lodash.keys(meta_data.valid.formatmap).forEach((key)=>{
	    if(field.includes(key)){
		flag = key
		w = meta_data.valid.formatmap[key]
	    }

	});
	var re;
	if(flag === 'fips'){
	    re = new RegExp('C\\d{4}|CS\\d{3}|US000|USCMS|USNMS'+
			   '|USMSA|\\d{5}','g')
	    return field.match(re).slice(0,5); //allow no more than 5 fips 
	   
	}
	else{
	    re = new RegExp("\\d{1,"+ w + "}","g");
	    
	    return field.match(re);
	}
	
    },

    /**
     *This function finds the conditional statements 
     *for the fields specified
     *
     * i.e. qtr4 -> qtr = 4
     */
    _getConditions : function(fields){
	var conditionMap = {};
	fields.forEach((field) => {
	    var fieldname = this._getFieldName(field);
	    var value = this._fieldConditions(field);
	    conditionMap[fieldname] = value;
	});
	return conditionMap;
    },
    
    _buildConditions : function(condMap){
	var conds = lodash.keys(condMap).map( (fieldname) =>{
	    if(fieldname && condMap[fieldname] && condMap[fieldname].length){
		var map = condMap[fieldname];
		return meta_data.valid.keymap[fieldname]+
		((map.length < 2) ? 
		    "='"+map.join('')+"'" :
		    " in ('"+map.join("','")+"')");
		}
	    else
		return '';
	});
	console.log(conds);
	return conds;
    },
    
    /**
     *Base function to retrieve all of the default names
     *for the dataset 
     */
    _defaultColumns : function(){
	return meta_data.defaultFields;
    },


    /**
     *Function to retrieve the just the field names
     *that were sent in the api call
     *[fips36001,yr2002] -> [fips,yr]
     */
    _getFieldNames : function(fields){
	var fieldnames = [];
	fields.forEach((field)=>{
	    var f = this._getFieldName(field);
	    if(f){
		fieldnames.push(f);
	    }
	});
	return fieldnames;
    },

    /**
     *Function to return the field name of a given field
     * fips35001 -> fips
     */
    _getFieldName : function(field){
	var name;
	lodash.keys(meta_data.valid.formatmap).forEach((fieldname) =>{
	    if(field.includes(fieldname)){
		name = fieldname;
	    }
	});
	return name;
    },

    /**
     * Function to send to validated and structured data
     * to be constructed into a query
     */
    querydb : function(params,columns,out,cb){
	var map    = this._getConditions(params);
	var qtype = "area"
	
	if(!this._isValid(map)){
	    
	    throw new Error('Malformed field','FieldService',129);
	}
	console.log(map);
	if(map.ind){
	    map.ind = map.ind.map(code =>{
		return removeZeros(code);
	    });
	}
	
	if( !(map.fips && map.fips.length > 0)){
	    qtype='all area';
	    
	}
	var tfields = Object.keys(map).map(val =>{ 
	    return meta_data.valid.keymap[val];
	})
			
	var t = this._columns(columns);
	

	
	dbconn.pass(lodash.union(t,tfields),this._buildConditions(map),(e,d)=>{
	    
	    if(out || !d.rows){
		cb(e,d);
		return;
	    }
	    

	    var objrows = d.rows.map(el => {
	    	return d.schema.reduce((obj,t,i)=>{
	    	    obj[t] = el[i];
		    return obj;
	    	},{});
	    });
	    var retdata = d3.nest();

	    Object.keys(map).forEach(p=>{
		retdata.key(s => s[meta_data.valid.keymap[p]])
	    });
	    var vals = retdata.entries(objrows);

	    cb(e,vals);
	});
	
    },    
};

/*This is a function to remove leading zeros in strings*/
function removeZeros(code){
    var l = code.length
    var i = 0;
    for(; i < l; i++){
	if(code[i] !== '0')
	    break;
    }
    return code.substr(i,l-i);
}
