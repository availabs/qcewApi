var React = require('react'),
    _     = require('lodash'),
    LeafletMap = require('../../components/utils/LeafletMap.react');
var msaGeo = null,
    msaGeoId = 0;

var emptyGeoJson = {type:'FeatureCollection',features:[]};
var MSAMap = React.createClass({
    

    _calcLayers(){
	if(Object.keys(this.props.msaGeo).length > 0 && (!msaGeo ||
	  this.props.msaGeo && !_.isEqual(this.props.msaGeo,msaGeo)) ){
	    msaGeo = this.props.msaGeo;
	    msaGeoId++;
	}
	

	var layers = {

	    msaLayer : {
		id: msaGeoId,
		geo:msaGeo || emptyGeoJson,
		options:{
		    zoomOnLoad:true,
		    zoomOnUpdate:true,
		    style:function(feature){
			console.log(feature);
			return {
			    stroke:true,
			    className:'msa_' + feature.properties.geoid,
			    fillColor:'#888fff',
			    fillOpacity:0.2,
			    
			    };
		    },
		    onEachFeature(feature,layer){
			console.log(feature);
			layer.on({
			    mouseover(e){
				e.target.setStyle({fillOpacity:0.5});
			    },
			    mouseout(e){
				e.target.setStyle({fillOpacity:0.2});
			    },
			    
			});
		    },
		},
		

	    }

	}

	return layers
	    
    },

    render : function(){
	var layers = this._calcLayers();
	return (
	    <LeafletMap
	    layers= {layers}
	    height='950px'
		/>

	);
    },
});

module.exports = MSAMap;
