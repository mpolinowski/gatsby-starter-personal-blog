---
title: Node/Express with MongoDB (IV)
subTitle: Building a Express Web Library with a MongoDB Backend and Goodreads API Integration
category: "Express.js"
date: 2016-06-05
cover: photo-34364880182_fe2d33582b_o-cover.jpg
hero: photo-34364880182_fe2d33582b_o.jpg
---

![Sydney](./photo-34364880182_fe2d33582b_o.jpg)


[Github Repository](github.com/mpolinowski/node_express_git)


> This code is part of a training in web development with [Node.js](https://nodejs.org/en/). [EJS](http://ejs.co) will be used as template engine for rendering HTML out of [Express](https://expressjs.com). The library application will use [MongoDB](https://www.mongodb.com) to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. [Passport.js](http://www.passportjs.org) is used for local security.


* In [Part I](/node-express-mongodb-part-i/) we go through the basic [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com) setup
* In [Part II](/node-express-mongodb-part-ii/) we added [Bower.js](https://bower.io/) and the [Gulp.js](https://gulpjs.com/) taskrunner to manage our style dependencies and auto-restart our development environment using [Nodemon.js](https://nodemon.io)
* Here Part III and we add the magic of the [EJS](http://ejs.co) templating engine
* [Part IV](/node-express-mongodb-part-iv/) deals with advanced Express routing options
* [Part V](/node-express-mongodb-part-v/) deals with [Passport.js](http://www.passportjs.org) user authentication and [MongoDB](https://www.mongodb.com)


## 01 Adding a Router for the Listview of our Book Page

### Adding a Route to Render

We want to group all routes for the Book pages under one Router - later we will simply export this router from a separate file to app.js.


__app.js__
```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router(); /* Creating a Router for all Book Routes */

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

bookRouter.route('/') /* When you go to /Books you will get the response 'Hello Books' */
    .get(function(req, res) {
      res.send('Hello Books')
    });

bookRouter.route('/Single') /* When you go to /Books/Single you will get the response 'Hello Single Books' */
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter); /* bookRouter will be used once you go to /Books*/

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
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


bookRouter now sends us a string 'Hello Books' or 'Hello Single Books' when we go to http://localhost:8080/Books or http://localhost:8080/Books/Single . We now want to render different views when we access those URLs.


__app.js__
```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router();

app.use(express.static('public'));

app.set('views', './src/views'); /* The render function requires an EJS file here to render */
app.set('view engine', 'ejs');

bookRouter.route('/')
    .get(function(req, res) {
      res.render('bookListView', {  /* We change res.send to res.render. Since we set views to ../src/views, the router will search for a bookListView.ejs in this directory to render */
        title: 'Home', /* We have to add nav since it is displayed on every view - we will export it later */
        list: [{Link: '/Books', Text: 'Books'},
        {Link: '/Authors', Text: 'Authors'}]
      });
    });

bookRouter.route('/Single')
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter);

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
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


You can copy the index.ejs file and rename the copy to bookListView.ejs - this file will now be rendered, when you access http://localhost:8080/Books .

Adding some Books to the Book View
We now have a view that is rendered when we access the Books view. Now we want to use EJS to populate the view with some books. Later, those books will be added from MongoDB. Now we just hardcode some books into app.js to prove the concept:


__app.js__
```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router();

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

var books = [{  /* Just some hardcoded books for now - later we will use MongoDB */
    title: 'Cryptonomicon',
    author: 'Neil Stephenson',
    read: true
}, {
    title: 'Leviathan Wakes',
    author: 'James S.A. Corey',
    read: false
}, {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    read: true
}, {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    read: false
}, {
    title: 'Microserfs',
    author: 'Douglas Coupland',
    read: true
}, {
    title: 'Up Country',
    author: 'Nelson Demille',
    read: true
}, {
    title: 'Night over Water',
    author: 'Ken Follett',
    read: true
}, {
    title: 'The Stand',
    author: 'Stephen King',
    read: true
}];

bookRouter.route('/')
    .get(function(req, res) {
      res.render('bookListView', {
        title: 'Home',
        list: [{Link: '/Books', Text: 'Books'},
        {Link: '/Authors', Text: 'Authors'}]
        books: books /* passing in the book array from above - so it will be available for rendering */
      });
    });

bookRouter.route('/Single')
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter);

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
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


Now we can modify our bookListview to add those books via EJS:


__ookListView.ejs__
```html
<section class="container" style="margin-bottom: 400px;">
    <div class="row">
        <% for(var i=0; i<books.length;i++){ %> <!-- Not <%= ...  %> with the EQUAL sign it will not be executed -->
            <div class="col-xs-6 col-md-4 col-lg-3 center-block" style="margin-bottom: 10px;">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%= books[i].title %></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-4 col-lg-6">
                            <a class="story-title" href="/Books/<%=books[i]._id%>"><img alt="" src="<%=books[i].cover%>" style="height:100px" class="img-thumbnail"></a>
                        </div>
                        <div class="col-xs-12 col-sm-8 col-lg-6">
                            <p><span class="label label-default"><strong><%= books[i].author %></strong></span></p>
                            <p><span style="font-family:courier,'new courier';" class="text-muted"><a href="/Books/<%= i %>" class="text-muted">Read More</a></span></p> <!-- The link to the detailed single book view will be /Books/[i] - we later change this to /Books/:id -->
                        </div>
                    </div>
                </div>
            </div>
            <% } %> <!-- Not <%= } %> with the EQUAL sign it will not be executed -->
    </div>
    <hr>

</section>
```


When you access http://localhost:8080/Books you will see the nav bar from before, as well as a list of our books.


## Cleaning up the App File with Routers

Remove routes from the app.js file - We create a file bookRoutes.js under src/routes, cut bookRoutes from app.js and simply require bookRouter instead:


__bookRoutes.js__
```javascript
var express = require('express');

var bookRouter = express.Router();

var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
    ];

    bookRouter.route('/') /* route accessed via /Books - bookListView.ejs will be rendered and populated with title, nav and books */
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }],
            books: books
        });
    });

}
module.exports = bookRouter; /* the bookRouter has to be exported to be available for require in app.js */
```


__app.js__
```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;

