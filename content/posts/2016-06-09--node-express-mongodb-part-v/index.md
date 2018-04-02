---
title: Node/Express with MongoDB (Part IV)
subTitle: Building a Express Web Library with a MongoDB Backend and Goodreads API Integration
category: "MongoDB"
date: 2016-06-05
cover: photo-34607488365_9f40aafb01_o-cover.jpg
hero: photo-34607488365_9f40aafb01_o.jpg
---

![Harbin](./photo-34607488365_9f40aafb01_o.jpg)


[Github Repository](https://github.com/mpolinowski/node_express_git)


> This code is part of a training in web development with [Node.js](https://nodejs.org/en/). [EJS](http://ejs.co) will be used as template engine for rendering HTML out of [Express](https://expressjs.com). The library application will use [MongoDB](https://www.mongodb.com) to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. [Passport.js](http://www.passportjs.org) is used for local security.


* In [Part I](/node-express-mongodb-part-i/) we go through the basic [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com) setup
* In [Part II](/node-express-mongodb-part-ii/) we added [Bower.js](https://bower.io/) and the [Gulp.js](https://gulpjs.com/) taskrunner to manage our style dependencies and auto-restart our development environment using [Nodemon.js](https://nodemon.io)
* Here Part III and we add the magic of the [EJS](http://ejs.co) templating engine
* [Part IV](/node-express-mongodb-part-iv/) deals with advanced Express routing options
* [Part V](/node-express-mongodb-part-v/) deals with [Passport.js](http://www.passportjs.org) user authentication and [MongoDB](https://www.mongodb.com)


## 01 Adding MongoDB

### Download and Install MongoDB

The installer can be downloaded from [MongoDB.com](https://www.mongodb.com)

Install the database, navigate to the install directory (e.g. _C:\Program Files\MongoDB\Server\3.2\bin_) with your command line and start the application with the command __mongod__. Make sure that you created a directory C:\data\db before running the mongod process!

Useful Commands for MongoDB:

|  |  |
|---|---|
| __*Command*__ | __*Function*__ |
| __mongo__ | Start |
| __show dbs__ | Display all Databases |
| __mongo libraryApp__  | Open libraryApp Database |
| __show collections__  | Show all Collections of the opened Databases |
| __db.books.find();__  | Display all Objects inside the books Collection |
| __db.books.remove({})__  | Remove all Objects from the books Collection |


### Create adminRoutes to populate the Database

First install mongoDB into our project with _npm install --save mongodb_

Now we create a new file adminRoutes.js in the src/routes directory.


adminRoutes.js
```javascript
var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient; /* Pull in the mongoClient */

var books = [{ /* Copy books from bookRoutes.js */
    title: 'Cryptonomicon',
    isbn10: '0060512806',
    author: 'Neil Stephenson',
    bookId: '816',
    cover: 'http://ecx.images-amazon.com/images/I/414L%2BIbzcvL._SX317_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Leviathan Wakes',
    isbn10: '0316129089',
    author: 'James S.A. Corey',
    bookId: '9533361',
    cover: 'http://ecx.images-amazon.com/images/I/51QvTzb2vYL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'The Lord of the Rings',
    isbn10: '0395193958',
    author: 'J.R.R. Tolkien',
    bookId: '569465',
    cover: 'http://ecx.images-amazon.com/images/I/51eq24cRtRL._SX331_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Norwegian Wood',
    isbn10: '0375704027',
    author: 'Haruki Murakami',
    bookId: '11297',
    cover: 'http://ecx.images-amazon.com/images/I/512ZgaaHjIL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'Microserfs',
    isbn10: '0006548598',
    author: 'Douglas Coupland',
    bookId: '2751',
    cover: 'http://ecx.images-amazon.com/images/I/512ZD5DVC4L._SX345_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Up Country',
    isbn10: '0446611913',
    author: 'Nelson Demille',
    bookId: '33820',
    cover: 'http://ecx.images-amazon.com/images/I/512Jrk-RopL._SX290_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Night over Water',
    isbn10: '0451173139',
    author: 'Ken Follett',
    bookId: '967690',
    cover: 'http://ecx.images-amazon.com/images/I/51OON2-%2BI-L._SX297_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'The Stand',
    isbn10: '0307947300',
    author: 'Stephen King',
    bookId: '13155183',
    cover: 'http://ecx.images-amazon.com/images/I/41IzCMjxPWL._SX320_BO1,204,203,200_.jpg',
    read: true
}];

var router = function (nav) {

    adminRouter.route('/addBooks') /* open http://localhost:8080/Admin/addBooks to add books to MongoDB */
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp'; /* Connect to our local installation of MongoDB via the default port 27017 - create DB libraryApp on insert */

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books'); /* Connect to a Collection in libraryApp named books - is created on first insert */
                collection.insertMany(books, /* insertMany inserts all Objects from the books variable from above (otherwise insertOne) */
                    function (err, results) {
                        res.send(results); /* Display the Collection after Insert - Object will be assigned ID by MongoDB*/
                        db.close(); /* db.close has to be inside the callback (async !)*/
                    }
                );

            });

        });

    return adminRouter;
};

module.exports = router;
```


Add the /Admin route to App.js and use adminRouter for it


__app.js__
```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav); /* Add adminRoutes */

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter); /* Use adminRoutes for /Admin */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
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


Now make sure mongod is running and access http://localhost:8080/Admin/addBooks - you will get a JSON Object as MongoDB Response. All books will have an ID assigned by the Database and the DB 'libraryApp' and Collection 'books' will be created. Use the mongo commands (List, above) to check.


## 02 Use the MongoDB Response

### Select Many

Remove the hardcoded books variable and use the mongoDB response instead. Display all books from the books Collection. (bookListView.ejs)


__bookRoutes.js__
```javascript
var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function (nav) {

 /* var books = [...]; has been deleted */

    bookRouter.route('/')
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books'); /* Connect to mongoDBs libraryApp books Collection */

                collection.find({}).toArray( /* find all Objects in the books Collection and put it into an Array */
                    function (err, results) {
                        res.render('bookListView', { /* Copy the res.render from before into the function to render the result of our mongoDB query*/
                            title: 'Books',
                            nav: nav,
                            books: results
                        });
                    }
                );
            });

        });

    return bookRouter;
};
module.exports = router;
```


### Select One

Now we want to have a books details page (bookView.ejs) that only displays one book from the books Collection


__bookRoutes.js__
```javascript
var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID; /* Each book is assigned an ID by mongoDB - we make this ID available for our bookListView.ejs */

var router = function (nav) {

    bookRouter.route('/')
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.find({}).toArray(
                    function (err, results) {
                        res.render('bookListView', {
                            title: 'Books',
                            nav: nav,
                            books: results
                        });
                    }
                );
            });

        });

    bookRouter.route('/:id')
        .get(function (req, res) {
            var id = new objectId(req.params.id); /* We use the mongoDB ID (_id) for id -> URL is now /Books/:_id instead of /Books/:id */
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.findOne({_id: id}, /* findOne returns the first book from the books collection with the same _id */
                    function (err, results) {
                        res.render('bookView', { /* result will be rendered in bookView.ejs */
                            title: 'Books',
                            nav: nav,
                            book: results
                        });

                    }
                );

            });

        });

    return bookRouter;
};
module.exports = router;
```


Now we want to have a books details page (bookView.ejs) that only displays one book from the books Collection


__bookListView.ejs__
```html
...
<!-- ################################################ Media ######################################################### -->

