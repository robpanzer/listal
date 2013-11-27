#!/usr/bin/local node

const DOWNLOAD_DIR = "./target2"

var exec = require('child_process').exec
var http = require('http');
var url = require('url');
var argv = require('optimist')
  .usage('Usage: ./listall.js -n name')
  .demand(['n'])
  .argv;

var urlTemplate = "http://www.listal.com/$name/pictures//$page"
  .replace('$name',argv.n)


var downloadTemplate = "http://ilarge.listal.com/image/$id/10000full-$name.jpg"
  .replace('$name',argv.n)

var picturePattern = /http:\/\/www.listal.com\/viewimage\/(\d+)/g

console.log("Using name:" + argv.n)
console.log("Using template:" + urlTemplate)

var i = 1

while (i <= 15) {

  var currentURL = urlTemplate.replace('$page', i)
  console.log("Fetching " + currentURL);
  var request = http.get(currentURL, processResult)

  request.on('error', function(e) {
      console.log("Got error: " + e.message);
  })
  request.setTimeout(60000, function() { console.log("Custom timeout")})


  i++
}

function processResult(res) {

  res.on("data", function(chunk) {
    match = picturePattern.exec(chunk);
    while (match != null) {
      download_file_wget(downloadTemplate.replace('$id',match[1]), match[1])
      match = picturePattern.exec(chunk);
    }
  });
}

var download_file_wget = function(file_url, id) {

  // extract the file name
  var file_name = url.parse(file_url).pathname.split('/').pop();
  // compose the wget command
  var wget = 'curl -o target2/' + id + '.jpg ' + file_url;

  var child = exec(wget, function(err, stdout, stderr) {
    if (err) throw err;
    else console.log(file_url + ' downloaded to ' + DOWNLOAD_DIR);
  });
};