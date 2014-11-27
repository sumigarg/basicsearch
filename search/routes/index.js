var express = require('express');
var router = express.Router();
var http = require('http');
var reqget;
var searchdata = [];
var searchData = [];
var erroredData = [];
var res ;
var req;
var username = '';
var output = '';
        searchdata.push({
        name : 'my first link',
        pdata : 'this is my first data'
        });

        erroredData.push({
        	suggestions : ''
        });
/* GET home page. */
router.get('/', function(req, res) {
	if(req.user){
		if(req.user.username){

			username = req.user.username;
		}else{

			username = req.user.displayName;

		}
		
	}else{
		username = null;
	}
	console.log('username is: '+req.session.user);
  res.render('result', { title: 'Search Application',searchdata : searchdata ,erroredData : erroredData,user:username});
});

router.get('/account', function(req, res) {
	console.log('In Account page : ');
  res.render('accounts', { title: 'Search Application',searchdata : searchdata ,erroredData : erroredData,user:username});
});
/* Post Home page. */
router.post('/',requesthandler);

function resetData(){

	output = '';
	searchdata = [];
	searchData = [];
	erroredData = [];
	erroredData.push({
        	suggestions : ''
        });
}
function requesthandler(reqObj,resObj){
	
	resetData();
	console.log("Express server listening for post requests"+reqObj.body);
	var txt = reqObj.body.search;		
	console.log('Text enetered is: '+ txt);
	res = resObj;
	req = reqObj;
	searchdata.push({
		name : txt,
		pdata : txt+' data entered'
	});
	
	var urllink = 'http://54.68.19.251:8983/solr/walgreens/select?q=fever&wt=json&indent=true';
	var url = "54.68.19.251";
	var qstring = '/solr/walgreens/select?q='+txt+'&wt=json&start=1&rows=2'; 
	var options = {
		host: url,
		port: 8983,
		path: qstring,
		method: 'GET'
	}; 

	var reqget = http.request(options,responsehandler);

	reqget.end();
	reqget.on("error", errorhandler);
	console.log('Rendering now:............................ '); 

//	res.render('result',{title: 'Search Results Returned',searchdata : searchData});

// end of post part
}

function responsehandler(ress) {
	
	console.log('STATUS: ' + ress.statusCode);
	console.log('HEADERS: ' + JSON.stringify(ress.headers));
	/*res.setEncoding('utf8');*/
	ress.on('data', function (chunk) {
		output += chunk;
//		console.log('BODY: ' );
	});
	
	/* reqget.write(output); */
	ress.on('end',parseresponse);	


// end of getrequest part
}


function parseresponse(){
//	console.log('request is done'+output);
	console.log(output.substr(0,98));
//	var jsonStr = JSON.stringify(output);
	var data = JSON.parse(output);
	console.log(data.responseHeader);
	console.log(data.response.numFound);
	if(data.response.numFound > 0){
		console.log(data.response.docs[0].title);
		console.log('Total Docs length is: '+data.response.docs.length);
		var reqDocs  = data.response.docs;
		var docsLength = reqDocs.length;
	//	reqDocs = JSON.stringify(reqDocs);
		console.log('Length of docsLength is: '+docsLength);
		console.log('reqDocs is :'+reqDocs);
		for(var i=0;i< docsLength;i++){
			var title = data.response.docs[i].title;
			var url   = data.response.docs[i].url; 
			console.log('Data going to be set is: '+ title + " " + url);
			var content = JSON.stringify(data.response.docs[i].content); 
			var snippet = content.substr(0,200);
			var timestamp = data.response.docs[i].tstamp;
			searchData.push({
				titles	 : title,
				urls	 : url,
				snippet	 : snippet,
				timestamp: timestamp
			}		
		);
		}
	}else{
		var suggestions = data.spellcheck.suggestions[1].suggestion[0];
		console.log('Total number of records for suggested Data is: '+data.spellcheck.suggestions[3][3]);
		console.log('Suggested Terms are: '+suggestions);
		req.body.search = suggestions;

		erroredData = [];
		erroredData.push({
			suggestions : suggestions
		});

		return requesthandler(req,res);

	}

	output = '';
	console.log('Total Records Set are: '+ searchData.length);
	renderPage();
 //      res.render('result',{title: 'Search Results Returned',searchdata : searchData});
// end of end part
}

function renderPage(){
	if(req.user){
		if(req.user.username){

			username = req.user.username;
		}else{

			username = req.user.displayName;

		}
		
	}else{
		username = null;
	}
    res.render('result',{title: 'Results Returned',searchdata : searchData,erroredData : erroredData,user:username});
}

function errorhandler(e) {
     console.error(e);
}

module.exports = router;
