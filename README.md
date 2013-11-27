# listal

```
npm install listal -g
```

Simple command line tool to download all images from a [listal](http://www.listal.com/) page. Just use `listal` with option -u and the base url for the resource, excluding the pictures path.

For example, if you want to download all images in listal from inception just type

```bash
node listal.js -u http://www.listal.com/movie/inception
```

If you want all the pictures from the director:

```bash
node listal.js -u http://www.listal.com/christopher-nolan
```

All pictures are downloaded by default to `target/resource_name` but you can change this with the `-o` option.

I used to have 5 concurrent pages at a time, but OSX EMFILE was giving me problems, so I set it to two.

If by any weird reason someone starts using this, open issues to address all the stuff I didn't bother doing:
* Exposing timeout to quit
* Exposing number of concurrent pages
* Better handling of the `-u` option, for example accept bad urls
* Better code in some areas.

