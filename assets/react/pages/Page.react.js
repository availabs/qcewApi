var React = require('react'),
    MSAMap = require('./components/MSAMap.react'),
    QCEWselectors= require('./components/QCEWselects.react');



    


var Page = React.createClass({

    render : function(){

	return (
	    <div>
	   
	    <div className='row'>
		<div className='col-lg-2'>
		
		<QCEWselectors />
		
		</div>
		<div className='col-lg-10'>
		     <MSAMap 
	               msaGeo={this.props.geoData}
		     />
		</div>
		</div>
		</div>
	       );
    },
});

module.exports = Page
