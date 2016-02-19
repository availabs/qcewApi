/**
* Areas.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      area_fips: {
	  type:'string',
	  required:true,
      },
      area_title:{
	  type:'string',
	  required:true,
      },
  }
};

