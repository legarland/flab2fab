var express = require("express"),
  request = require('request'),
  app = express(),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  methodOverride = require('method-override'),
  hostname = process.env.HOSTNAME || 'localhost',
  port = parseInt(process.env.PORT, 10) || 3000,
  publicDir = process.argv[2] || __dirname + '/dist';

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.get("/api/info", function (req, res) {
  request('http://spreadsheets.google.com/feeds/list/1tfNxwmS5GdMUX6NW5FIgZcgGXd_XypKmaUiJilL-04Q/od6/public/values?alt=json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);
