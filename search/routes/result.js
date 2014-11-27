var express = require('express');
var router = express.Router();
var http = require('http');
var reqget;
var searchdata = [];
var searchData = [];
        searchdata.push({
        name : 'my first link',
        pdata : 'this is my first data'
        });
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Search Application',searchdata : searchdata });
});

/* Post Home page. */
router.post('/',function(req,res){
  console.log("Express server listening for post requests"+req.body);
  var txt = req.body.search;		
  console.log('Text enetered is: '+ txt);
	searchdata.push({
		name : txt,
		pdata : txt+' data entered'
	});
var urllink = 'http://54.68.55.151:8983/solr/walgreens/select?q=fever&wt=json&indent=true';
var url = "54.68.55.151";
var options = {
  host: url,
  port: 8983,
  path: '/solr/walgreens/select?q=fevr&wt=json&start=11&rows=1',
  method: 'GET'
};
 
 var reqget = http.request(options,function (res) {
  var output='' ;
  var record;	
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  /*res.setEncoding('utf8');*/
  res.on('data', function (chunk) {
    output += chunk;
    console.log('BODY: ' );
  });
 /* reqget.write(output); */
  res.on('end',function(){
	console.log('request is done');
	console.dir(output.substr(0,98));
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
			title	 : title,
			url	 : url,
			snippet	 : snippet,
			timestamp: timestamp
		}		
	);
	}
	}else{

		console.log('Total number of records for suggested Data is: '+data.spellcheck.suggestions[3][3]);
		console.log('Suggested Terms are: '+JSON.stringify(data.spellcheck.suggestions[1].suggestion));
		
	}
	console.log('Total Records Set are: '+ searchData.length);
	res.render('result', { title: 'Search Result',searchdata : searchData });
});	
  
/*	 console.log('Output is: '+output.response); */       

  /*  console.log('Output is: '+ output);*/	
});

reqget.end();
reqget.on("error", function (e) {
     console.error(e);
}); 
 res.render('index',{title: 'Search Returned',searchdata : searchdata});
});

var url = "54.68.55.151";
var options = {
  host: url,
  port: 8983,
  path: '/solr/walgreens/select?q=fever',
  method: 'GET'
};

/* var reqget = http.request(options, callfunc(res)).end();*/
function callfunc(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  /*res.setEncoding('utf8');*/
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
res.on("end", function () {
        // you can use res.send instead of console.log to output via express
        console.log('Output is: '+output);
});
}
/*reqget.on('error',function(e){
	console.error(e);
});*/
module.exports = router;
