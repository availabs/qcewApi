/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcryptjs');
module.exports = {

    connection:'authServer',
    attributes: {
	username:'string',
	encryptedPassword:'string',
	hashid: 'string',
    },
    /**
     * @TODO: add hash id on create
     */
    beforeCreate : function(values, next){
	if(!values.password || values.password !== values.confirmation){
	    return next({err: ["Password doesn't match confirmation"]});
	}
	User.find({username:values.username})
	    .exec((e,d)=>{
		if(e){console.log(e);return next(e)}
		console.log(d);
		if(d.length !== 0){
		    return next({err:["Username already exists"]});
		}
		bcrypt.hash(values.password,10,(e,encryptPass)=>{
		    if(e) return next(e);
		    values.encryptedPassword = encryptPass;
		    next();
		});
	    });
    },
};

