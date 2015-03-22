#! /usr/bin/nodejs

var fs = require('fs');
var exec = require('child_process').exec
var http = require('http')
var url = require('url')
var argv = require('optimist')
  .usage('Usage: listall.js -u url\n\nDo not append the pictures path in the end\n\OK: listal -u http://www.listal.com/movie/inception\nNot OK: listal -u http://www.listal.com/movie/inception/pictures')
  .demand(['u'])
  .default('o', 'target')
  .alias('o', 'outputDir')
  .alias('u', 'url')
  .argv


// getId for url
var urlParts = argv.u.split('/')
  , urlID

if (urlParts[urlParts.length - 1] == "")
  urlID = urlParts[urlParts.length - 2]
else
  urlID = urlParts[urlParts.length - 1]

var urlTemplate = argv.u + "/pictures//$page"
  , baseTargetPath = argv.o + '/' + urlID

console.log ("### Listal scanner ###\n")
console.log ("Using url\t\t:" + argv.u)
console.log ("Dumping contents into \t\t:" + baseTargetPath + "\n")


try {
  stats = fs.lstatSync(argv.o)
}
catch (e) {
  fs.mkdirSync(argv.o)
}

try {
  stats = fs.lstatSync(baseTargetPath)
}
catch (e) {
  fs.mkdirSync(baseTargetPath)
}

var downloadTemplate = "http://ilarge.listal.com/image/$id/10000full-$name.jpg"
  .replace('$name',urlID)

var picturePattern = /http:\/\/www.listal.com\/viewimage\/(\d+)/g

var i = 1
  , concurrentPageLimit = 3
  , imagesDownloaded = 0
  , lastImagesDownloaded = 0
  , pageSize = 20
  , imageDownloadTimeout = 50000


for (var j = 0 ; j < concurrentPageLimit ; j++ ) { getNextPage()}

setInterval(function() {
  if (lastImagesDownloaded == imagesDownloaded) {
    console.log("No images downloaded for " + (imageDownloadTimeout / 1000) + " seconds, quitting. " + imagesDownloaded + " images downloaded for " + urlID)
    process.exit(0)
  }
  lastImagesDownloaded = imagesDownloaded
}, imageDownloadTimeout)


function getNextPage() {

  var currentURL = urlTemplate.replace('$page', i++)
  var request = http.get(currentURL, processResult)

  request.on('error', function(e) {
    console.log("Got error: " + e.message)
  })

}

function processResult(res) {

  console.log("Fetched page:" + res.req.path)

  res.on("data", function(chunk) {
    match = picturePattern.exec(chunk)
    while (match != null) {
      downloadFile(downloadTemplate.replace('$id',match[1]), match[1])
      match = picturePattern.exec(chunk)
    }
  })
}

function downloadFile(file_url, id) {

  var targetFileName = argv.o + '/' + urlID + '/' + id + '.jpg'
  var curl = 'curl -o ' + targetFileName  + ' ' + file_url
  var child = exec(curl, function(err, stdout, stderr) {
    if (err) throw err
    else console.log(file_url + ' downloaded to ' + targetFileName)
    imagesDownloaded++
    if(imagesDownloaded % pageSize == 0) getNextPage()
  })
}