var bookRouter = require('./src/routes/bookRoutes'); /* We now require the book routes that we moved to bookRouter.js*/

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');


app.use('/Books', bookRouter); /* bookRouter is called here when you access /Books - routes are taken from bookRouter.js */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Books',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```

## 03 Creating a Single Book by ID Route & View

Now we want to add another route to a detailed view of a single books. The Route should be accessible by /Books/:id (ID of the book inside the hardcoded books object - later we will pull an ID from MongoDB). The view rendered will be bookView.ejs.


__bookRoutes.js__
```javascript
var express = require('express');

var bookRouter = express.Router();

var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
];


bookRouter.route('/')
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }]
        });
    });

    bookRouter.route('/:id')  /* We want to be able to access detailed info about a single book by adding the book ID - /Books/:id */
    .get(function (req, res) {
        var id = req.params.id; /* pass id parameter into URL - will be retrieved from books[id] */
        res.render('bookView', {  /* We have to create another view for the single book - bookView.ejs */
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }]
            book: books[id]
        });
    });

}
module.exports = bookRouter;
```


Now we need to write the view to be rendered bookView.ejs (the code below only contains the body part - the header is identical to bookListView.ejs):

__bookView.ejs__
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Library App</title>
  </head>
  <body>
    <section class="container" style="margin-bottom: 300px;">
        <div class="row">
            <div class="col-xs-12 center-block">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%= book.title %></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-2 col-lg-1">
                            <a class="story-title"><img alt="Book Cover" src="<%=book.book.image_url%>" class="img-responsive"></a>
                        </div>
                        <div class="col-xs-12 col-sm-10 col-lg-11">
                            <h4><span class="label label-default"><strong><%= book.author %></strong></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

  </body>
</html>
```


## 04 Cleaning up our routes by creating a variable for the NAV element

We created a navbar in all our views and used EJS to inject some navigational elements in there. But we don´t want to have to copy it into every route. We will create a nav element in app.js instead.


__app.js__
```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;
var nav = [{                           /* We create a NAV element in app.js - this is now available for all routes */
    Link: '/Books',
    Text: 'Book'
    }, {
    Link: '/Authors',
    Text: 'Author'
    }];
var bookRouter = require('./src/routes/bookRoutes')(nav); /* The NAV element is now automatically passed into bookRouter to be available on all bookRoutes */

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');


app.use('/Books', bookRouter);

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Home',
        nav: nav     /* We no longer have to type in the whole navigation - YEAH!*/
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```


Now we have to wrap our routes into a router function with NAV as a variable, to make it available to those routes:


__bookRoutes.js__
```javascript
var express = require('express');

var bookRouter = express.Router();

var router = function(nav){ /* The router is wrapped into a function with NAV as a variable */
    var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
    ];
    bookRouter.route('/')
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: nav,         /* All routes wrapped into router function can now use NAV as a variable */
            books: books
        });
    });

    bookRouter.route('/:id')
    .get(function (req, res) {
        var id = req.params.id;
        res.render('bookView', {
            title: 'Books',
            nav: nav, /* All routes wrapped into router function can now use NAV as a variable */
            book: books[id]
        });
    });

    return bookRouter; /* bookRouter has now to be returned from our router function */
}
module.exports = router;  /* We now have to export the router instead of bookRouter - the router function will be executed in app.js with the NAV element to create a router */
```


* [Part I](/node-express-mongodb-part-i/)
* [Part II](/node-express-mongodb-part-ii/)
* [Part III](/node-express-mongodb-part-iii/)
* [Part V](/node-express-mongodb-part-v/)
