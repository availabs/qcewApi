var React = require('react');
var nv = require('../../utils/dependencies/nvd3.js');


var Graphs = React.createClass({


    render : function(){
	var svgStyle = {
              height: this.props.height+'px',
              width: '100%'
        };
	return(
            <div className='row' style={{color:'#000'}}>
        		<div className='col-md-12' id="Graphs">
        			<svg style={svgStyle}/>
        		</div>
                <div className='row'>
                  
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                  
                  </div>
                </div>
            </div>
    	);
    },

});
module.exports = Graphs;
