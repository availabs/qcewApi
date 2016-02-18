
/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 */

var io = require('./sails.io.js')();
var d3 = require('d3');
var GeoApp = require('../../../AppConfig').geourl;

var ServerActionCreators = require('../actions/ServerActionsCreator');

//---------------------------------------------------
// Socket Events
//--------------------------------------------------
function listenToSockets(sessionUser){

}


module.exports = {

  init:function(user){
      this.getGeoData('MSA','');
  },


  //-------------------------------------------
  // GeoData
  //-------------------------------------------
  getGeoData : function(type,id,cb){
      d3.json(GeoApp+type + '/' + id, (err,data) =>{
	  ServerActionCreators.setData('geo',data);
	  if(cb){cb(data);}
      });
  },
  //---------------------------------------------------
  // Sails Rest Route
  //---------------------------------------------------
  get : function(type,id,cb){
    io.socket.get('/'+type+'/'+id,function(data){
      ServerActionCreators.receiveDataWithId(type,id,data);
      if(cb){cb(data);}
    });
  },

  create: function(type,data,cb){
    var url = '';
    if(type.type)
      url = type.type;
    else {
      url = type;
    }
    d3.json('/'+url).post(JSON.stringify(data),function(err,resData){
      if(err){
        console.log('Create Err',err);
      }
      var retype;
      if(type.type){
        retype = type.returnType;
      }
      else{
        retype = type;
      }
      //console.log('create',type,resData);
      //add new user back to store through
      ServerActionCreators.receiveData(retype,[resData]);
      if(cb) {cb(resData);}
    });
  },

  read: function(model) {
    var url = '',type='';
    if(model.options){
      url += '/' + model.type+'?';
      var temp =  Object.keys(model.options).map(function(d){
        return d+'='+model.options[d];
      });
      if(temp.length !== 0)
        url += temp.reduce(function(p,c){return p+'&'+c;});
      type = model.type;
    }
    else{
      type = model;
      url += '/' + model;
    }

    var where = {};
    d3.json(url,function(err,data){
      //console.log('utils/sailsWebApi/getUsers',data);
      ServerActionCreators.receiveData(type,data);
    });
  },

  update: function(model,data,cb){
    var url = '';
    if(model.options){
      url += '/' + model.type+'?';
      var temp =  Object.keys(model.options).map(function(d){
        return d+'='+model.options[d];
      });
      if(temp.length !== 0)
        url += temp.reduce(function(p,c){return p+'&'+c;});
    }else{
      url += '/'+model+'/'+data.id;
    }
    io.socket.put(url,data,function(resData){
      var type = (model.options) ? model.returnType:model;
      //add new user back to store through
      ServerActionCreators.receiveData(type,[resData]);
      if(cb){cb(resData);}
    });
  },

  delete: function(type,id){
    d3.json('/'+type+'/'+id)
    .send('DELETE',function(resData){
      console.log('utils/sailsWebApi/delete',resData,id);

      //Delete
      ServerActionCreators.deleteData(type,id);
    });
  }

};
