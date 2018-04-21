---
title: Node/Express with MongoDB (III)
subTitle: Building a Express Web Library with a MongoDB Backend and Goodreads API Integration
category: "Express.js"
date: 2016-06-05
cover: photo-34605589525_8f576ddb84_o-cover.jpg
hero: photo-34605589525_8f576ddb84_o.jpg
---

![Harbin](./photo-34605589525_8f576ddb84_o.jpg)


[Github Repository](github.com/mpolinowski/node_express_git)


> This code is part of a training in web development with [Node.js](https://nodejs.org/en/). [EJS](http://ejs.co) will be used as template engine for rendering HTML out of [Express](https://expressjs.com). The library application will use [MongoDB](https://www.mongodb.com) to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. [Passport.js](http://www.passportjs.org) is used for local security.


* In [Part I](/node-express-mongodb-part-i/) we go through the basic [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com) setup
* In [Part II](/node-express-mongodb-part-ii/) we added [Bower.js](https://bower.io/) and the [Gulp.js](https://gulpjs.com/) taskrunner to manage our style dependencies and auto-restart our development environment using [Nodemon.js](https://nodemon.io)
* Here Part III and we add the magic of the [EJS](http://ejs.co) templating engine
* [Part IV](/node-express-mongodb-part-iv/) deals with advanced Express routing options
* [Part V](/node-express-mongodb-part-v/) deals with [Passport.js](http://www.passportjs.org) user authentication and [MongoDB](https://www.mongodb.com)


## 01 Add a Templating Engine - EJS

EJS combines data and a template to produce HTML. JavaScript between <% %> is executed. JavaScript between <%= %> adds strings to your HTML and <%- %> can contain HTML formated content. To add our templating engine we first have to install it with npm install --save ejs. Now we add the engine to our app.js file:


__app.js__
```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000; /* 'gulp serve' uses PORT 8080 - if no port is defined by the environment use port 3000 */

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs'); /* Templating Engine is set to EJS */

app.get('/', function(req, res){
  res.render('index', {title: 'Rendered Title', list: ['a', 'b']}); /* This content will be displayed in the index.ejs file we´ll create next */
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


Now we create a simple index.ejs file in our src/views directory:

__index.ejs__
```html
 <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title><%= title %></title>
    </head>
    <body>
      <h1><%= title %></h1>
      <ul>
        <%= for(var i=0; i<list.length; i++) { %>
          <li><%= list[i] %></li>
        <%= } %>
      </ul>
    </body>
  </html>
```

Open http://localhost:8080/ to check the result - EJS should fill out the title and create the unordered list with the items a and b. Now we will take the code from our template index.html code and copy it to index.ejs. EJS will later be used to display a list view of books in our library app.


## 02 Adding a Page Navigation with Routing

We want to add two routes to our navigation bar - one for authors and one for books. In the final version of the library app, this will display all books either by their author or book title. We will create those routes in the app.js file and add the navigation to our navbar using EJS.


__app.js__
```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'}, /* We change the list from before to a nav element */
    {Link: '/Authors', Text: 'Authors'}]
  });
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


__index.ejs__
```html
<header>

    <nav class="navbar navbar-inverse navbar-fixed-top" role="banner">
        <div class="container-fluid">

            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">
                    <%= title %> <!-- Adding nav element from app.js -->
                </a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <% for(var i=0; i<nav.length;i++){%> <!-- Adding nav element from app.js -->
                        <li>
                            <a href="<%=nav[i].Link%>"> <!-- Adding nav element from app.js -->
                                <%= nav[i].Text %> <!-- Adding nav element from app.js -->
                            </a>
                        </li>
                        <%}%>
                </ul>
            </div>
        </div>
    </nav>

</header>
```


* [Part I](/node-express-mongodb-part-i/)
* [Part II](/node-express-mongodb-part-ii/)
* [Part IV](/node-express-mongodb-part-iv/)
* [Part V](/node-express-mongodb-part-v/)