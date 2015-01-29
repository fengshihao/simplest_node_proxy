var http = require('http');
var urlparser = require('url');

function onRequest(client_req, client_res) {
  var proxyRequest = http.request(getTurboReqeust(client_req),
    function (res) {
      client_res.writeHeader(res.statusCode, res.headers);
      res.pipe(client_res, {
        end: true
      });
      res.on('error', function(e) {
        client_res.end();
      });
    });

  proxyRequest.on('error', function(e) {
    console.log('proxyRequest on error: ' + e.message);
    client_res.end();
  });

  client_req.pipe(proxyRequest, {
    end: true
  });
}

function getTurboReqeust (client_req) {
    var url = urlparser.parse(client_req.url);
    console.log(client_req.url);
    var request_options = {
        hostname: url.host,
        headers: client_req.headers,
        method: client_req.method,
        path: url.path
    };
    return request_options;
}

var port = 8081
http.createServer(onRequest).listen(port);
console.log('node proxy start at port ' + port);
