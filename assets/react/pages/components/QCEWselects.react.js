var React = require('react'),
    Select2Component = require('../../components/utils/Select2.react');

var selectForm = React.createClass({

    getDefaultProps : function(){
	return {
	    currentNaics:[],
	    currentMSA:[],
	    
	};
	
    },
    
    setMSA : function(){

    },

    setNAICS : function(){

    },

    render : function(){

	var formattedNAICS;
	var formattedMSAs;

	return (
	   <div>
	   <div className='col-md-6'/>
	   <div className='col-md-6'>
	   <div className='row'>
		<div className='row'>
		<Select2Component
	          id='MSA_SELECTOR'
	          dataSet={formattedMSAs}
	          multiple={false}
	          styleWidth='100%'
	          onSelection={this.setMSA}
	          placeholder={'MSA Code'}
	          val={this.props.currentMSA}
	        />
	        </div>
		<div className='row'>
		<br/>
	        </div>
		<div className='row'>
		<Select2Component
	          id='NAICS_CODE_SELECTOR'
	          dataSet={formattedNAICS}
	          multiple={false}
	          styleWidth='100%'
	          onSelection={this.setNaics}
	          placeholder={'Naics Code'}
	          val={this.props.currentNaics}
	        />
		</div>

	    </div>
	    </div>
	    </div>
	);
    },

});

module.exports = selectForm;