<section class="container" style="margin-bottom: 400px;">
    <div class="row">
        <% for(var i=0; i<books.length;i++){%>
            <div class="col-xs-6 col-md-4 col-lg-3 center-block" style="margin-bottom: 10px;">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%=books[i].title%></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-4 col-lg-6">
                            <a class="story-title" href="/Books/<%=books[i]._id%>"><img alt="" src="<%=books[i].cover%>" style="height:100px" class="img-thumbnail"></a>
                        </div>
                        <div class="col-xs-12 col-sm-8 col-lg-6">
                            <p><span class="label label-default"><strong><%=books[i].author%></strong></span></p>
                            <p><span style="font-family:courier,'new courier';" class="text-muted"><a href="/Books/<%=books[i]._id%>" class="text-muted">Read More</a></span></p> <!-- Change URL from /Books/:i (<%= i %> with i = 0,1,2,3....8) to /Books/:_id -> _id will be used to findOne -->
                        </div>
                    </div>
                </div>
            </div>
            <%}%>
    </div>
    <hr>

</section>
...
```


## 03 Creating a SignIn Form on Index.ejs

Just a simple Input Form


__index.ejs__
```html
...
<!-- ################################################ Login ######################################################### -->

<div class="col-xs-4 col-xs-offset-1" style="margin-top: 30px;">
    <div class="container">
        <div class="row">
            <div class="col-sm-offset-1 col-sm-2 col-xs-12 text-center">
                <form name="signUpForm" action="/auth/signUp" method="post"> <!-- Creating a form to post SignUp to /auth/signUp -->
                    User Name:
                    <input name="userName" id="userName"> <!-- Input userName for post -->
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password"> <!-- Input password for post -->
                    <br/>
                    <br/>
                    <input type="submit" value="Sign Up"> <!-- Submit post -->
                </form>
            </div>
        </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /v-center -->

