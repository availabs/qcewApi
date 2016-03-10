var React = require('react');

var QCEWTable = React.createClass({

    _invalidData : function(){
	if(this.props.qcewdata && this.props.qcewdata.schema)
	    return false;
	return true;
    },
    
    tableHeader : function(){
	if(this._invalidData())   
	    return (<thead> </thead>);
	var header = this.props.qcewdata.schema;
	var fields = header.map( field => <th>{field}</th>);

	return (<thead> 
		<tr>
		{fields}
		</tr>
		</thead>);
    },

    tableBody : function(){
	if(this._invalidData())
	    return (<tbody> </tbody>);
	var rows = this.props.qcewdata.rows;
	var filledrows = rows.map( row => {
	    return <tr>{row.map(d => <td>{d}</td>)}</tr>;
	});

	return (
	    <tbody>
		{filledrows}
	    </tbody>
	);
    },

    render : function(){
	var head = this.tableHeader();
	var body = this.tableBody();
	return (
	    <div className='widget'>
		<table className="table table-stripped">
		   {head}
	           {body}
	        </table>
	    </div>
	);

    },

});

module.exports = QCEWTable;
