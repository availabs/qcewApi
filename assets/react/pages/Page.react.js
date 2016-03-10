var React = require('react'),
    MSAMap = require('./components/MSAMap.react'),
    QCEWSummary = require('./components/QCEWTable.react'),
    QCEWselectors= require('./components/QCEWselects.react');



    


var Page = React.createClass({

    render : function(){

	return (
	    <div>
	   
	    <div className='row'>
		
		<div className='col-lg-6'>
		     <MSAMap 
	               msaGeo={this.props.geoData}
		     />
		</div>
		<div className='col-lg-2'>

		<QCEWselectors
	         msadata={this.props.MSAMetaData}
	         naicsdata={this.props.NaicsMetaData}
		/>

		</div>
	     </div>
	     <div className='row'>
	        <div className='col-lg-12'>
		
		<QCEWSummary 
	         qcewdata={this.props.qcewData}
	        />
		</div>
		</div>
		</div>
	       );
    },
});

module.exports = Page
