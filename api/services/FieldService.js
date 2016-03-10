/** FieldService.js
 */

var lodash = sails.util._;
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
	combinations:[
	    [],
	    ['qtr'],
	    ['ind'],
	    ['oc'],
	    ['alvl']
	    ['qtr','ind'],
	    ['qtr','qec'],
	    ['qtr','alvl'],
	    ['oc','alvl'],
	    ['ind','oc']
	    ['oc','alvl'],
	    ['qtr','oc'],
	    ['qtr','ind','alvl'],
	    ['qtr','oc','alvl'],
	    ['ind','oc','alvl'],
	    ['qtr','ind','oc'],
	    ['qtr','ind','oc','alvl'],
	],
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
	
	var validFields = lodash.find(meta_data.valid.combinations, (lst) =>{
	    return lodash.xor(params,meta_data
			             .valid
			             .mandatory
			             .concat(lst)).length === 0;
	});
	//makesure constaints valid, field valid,
	//and that year and area are both constrained
	console.log('constraints',validConstraints,
		    '\nillegal Fields',     validFields,
		    '\nyear', fieldmap['yr'] && fieldmap['yr'].length > 0,
		    '\nfips', fieldmap['fips'] && fieldmap['fips'].length > 0);
	return validConstraints && validFields && 
	    fieldmap['yr'] && fieldmap['yr'].length > 0 && 
	    fieldmap['fips'] && fieldmap['fips'].length > 0;
    },
    
    /**
     *This function returns the actual column names of the fields
     *being queried
     */
    _columns : function(params){
	var columns;
	console.log('My params',params);
	if(params){
	    columns = lodash.map(lodash.filter(params, (field) =>{
		return meta_data.valid.keymap[field]; 
	    }), (field) => meta_data.valid.keymap[field]
			       ).join(','); //end of map
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
	}else{
	    re = new RegExp("\\d{1,"+ w + "}","g");
	}
	return field.match(re);
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
	    console.log(fieldname,value);
	    conditionMap[fieldname] = value;
	});
	return conditionMap;
    },
    
    _buildConditions : function(condMap){
	var conds = lodash.keys(condMap).map( (fieldname) =>{
	    if(fieldname)
		return meta_data.valid.keymap[fieldname]+
		"='"+condMap[fieldname].join('')+"'";
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
	return meta_data.defaultFields.join(',');
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
    querydb : function(params,columns,cb){
	var map    = this._getConditions(params);
	console.log('fieldmap',map);
	if(!this._isValid(map)){
	    throw new Error('Malformed field','FieldService',129);
	}
	dbconn.pass(this._columns(columns),this._buildConditions(map),cb);
	
    },
    
};
