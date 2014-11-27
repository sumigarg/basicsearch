var http = require('http');
var url = "54.68.55.151";
var options = {
  host: url,
  port: 8983,
  path: '/solr/walgreens/select?q=fever',
  method: 'GET'
};

 var reqget = http.request(options,function (res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  /*res.setEncoding('utf8');*/
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});
reqget.end();
reqget.on("error", function (e) {
     console.error(e);
}); 
