var React = require('react'),
    MSAMap = require('./components/MSAMap.react'),
    QCEWSummary = require('./components/QCEWTable.react'),
    Graphs      = require('./components/NvGraphs.react'),
    QCEWselectors= require('./components/QCEWselects.react');



    


var Page = React.createClass({

    render : function(){
	var formatMap = {};
	var naics = this.props.NaicsMetaData;
	naics.forEach( d => formatMap[d.code] = d.industry_code);

	return (
	    <div>
	   
	    <div className='row'>
		
	        <div className='col-lg-2'>

		    <QCEWselectors
	               msadata={this.props.MSAMetaData}
	               naicsdata={this.props.NaicsMetaData}
		    />

		</div>

		<div className='col-lg-6'>
		     <MSAMap 
	               msaGeo={this.props.geoData}
		     />
		</div>
		
	     </div>
	     <div className='col-lg-4'>
	       <Graphs 
	         data={this.props.MSAMetaData}
	         naidsdata={this.props.NaicsMetaData}
	       />
	    </div>
	     <div className='row'>
	        <div className='col-lg-12'>
		
		<QCEWSummary 
	         qcewdata={this.props.qcewData}
	         formatMap={formatMap}
	        />
		</div>
		</div>
		</div>
	       );
    },
});

module.exports = Page
