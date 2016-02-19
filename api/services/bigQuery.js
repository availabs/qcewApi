/*
This convenience module is used to query Google's BigQuery service.
*/

var googleapis = require('googleapis'),
bigQuery = googleapis.bigquery('v2'),

JWT = null;

var REQUEST_IDs = 0,
d3 = require("d3"),
COMPLETED_JOBS = d3.set();

module.exports = function() {
    var projectId = 'avail-wim',
    MAX_REQUESTS = 25,
    NUM_REQUESTS = 0,
    PENDING_REQUESTS = [];

    function query(sql, cb) {
	/*
	  This function is used to send a query request to BigQuery.
	  sql: The SQL statement to be executed.
	  cb: callback function executed upon query completion. The callback
	  function should accept (error, result) as parameters.
	  */
	
	if (!JWT) {
	    cb("BigQuery services were not authorized.");
            return;
	    }
	var request = BigQueryRequest(sql, cb);
	if (NUM_REQUESTS < MAX_REQUESTS) {
	    request();
	    }
	else {
	    PENDING_REQUESTS.push(request);
// console.log("<BigQuery> REQUEST QUEUED, PENDING REQUESTS:", PENDING_REQUESTS.length);
	    }
	}

    query.auth = function(email, pem, cb) {
	debugger;
	if (JWT) return;

	JWT = new googleapis.auth.JWT(
	            email, // < this is the google service account email
	            pem, // < point this to the path of required .pem file
	            null,
	            ['https://www.googleapis.com/auth/bigquery']);
	JWT.authorize(function(error, result) {
	    if (typeof cb == "function") {
		cb(error, result);
	    }
	    console.log("BigQuery auth result: %s", error ? "failure: "+error : "success");

	});
    }

    query.checkJob = function(jobId, cb) {
	/*
	  This function is used to check the status of a job to determine if
	  the job has finished or if it still running.
	  jobId: the google service jobId returned by google from the initial request.
	  If a job runs for too long on Google's servers, a status update is returned.
	  This request should be repeated until the job completes.
	  cb: callback function executed upon completion. The callback
	  function should accept (error, result) as parameters.
	  result: The result is an updated object containing updated
	  information about the job status.
	  */
	bigQuery.jobs.get({ projectId: projectId, jobId: jobId, auth: JWT }, cb);
	}
    query.parseResult = function(BQresult) {
	/*
	  This convenience method is used to parse a default BigQuery result into
	  a nicer format, what I refer to as a Simple BigQuery result.
	  BQresult: this parameter is an unmodified BigQuery query response.
	  return: returns an object containing the rows of data along with additional
	  metadata.
	  */
	var response = {
	    schema: [],// This array contains the attribute names, in queried order.
	    rows: [],// This contains all of the data. Each element of rows is
	    // itself an array containing the raw data for a
	    // single record. The order of the data for each record
	    // corresponds to the order of the schema elements,
	    // i.e. the data is in queried order.
	    types: []// This array contains the types of each attribute,
	    // in queried order.
	    }
	if(!BQresult || !BQresult.rows){
	    console.log('Empty Response');
	    return response;
	}
	BQresult.schema.fields.forEach(function(field, i) {
	    response.schema.push(field.name);
	    response.types.push(field.type);
	    })

	response.rows = BQresult.rows.map(function(row) {
	    return row.f.map(function(d) { return d.v; });
	    });

	return response;
	}

    query.echoJWT = () => console.log(JWT);
    return query;

// PRIVATE FUNCTIONS FOLLOW

    function BigQueryRequest(sql, cb) {
	cb = wrapCB(cb);

	var id = REQUEST_IDs++;

	function request() {
	    ++NUM_REQUESTS;
// console.log("<BigQuery> REQUEST STARTED, NUM REQUESTS:", NUM_REQUESTS);
	    bigQuery.jobs.query({
		kind: "bigquery#queryRequest",
		projectId: projectId,
		timeoutMs: '10000',
		resource: { query: sql, projectId: projectId },
		auth: JWT },
				    function(error, result) {
					if (error) {
					    cb(error);
					    return;
					    }

					if (!result["jobComplete"]) {
					    setTimeout(wait, 500, result, cb);
					    return;
					    }

					if (!result.rows) {
					    cb('',result);
					    return;
					    }

					if (result.totalRows > result.rows.length) {
					    getMoreRows(result, result.pageToken, cb);
					    }
					else {
					    cb(error, result);
					    }
					    })
	    }
	return request;

	function wrapCB(cb) {
	    return function(err, res) {
// console.log("<BigQuery> COMPLETED JOB:", id, "| DUPLICATE:", COMPLETED_JOBS.has(id));
COMPLETED_JOBS.add(id);
		--NUM_REQUESTS;
// console.log("<BigQuery> REQUEST FINISHED, NUM REQUESTS:", NUM_REQUESTS);
		if (PENDING_REQUESTS.length) {
		    var request = PENDING_REQUESTS.shift();
// console.log("<BigQuery> REMOVED REQUEST FROM QUEUE, PENDING REQUESTS:", PENDING_REQUESTS.length);
		    request();
		    }
		cb(err, res);
		}
	    }
	}

    function wait(BQresponse, cb) {
	/*
	  This private function is used internally when a query job returns unfinished.
	  QBresult: the response from Google containing information on the unfinished job.
	  cb: this is a callback function that is passed on to the function that retrieves
	  query results after the job completes.
	  */
	query.checkJob(BQresponse["jobReference"]["jobId"], function(error, status) {
	    var state = status["status"]["state"];
	    if (state == "RUNNING") {
console.log("<BigQuery> Job still running:", BQresponse["jobReference"]["jobId"]);
		setTimeout(wait, 500, BQresponse, cb);
		}
	    else if (state == "DONE") {
		getResults(status, cb);
		}
	    });
	}

    function getResults(status, cb) {
	/*
	  This private function is used internally after waiting for an unfinished query job.
	  status: the status object for a completed job returned by Google.
	  cb: callback function executed upon completion. The callback
	  function should accept (error, result) as parameters.
	  */
	var params = {
	    jobId: status.jobReference.jobId,
	    projectId: projectId,
	    startLine: 0,
	    auth: JWT
	    }
	bigQuery.jobs.getQueryResults(params, function(error, result) {
	    if(error) {
		cb(error);
		return;
		}

	    if (!result.rows) {
		cb("empty response from BigQuery");
		return;
		}

	    if (result.totalRows > result.rows.length) {
		getMoreRows(result, result.pageToken, cb);
		}
	    else {
		cb(error, result);
		}
	    })
	}

    function getMoreRows(response, pageToken, cb) {
	/*
	  This private function is used internally to receive additional
	  pages of results if a query response has more than 100,000 rows.
	  response: a query response returned by Google. Additional data is
	  added into this object's rows.
	  pageToken: the pageToken identifying the last page of read received.
	  Google uses this to receive the next page of data.
	  cb: callback function executed upon completion. The callback
	  function should accept (error, result) as parameters.
	  */
	var params = {
	    jobId: response.jobReference.jobId,
	    projectId: projectId,
	    auth: JWT,
	    pageToken: pageToken
	    }
console.log("<BigQuery> Getting more rows:", params.jobId);
	bigQuery.jobs.getQueryResults(params, function(error, data) {
	    if(error) {
		cb(error);
		return;
		}

	    if (!response.rows) {
		cb("empty response from BigQuery");
		return;
		}

	    if (data.rows.length) {
		response.rows = response.rows.concat(data.rows);
		}

	    if (response.totalRows > response.rows.length) {
		getMoreRows(response, data.pageToken,  cb);
		}
	    else {
		cb(error, response);
		}
	    })
	}
}
