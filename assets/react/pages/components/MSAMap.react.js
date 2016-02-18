var React = require('react'),
    LeafletMap = require('../../components/utils/LeafletMap.react');
var msaGeo = null,
    msaGeoId = 0;

var emptyGeoJson = {type:'FeatureCollection',features:[]};
var MSAMap = React.createClass({
    

    _calcLayers(){
	if(!msaGeo && Object.keys(this.props.msaGeo).length > 0){
	    msaGeo = this.props.msaGeo;
	    msaGeoId++;
	}

	var layers = {

	    msaLayer : {
		id: msaGeoId,
		geo:msaGeo || emptyGeoJson,
		options:{
		    zoomOnLoad:true,
		    style(feature){
			return {
			    className:'msa_' + feature.properties.geoid,
			    fillColor:'rgb(69, 237, 139)',
			    weight:1,
			    opacity:0.5,
			    fillOpacity:0.5,
			    };
		    },
		},
		onEachFeature(feature,layer){

		    layer.on({
			mouseover(e){
			    e.target.setStyle({weight:6});
			},
			mouseout(e){
			    e.target.setStyle({weight:1});
			},
			
		    });
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
