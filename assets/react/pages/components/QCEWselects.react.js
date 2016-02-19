var React = require('react'),
    Select2Component = require('../../components/utils/Select2.react');
    UserActionCreators = require('../../actions/UserActionCreators');

var selectForm = React.createClass({

    getDefaultProps : function(){
	return {
	    naicsdata:[],
	    msadata:[],
	    
	};
	
    },

    getInitialState : function(){
	return {
	    currentMsa : [],
	    currentNaics: [],
	};
    },
    
    setMSA : function(e,selection){
	console.log(e,selection);
	if(selection){
	    this.setState({currentMSA:[selection.id]});
	}
    },

    setNAICS : function(e,selection){
	console.log(e,selection);
	if(selection){
	    this.setState({currentNaics:[selection.id]});
	}
    },

    formatMSA: function (){
	return this.props.msadata.map(msa =>{ 
	    return {
		text: msa.area_fips + ' ' + msa.area_title,
		id: msa.area_fips,
	    }
	});
    },

    formatNaics : function(){
	return this.props.naicsdata.map(naics => {
	    return {
		text: naics.code + ' ' + naics.industry_code,
		id  : naics.code,
	    };
	});
    },

    submit : function(){
	if(this.state.currentMSA.length > 0)
	    UserActionCreators.getMSAData(this.state.currentMSA);
	if(this.state.currentNaics.length > 0)
	    UserActionCreators.getNaicsData(this.state.currentNaics)
    },

    render : function(){
	console.log(this.props);
	var formattedNAICS = this.formatNaics();
	var formattedMSAs = this.formatMSA();

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
	          val={this.state.currentMSA}
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
	          val={this.state.currentNaics}
	        />
		</div>
		<a className='btn btn-info' onClick={this.submit}>submit</a> 
	    </div>
	    </div>
	    </div>
	);
    },

});

module.exports = selectForm;