<!-- ################################################ /Login ######################################################### -->
...
```


## 05 Creating the Authentication Route

We need to add var bodyParser = require('body-parser'); to app.js. The body-parser middleware will be used in app.use(bodyParser.json()); and app.use(bodyParser.urlencoded()); to create a req.body object from JSON elements or URL parameter. Body-parser is install with npm install --save body-parser.


__authRoute.js__
```javascript
var express = require('express');
var authRouter = express.Router(); /* Creating the Authentication Router */
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function () {
    authRouter.route('/signUp') /* Creating the SingUp route */
        .post(function (req, res) {
            console.log(req.body); /* We log the req.body Object created by bodyParser from the signUp post to /auth/signup */
                });

            };

    return authRouter; /* return authRouter to be available for app.js */
};

module.exports = router;
```

We now add the authRoute to app.js


__app.js__
```javascript
var express = require('express');
var bodyParser = require('body-parser');  /* Install bodyParser see above */

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav); /* Use the created authRouter for the Authentication routes */

app.use(express.static('public'));
app.use(bodyParser.json()); /* Use bodyParser to create req.body Object from JSON elements*/
app.use(bodyParser.urlencoded()); /* Use bodyParser to create req.body Object from URL encoded JSON elements*/

require('./src/config/passport')(app);

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter); /* Use the created authRouter for the Authentication routes */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
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


## 06 Adding Passport.js Middleware

First we need to _npm install --save cookie-parser passport express-session_.


