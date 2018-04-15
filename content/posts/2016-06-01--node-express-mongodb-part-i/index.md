---
title: Node/Express with MongoDB (Part I)
subTitle: Building a Express Web Library with a MongoDB Backend and Goodreads API Integration
category: "Express.js"
date: 2016-06-01
cover: photo-34445934842_9cbfb7dfcb_o-cover.jpg
hero: photo-34445934842_9cbfb7dfcb_o.jpg
---

![Hongkong](./photo-34445934842_9cbfb7dfcb_o.jpg)


[Github Repository](github.com/mpolinowski/node_express_git)


> This code is part of a training in web development with [Node.js](https://nodejs.org/en/). [EJS](http://ejs.co) will be used as template engine for rendering HTML out of [Express](https://expressjs.com). The library application will use [MongoDB](https://www.mongodb.com) to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. [Passport.js](http://www.passportjs.org) is used for local security.


* This is Part I and will guide us through the basic [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com) setup
* In [Part II](/node-express-mongodb-part-ii/) we will add [Bower.js](https://bower.io/) and the [Gulp.js](https://gulpjs.com/) taskrunner to manage our style dependencies and auto-restart our development environment using [Nodemon.js](https://nodemon.io)
* In [Part III](/node-express-mongodb-part-iii/) will add the magic of the [EJS](http://ejs.co) templating engine
* [Part IV](/node-express-mongodb-part-iv/) deals with advanced Express routing options
* [Part V](/node-express-mongodb-part-v/) deals with [Passport.js](http://www.passportjs.org) user authentication and [MongoDB](https://www.mongodb.com)


## 01 Install Node.js and Express.js to serve our Web Application

First install [Node.js](https://nodejs.org/en/download/) and initialize the project with npm init. Then npm install express --save to the app directory.


Create a _app.js_ and run the Express webserver on a specified port:


```javascript
var express =require('express');

var app = express():

var port = 3000;

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

Running the app with node app.js should give you the console log that the webserver is up an running on the specified port.


## 02 Add Start Script

Now we will add a npm script to the _package.json_ file to start our app:

```json
"name": "node-express",
  "version": "1.0.0",
  "description": "Library App",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
```

The line _"start": "node app.js"_ allows us to use the npm start command instead of having to define our starting point like before - _node app.js_


### 03 Add Routing (Hello World)

When accessing the home route (http://localhost:3000/), we want to send a Hello World, to test our routing. Then we add another route - /books to the _app.js_ file:


```javascript
var express =require('express');

var app = express():

var port = 3000;

app.get('/', function(req, res){
  res.send('Hello World')
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


## 04 Serve Static Files

We first add to new folders to our project - public/css & public/js and a src/views folder. We download a free Bootstrap theme from a page like bootstrapzero.com and put the css/js files into the public folder. The html file has to be located in the views folder.


The Express middleware is used to serve the content of our public folder, by adding the line app.use(express.static('public')); to the app.js file. The static html file - index.html - from our template, will be served by app.use(express.static('src/views'));.


```javascript
var express =require('express');

var app = express();

var port = 3000;

app.use(express.static('public'));
app.use(express.static('src/views'));

app.get('/', function(req, res){
  res.send('Hello World')
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


Through the public route, we are now able to access the css/js files by typing in e.g. http://localhost:3000/css/styles.css into our browser (the bootstrap components of the template will not be used - we Bower to add them later - __DELETE THOSE FILES FOR [Next Part](/node-express-mongodb-part-ii/)__. The index.html is accessible by http://localhost:3000/index.html.


* [Part II](/node-express-mongodb-part-ii/)
* [Part III](/node-express-mongodb-part-iii/)
* [Part IV](/node-express-mongodb-part-iv/)
* [Part V](/node-express-mongodb-part-v/)