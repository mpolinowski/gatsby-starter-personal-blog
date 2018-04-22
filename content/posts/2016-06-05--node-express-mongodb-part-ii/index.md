---
title: Node/Express with MongoDB (II)
subTitle: Building a Express Web Library with a MongoDB Backend and Goodreads API Integration
category: "Express.js"
date: 2016-06-05
cover: photo-34445481222_d3b67160da_o-cover.jpg
hero: photo-34445481222_d3b67160da_o.jpg
---

![Vanuatu](./photo-34445481222_d3b67160da_o.jpg)


[Github Repository](github.com/mpolinowski/node_express_git)


> This code is part of a training in web development with [Node.js](https://nodejs.org/en/). [EJS](http://ejs.co) will be used as template engine for rendering HTML out of [Express](https://expressjs.com). The library application will use [MongoDB](https://www.mongodb.com) to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. [Passport.js](http://www.passportjs.org) is used for local security.


* In [Part I](/node-express-mongodb-part-i/) we go through the basic [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com) setup
* In this Part II we will add [Bower.js](https://bower.io/) and the [Gulp.js](https://gulpjs.com/) taskrunner to manage our style dependencies and auto-restart our development environment using [Nodemon.js](https://nodemon.io)
* In [Part III](/node-express-mongodb-part-iii/) will add the magic of the [EJS](http://ejs.co) templating engine
* [Part IV](/node-express-mongodb-part-iv/) deals with advanced Express routing options
* [Part V](/node-express-mongodb-part-v/) deals with [Passport.js](http://www.passportjs.org) user authentication and [MongoDB](https://www.mongodb.com)


<!-- TOC -->

- [01 Add Bower to the Project](#01-add-bower-to-the-project)
- [02 Add Gulp to the Project](#02-add-gulp-to-the-project)
  - [Inject Bower Dependencies with Wiredep](#inject-bower-dependencies-with-wiredep)
  - [Inject with Gulp-Inject](#inject-with-gulp-inject)
  - [Auto-restart with Nodemon](#auto-restart-with-nodemon)

<!-- /TOC -->


## 01 Add Bower to the Project

First install Bower globally with _npm install bower -g_. Then do a bower init to the app directory (creation of bower.json).

We now add a new file to tell Bower to install directly into our public directory:


__.bowerrc__
```json
"directory": "public/lib"
```

Next we bower install bootstrap font-awesome --save to get the latest stable version of the framework (add bower_components bootstrap + jquery). They will be installed to the lib directory in our public folder. The bootstrap/jquery/font-awesome files can now be added to the template index.html by linking e.g.


## 02 Add Gulp to the Project

### Inject Bower Dependencies with Wiredep

First install Gulp with npm install -g gulp globally. Then install it to the app directory via _npm install --save-dev gulp_ (as a development dependency). We now want to inject dependencies (css,js) to our views automatically with wiredep - _npm install --save-dev wiredep_.

We now add a new file to tell Gulp what to do - ignore node_modules only use files from the src directory, add dependencies with wiredep.


__gulpfile.js__
```javascript
var gulp = require('gulp');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream; /* Use wiredep to inject css/js dependencies to views e.g. bootstrap */

    var options = {
        bowerJson: require('./bower.json'), /* Tell wiredep to check dependencies from the bower.json file e.g. bootstrap */
        directory: './public/lib', /* Tell wiredep to find dependencies in the lib directory. It will search for the json file - e.g. ./public/lib/bootstrap/.bower.json */
        ignorePath: '../../public' /* The path to the css/js files has to be given relative to the public folder - e.g. (../../public/)/lib/bootstrap/dist/css/bootstrap.min.css*/
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(gulp.dest('./src/views'));
});
```


Bootstrap 3 now uses LESS - we have to override the defaults to grab the CSS files instead and add them to our index.html. The main overrides can be added to the global bower.json file. This way the bower.json file inside public/lib/bootstrap and public/lib/font-awesome will be ignored.


__bower.json__
```json
{
  "name": "node-express",
  "description": "node express test",
  "main": "app.js",
  "authors": [
    "[object Object]"
  ],
  "license": "MIT",
  "homepage": "",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "bootstrap": "^3.3.6",
    "font-awesome": "^4.6.1"
  },
  "overrides": {
    "bootstrap": {
      "main": [
        "dist/js/bootstrap.js",
        "dist/css/bootstrap.min.css",
        "dist/less/bootstrap.less"
      ]
    },
    "font-awesome": {
      "main": [
        "less/font-awesome.less",
        "css/font-awesome.min.css",
        "scss/font-awesome.scss"
      ]
    }
  }
}
```


__index.html__

We now have to add and to our index.html template to inject the Bower css/js dependencies, when the command gulp inject is run.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>LibraryApp</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <!--bower:css-->
    <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <link rel="stylesheet" href="/lib/font-awesome/css/font-awesome.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endbower-->
    <!-- bower:js -->
    <script src="/lib/jquery/dist/jquery.js"></script>  <!-- Will be automatically injected with the command "gulp inject" -->
    <script src="/lib/bootstrap/dist/js/bootstrap.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endbower -->
</head>
```


### Inject with Gulp-Inject

After injecting the Bower dependencies, we now have to inject our ccs and js files from the public folder. We will use Gulp-Inject to perform this task. First do a npm install --save-dev gulp inject, to install Gulp-Inject as a development dependency.

We now add Gulp-Inject to our gulpfile.js:

__gulpfile.js__
```javascript
var gulp = require('gulp');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject'); /* Use gulp-inject to inject our personal css/js dependencies to views */

    var injectSrc = gulp.src(['./public/css/*.css', /* Tell gulp-inject where our personal css/js dependencies are located */
        './public/js/*.js'
    ], {
        read: false /* We only need the path not content */
    });

    var injectOptions = {
        ignorePath: '/public' /* Tell gulp-inject to use a path relative to /public */
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions)) /* Use gulp-inject to inject our personal css/js dependencies to views */
        .pipe(gulp.dest('./src/views'));
});
```

We now have to add and to our index.html template to inject our css/js dependencies, when the command gulp inject is run.


```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>LibraryApp</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <!--bower:css-->
    <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <link rel="stylesheet" href="/lib/font-awesome/css/font-awesome.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endbower-->
    <!-- bower:js -->
    <script src="/lib/jquery/dist/jquery.js"></script>  <!-- Will be automatically injected with the command "gulp inject" -->
    <script src="/lib/bootstrap/dist/js/bootstrap.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endbower -->
    <!-- inject:css-->
    <link rel="stylesheet" href="/css/styles.css"> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endinject-->
    <!--inject:js-->
    <script src="/js/default.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endinject-->
    <!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
</head>
```


### Auto-restart with Nodemon

We now add Nodemon to monitor our node.js app - Nodemon will automatically restart the server when a change was detected. To install Nodemon type _npm install --save-dev nodemon_.

We now add Nodemon to our gulpfile.js:

__gulpfile.js__
```javascript
var gulp = require('gulp');
var nodemon = require('gulp-nodemon'); /* Add nodemon to automatically restart the server, when a change was detected */

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css',
        './public/js/*.js'
    ], {
        read: false
    });

    var injectOptions = {
        ignorePath: '/public'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['inject'], function() { /* Create a 'serve' task to automatically execute the 'inject' function above on start-up */
    var options = { /* In the line above we used an Object for the 'inject' function - here you can add more functions to be executed */
        script: 'app.js',  /* 'serve' starts our app.js on 'PORT' and nodemon restarts it when 'jsFiles' are changed */
        delayTime: 1,
        env: {
            'PORT': 8080  /* Environment variables e.g. database connection strings */
        },
        watch: jsFiles
    };

    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting...');
        });
});
```


* [Part I](/node-express-mongodb-part-i/)
* [Part III](/node-express-mongodb-part-iii/)
* [Part IV](/node-express-mongodb-part-iv/)
* [Part V](/node-express-mongodb-part-v/)