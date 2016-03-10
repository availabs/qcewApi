
/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 */

var io = require('./sails.io.js')();
var d3 = require('d3');
var Apps = require('../../../AppConfig'),
    GeoApp = Apps.geourl,
    QcewApp = Apps.qcewurl;
console.log(Apps);
var localApp = '/';
var ServerActionCreators = require('../actions/ServerActionsCreator');

var census2qcew = {
    area : function(id){
	return 'C' + id.substr(0,4);
    },
};

//---------------------------------------------------
// Socket Events
//--------------------------------------------------
function listenToSockets(sessionUser){

}


module.exports = {

  init:function(user){
      this.getNaicsCodes();
      this.getDataIds('msa');
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

  getDataIds : function(type,cb){
      d3.json(localApp+'ids/'+type, (err,data) =>{
	  ServerActionCreators.setMetaData('geo',data);
	  if(cb){cb(data);}
      });
  },

  getNaicsCodes : function(cb){
      d3.json(localApp+'ids/naics', (err,data) => {
	  ServerActionCreators.setMetaData('naics',data);
	  if(cb){cb(data);}
      });
  },

  getQCEWData : function(criteria,cb){
      var year = criteria.year[0];
      var naics = criteria.naics;
      var area = census2qcew.area(criteria.area[0]);
      var url = QcewApp+'/fips'+area+'/yr'+year+'/qtr1/oc0';
      console.log(url);
      d3.json(url, (err,data)=>{
      		  ServerActionCreators.setData('qcew',data);
      		  if(cb){cb(data)}
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