__authRoute.js__
```javascript
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); /* To parse the session cookie used by passport */
var passport = require('passport'); /* user authentication */
var session = require('express-session'); /* for passport-session: creates a session for the logged in user. Session stores the user information inside a cookie for the active session */

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser()); /* use cookieParser to parse the session cookie */
app.use(session({secret: 'library'})); /* The session needs a secret - can be chosen freely */

require('./src/config/passport')(app); /* We separate the passport stuff src/config/passport.js - we pull in (app) to be able to app.use inside passport.js */

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
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

Separate the passport component to _src/config/passport.js_. We need to _npm install --save passport-local_ to use the local strategy of authentication (not OAuth).


__passport.js__
```javascript
var passport = require('passport'); /* pull in passport */

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) { /* Add User to Session */
        done(null, user); /* Callback User from Database */
    });

    passport.deserializeUser(function (user, done) { /* Remove User from Session */
        done(null, user);
    });

    require('./strategies/local.strategy')(); /* We only use a local.strategy for authentication - not passport.google, passport.facebook, etc. - Third-party OAuth. We save the file in src/config/strategies/local.strategy.js */

};
```

## 07 Authentication with Local Strategy

Now we create the local.strategy.js as required in passport.js:


__local.strategy.js__
```javascript
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    passport.use(new LocalStrategy({
          usernameField: 'userName', /* take userName from input form in index.ejs when posted to /auth/signUp (bodyParser) */
          passwordField: 'password' /* take password from input form in index.ejs when posted to /auth/signUp (bodyParser) */
      },
      function (username, password, done) { /* Pass username/password - then callBack done */
          var user = {username: username,
                      password: password
                    };
                    done(null, user); /* Take user and return user - authentication with mongoDB comes next */
                  }));
};
```

req.login and redirect to Profile


__authRoute.js__
```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            req.login(req.body, function(){ /* We do not yet save the user to mongoDB - just redirect him to /auth/profile */
              res.redirect('/auth/profile');
            });
        });
    authRouter.route('/profile') /* we have to create the profile route */
      .get(function(req, res) { /* When GET /profile... */
        res.json(req.user); /* ... respond with the JSON Object user */
      });
    return authRouter;
};

module.exports = router;
```

## 08 Saving the User to MongoDB

SignUp save User to MongoDB


__authRoute.js__
```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url =
                'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) { /* connect to local install of mongoDB */
                var collection = db.collection('users'); /* open users collection that is created on first signUp */
                var user = { /* Creation of a user object from req.body */
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user, /* the user is automatically inserted into the users collection (collection is automatically created) */
                    function (err, results) {
                        req.login(results.ops[0], function () { /* user is no longer taken from req.body but from the results ops[0] limits the result to the {username, password, _id} JSON object */
                            res.redirect('/auth/profile');
                        });
                    });
            });

        });
    authRouter.route('/profile')
      .get(function(req, res) {
        res.json(req.user);
      });
    return authRouter;
};

module.exports = router;
```

## 09 User SignIn from mongoDB

Creating the SignIn Form


__index.ejs__
```javascript
<!-- ################################################ Login ######################################################### -->

<div class="col-xs-4 col-xs-offset-1" style="margin-top: 30px;">
    <div class="container">
        <div class="row">
            <div class="col-sm-offset-3 col-sm-2 col-xs-12 text-center">
                <form name="signInForm" action="/auth/signIn" method="post"> <!-- SignIN -->
                    User Name:
                    <input name="userName" id="userName">
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password">
                    <br/>
                    <br/>
                    <input type="submit" value="Sign In">
                </form>
            </div>

            <div class="clearfix visible-xs" style="margin-bottom: 20px;"></div>

            <div class="col-sm-offset-1 col-sm-2 col-xs-12 text-center">
                <form name="signUpForm" action="/auth/signUp" method="post"> <!-- SignUp -->
                    User Name:
                    <input name="userName" id="userName">
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password">
                    <br/>
                    <br/>
                    <input type="submit" value="Sign Up">
                </form>
            </div>
        </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /v-center -->
<!-- ################################################ /Login ######################################################### -->
```

SignIn save User to MongoDB


__authRoute.js__
```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport'); /* Pull in passport for signIn */

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url =
                'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user,
                    function (err, results) {
                        req.login(results.ops[0], function () {
                            res.redirect('/auth/profile');
                        });
                    });
            });

        });
    authRouter.route('/signIn')
        .post(passport.authenticate('local', { /* user post is authenticated with passport local strategy */
            failureRedirect: '/' /* If user did not sign up first - redirect back to home */
        }), function (req, res) {
            res.redirect('/auth/profile'); /* If successfully authenticated go to profile page */
        });
    authRouter.route('/profile')
        .all(function (req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function (req, res) {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;
```

## 10 Verifying User in DB

__authRoute.js__

...

* [Part I](/node-express-mongodb-part-i/)
* [Part II](/node-express-mongodb-part-ii/)
* [Part III](/node-express-mongodb-part-iii/)
* [Part IV](/node-express-mongodb-part-iv/)