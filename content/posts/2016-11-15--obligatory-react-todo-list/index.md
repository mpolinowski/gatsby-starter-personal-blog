---
title: Obligatory React TODO List
subTitle: Every web-dev should have one or two of them on Github ~
category: "React.js"
date: 2016-10-15
cover: photo-34605595465_74a1d827f4_o-cover.png
hero: photo-34605595465_74a1d827f4_o.png
---

![Harbin](./photo-34605595465_74a1d827f4_o.png)


* [Github Repository](https://github.com/mpolinowski/obligatory-react-todo-list)

DEPRECATION... this is no longer going to work :( please read a [obligatory-react-todo-list-2017](https://github.com/mpolinowski/obligatory-react-todo-list-2017) for an updated version,

I will keep this example, because it uses react router... but everything else is more interesting in the 2017 example.


# React-TODO-List
Every web-dev should have one or two of them on Github ~

01. [Install react, react-dom and babel](#01-install-react-react-dom-and-babel)
02. [Create our first React Component](#02-create-our-first-react-component)
03. [Passing Data into Component using Props](#03-passing-data-into-component-using-props)
04. [Working with Component State](#04-working-with-component-state)
05. [Using setState to change State of a Component](#05-using-setstate-to-change-state-of-a-component)
06. [Cycling through data](#06-cycling-through-data)
07. [Nesting Components](#07-nesting-components)
08. [Handling Events](#08-handling-events)
09. [Modularize](#09-modularize)
10. [Adding styles with Webpack](#10-adding-styles-with-webpack)
11. [Input Refs](#11-input-refs)
12. [Component Lifecycle Methods](#12-component-lifecycle-methods)

## 01 Install react, react-dom and babel
All dependencies will be installed by npm after we initialized the repo (just confirm all defaults):

```
npm init
```

Now we will install the react packages:

```
npm install --save react react-dom
```

Now we will install the babel packages as development dependencies (to transform our ES6 Javascript):

```
npm install --save-dev react babel-core babel-loader babel-preset-es2015 babel-preset-react
```

Further we will use the Webpack dev-server to create a hot-reloading development environment for our app:

```
npm install --save-dev webpack webpack-dev-server
```

To configure our Webpack, we create a *webpack.config.js* inside the root directory of our app. We configure it to take all JS files from the /src folder and bundle them into the /dist (that will be created by Webpack). The babel-loader will use the react and es2015 preset to convert our code to standardized Javascript!

By setting the publicPath to */app/* we don't have to add the */dist* folder to links - *./dist/app/bundle.js* can be referenced by <script src="/app/bundle.js"></script> inside our *index.html* file.

```js
var path = require('path');

module.exports = {

    entry: path.resolve(__dirname, 'src') + '/app/index.js',
    output: {
        path: path.resolve(__dirname, 'dist') + '/app',
        filename: 'bundle.js',
        publicPath: '/app/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
```

Add the following npm scripts to package.json to be able to start the webpack-server with *npm start*:

```
"start": "npm run build",
"build": "webpack -d && webpack-dev-server --content-base src/ --inline --hot --port 1234 --history-api-fallback"
```

*npm start* will now trigger *npm run build* - where build fires up our webpack-server on **--port 1234**. The server expects a *index.js* file in the root directory. **--content-base src/** points it to our /src instead. **--inline** and **--hot** enables hot reloading.


## 02 Create our first React Component

Require react and react-dom to */src/app/index.js* :

```
const React = require('react');
const ReactDOM = require('react-dom');
```

and create the **TodoComponent** written in JSX - always wrap your HTML into a div container (there must only be one parent tag in each component!):

```js
var TodoComponent = React.createClass({
  render: function(){
    return(
      <div>
        <h1>Hello World</h1>
        <p>First React Component</p>
      </div>
    );
  } // render
});
```

Now we have to get our component rendered inside the HTML file:

```
ReactDOM.render(<TodoComponent />, document.getElementById('todo-wrapper'));
```

The id **todo-wrapper** can be referenced inside a div tag in */src/index.html* to render our h1 tag:

```
<div id="todo-wrapper"></div>
```


## 03 Passing Data into Component using Props

For example, we now create a constant with some data strings and pass them into our TodoComponent in */src/app/index.js*:

```js
const myData = {name:'Stefan Stefanopolos', year:'1922', origin:'Athens, Greece'}

ReactDOM.render(<TodoComponent data={myData}/>, document.getElementById('todo-wrapper'));
```

And reference this message inside the component itself:

```js
var TodoComponent = React.createClass({
  render: function(){
    return(
      <div>
        <ul>
          <li><strong>Author:</strong> {this.props.data.name}</li>
          <li><strong>Year:</strong> {this.props.data.year}</li>
          <li><strong>Location:</strong> {this.props.data.origin}</li>
        </ul>
      </div>
    );
  } //render
});
```

The string will now show up on our page. -> Just a proof of concept /delete


## 04 Working with Component State

So far our component only has a render function - we will now add a getInitialState function on top:

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index']
    }
  },
  render: function(){
    return(
      <div id="todo-list">
        <h1>TODO List</h1>
        <ul>
          <li>{this.state.todos[0]}</li>
          <li>{this.state.todos[1]}</li>
          <li>{this.state.todos[2]}</li>
        </ul>
      </div>
    );
  } // render
});
```

```js
ReactDOM.render(<TodoComponent />, document.getElementById('todo-wrapper'));
```


## 05 Using setState to change State of a Component

Another proof of concept - will be deleted before the next step.

We want to add a another variable to the InitialState and update this variable after 5 seconds:

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index'],
      date: '2017-09-11' // InitialState date will be changed after 5s by setTimeout function below
    }
  }, //InitialState
  render: function(){
    var dater = setTimeout(function(){
        this.setState({
          date: '2017-09-12'
        });
    }.bind(this), 5000); // Remember to bind 'this' to function!
    return(
      <div id="todo-list">
        <h1>TODO List</h1>
        <h3>{this.state.date}</h3>
        <ul>
          <li>{this.state.todos[0]}</li>
          <li>{this.state.todos[1]}</li>
          <li>{this.state.todos[2]}</li>
        </ul>
      </div>
    );
  } // render
});
```


## 06 Cycling through data

Usually we do not know how many items are inside the InstialState array - lets write a function that works for any array.length

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index', 'drink a cup of coffee'],
      date: '2017-09-11'
    }
  }, //InitialState
  render: function(){
    var todos = this.state.todos; // create a local copy of todos array inside function
    todos = todos.map(function(item, index){ // put each item from todos array into JSX li-tags
      return(
        <li>{item}</li>
      )
    });
    return(
      <div id="todo-list">
        <h1>TODO List</h1>
        <h3>{this.state.date}</h3>
        <ul>
          {todos}
        </ul>
      </div>
    ); // we now reference the local todos variable instead of the this.state.todos
  } // render
});
```


## 07 Nesting Components

We now want to make TodoComponent our parent component to wrap around nested child components, that will build our Todo List. We want to delete the <li>{item}</li> part and substitute it with a child component TodoItem:

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index', 'drink a cup of coffee'],
      date: '2017-09-11'
    }
  }, //InitialState
  render: function(){
    var todos = this.state.todos;
    todos = todos.map(function(item, index){
      return(
        <TodoItem item={item} key={index} /> // Todo list component build from all items of array todos
      )
    });
    return(
      <div id="todo-list">
        <h1>TODO List</h1>
        <h3>{this.state.date}</h3>
        <ul>
          {todos}
        </ul>
      </div>
    ); // we now reference the local todos variable instead of the this.state.todos
  } // render
});
```

The TodoItem Component is created below it's parent:

```js
// Create TodoItem component
var TodoItem = React.createClass({
  render: function(){
    return (
      <li>
        <div className="todo-item">
          <span className="item-name">{this.props.item}</span> // item prop is passed down from parent component
        </div>
      </li>
    );
  }
});
```


## 08 Handling Events

### Demo Click-Event Handler

Catching an event in React can be easy - the following is a proof of concept and will be deleted again.
First we add a click-event handler to our h1-tag and will log each click event to console

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index', 'drink a cup of coffee'],
      date: '2017-09-11'
    }
  }, //InitialState
  render: function(){
    var todos = this.state.todos;
    todos = todos.map(function(item, index){
      return(
        <TodoItem item={item} key={index} />
      )
    }.bind(this));
    return(
      <div id="todo-list">
        <h1 onClick={this.clicked}>TODO List</h1> // add onClick function to the h1 tag
        <h3>{this.state.date}</h3>
        <ul>
          {todos}
        </ul>
      </div>
    );
  }, // render

  // Custom functions
  clicked: function(){
    console.log('you clicked me!'); // and create the corresponding function
  } // click event
});
```

### Add Item Delete Event handler

We first add a "x" behind each item and add a clickEvent Handler to it, that triggers a function we will call handleDelete. This function is created below inside the TodoItem Component.


```js
var TodoItem = React.createClass({
  render: function(){
    return (
      <li>
        <div className="todo-item">
          <span className="item-name">{this.props.item}</span>
          <span className="item-remove" onClick={this.handleDelete}> x </span> {/* add an onClick Delete Item from List. handleDelete will trigger onDelete function in parent component */}
        </div>
      </li>
    );
  },

  // Custom functions
  handleDelete: function(){
        this.props.onDelete(this.props.item); // onDelete was passed down as props and is available - items selected by handleDelete will be set to true in onDelete function in parent component to delete item from todos
  }
});
```

To be able to delete an item from the todos-array, the handleDelete function needs to communicate with an onDelete function, that we will add to the parent TodoComponent. We will do this by passig down the onDelete function as a prop from the parent -> <TodoItem onDelete={this.onDelete} /> (don't forget to bind 'this' to the component!).

```js
var TodoComponent = React.createClass({
  getInitialState: function(){
    return {
      todos:['Reply Emails', 'Proof-read Printmanuals', 'Generate new Search-Index', 'drink a cup of coffee'],
      date: '2017-09-11'
    }
  }, //InitialState
  render: function(){
    var todos = this.state.todos;
    todos = todos.map(function(item, index){
      return(
        <TodoItem key={index} item={item} onDelete={this.onDelete} /> // onDelete function is passed down as prop to child component
      )
    }.bind(this));
    return(
      <div id="todo-list">
        <h1>TODO List</h1>
        <h3>{this.state.date}</h3>
        <ul>
          {todos}
        </ul>
      </div>
    );
  }, // render

  // Custom functions
  onDelete: function(item){ // the item passed into onDelete is the item set to 'true' by our handleDelete function
    var updatedTodos = this.state.todos.filter(function(value, index){ // create updatedTodos with item removed when value is set to true by handleDelete function in TodoItem child component below
      return item !== value;
    });
    this.setState({
      todos: updatedTodos // set original todos var to updatedTodos
    });
  }
});
```

In the onDelete function we set todos item-array to a new variable, filter out all items that whos value is set true by the handleDelete function.

When you click the X behind an item, the handleDelete function will fire and set the items value to 'true'. The onDelete function will filter out all items with value 'true' and set the state of todos to the new array - in short 'true' items will be deleted from the array and the component will be re-rendered with the new state.


## 09 Modularize

To keep our code readable, we want to break up each component into a separate module. We create a todoItem.js file next to index.js and cut&paste our TodoItems Component into it. Remember to import 'react' ('react-dom' is not necessary - it is only used to write to DOM... as done in the final line of index.js "ReactDOM.render(<TodoComponent />, document.getElementById('todo-wrapper'));")

```js
import React from 'react';

// Create TodoItem component
var TodoItem = React.createClass({
  render: function(){
    return (
      <li>
        <div className="todo-item">
          <span className="item-name">{this.props.item}</span>
          <span className="item-remove" onClick={this.handleDelete}> x </span>
        </div>
      </li>
    );
  },

  // Custom functions
  handleDelete: function(){
        this.props.onDelete(this.props.item);
  }
});

module.exports = TodoItem;
```

Note that we need to export our component to make it available for import into our parent component in index.js:

```js
import React from 'react';
import ReactDOM from 'react-dom';

import TodoItem from './todoItem';
```


## 10 Adding styles with Webpack

We added 'style-loader' and 'css-loader' to our Webpack config before - but haven't installed them yet:

```
npm install style-loader css-loader --save-dev
```

Now we are going to use it to import styles for our components. Create a /src/app/css folder and create index.css:

```css
/* index.css */

body{
  background: #eee;
  margin: 20px;
  font-family: tahoma;
}

#todo-wrapper{
  width: 80%;
  margin: 0 auto;
  background: #fff;
  border-top: 3px solid #7f4cc1;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 1px 3px 5px rgba(0,0,0,0.2);
  color: #333;
}

#todo-wrapper p{
  color: #777;
  font-style: italic;
}

#todo-list ul{
  list-style-type: none;
  padding: 0;
}
```

And another file for our todoItem component (todoItem.css):

```css
/* todoItem.css */

.todo-item{
  padding: 16px 5px;
  border-bottom: 1px dashed #bbb;
  display: flex;
}

.todo-item:hover{
  background: #eee;
}

.item-name{
  flex-basis: 0;
  flex-grow: 9;
}

.item-remove{
  flex-basis: 0;
  flex-grow: 1;
  text-align: right;
  color: #7f4cc1;
  font-weight: bold;
  cursor: pointer;
}
```

These can now be imported into the corresponding react components:

```
import styles from './css/todoItem.css';
```

and in index.js:

```
import styles from './css/index.css';
```


## 11 Input refs

Now we want to add a component that allows us to add items to our TODO list. Add a new file named addItem.js into the app folder:

```js
import React from 'react';

import styles from './css/addItem.css';


// Create AddItem component
var AddItem = React.createClass({
  render: function(){
    return(
      <form id="add-todo" onSubmit={this.handleSubmit}>
        <input type="text" required ref="newItem" />
        <input type="submit" value="Hit me" />
      </form>
    );
  }  
});

module.exports = AddItem;
```

And import it to our index.js file:

```js
import AddItem from './addItem';
```

So we can reference it inside our TODO list component:

```js
<div id="todo-list">
  <h1>TODO List</h1>
  <h3>{this.state.date}</h3>
  <ul>
    {todos}
  </ul>
  <AddItem onAdd={this.onAdd} />
</div>
```

The onAdd function is added as a custom function below the onDelete function we already created:

```js
onAdd: function(item){
  var updatedTodos = this.state.todos;
  updatedTodos.push(item);
  this.setState({
    todos: updatedTodos
  });
}
```

Now we need to add the handleSubmit (already referenced in the AddItem component) custom function to AddItem component:

```js
handleSubmit: function(e){
  e.preventDefault();
  this.props.onAdd(this.refs.newItem.value);
}
```


## 12 Component Lifecycle Methods

To test lifecycle functions, we will add them to our TodoComponent (below custom functions):

```js
// lifecycle functions

  componentWillMount: function(){
    console.log('componentWillMount');
  }, // function called directly before component is loaded

  componentDidMount: function(){
    console.log('componentDidMount');
  },  // function called directly after component is loaded => e.g. grab external DATA

  componentWillUpdate: function(){
    console.log('componentWillUpdate');
  } // everything in here will be called once a state change causes a re-render
```


## 13 Router

To add more then one views (pages) to our web app, we need to install react-router

```
npm install react-router --save
```

And import the router into our index.js

```js
import{BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
```

Now we can add a route for every parent component that we have (so far only TodoComponent) inside index.js:

```js
const App = React.createClass({
  render: function(){
    return(
      <BrowserRouter>
          <TodoComponent />
      </BrowserRouter>
    );
  }
});
```

Now we need to render <App /> instead of <TodoComponent />

```js
render(<App />, document.getElementById('todo-wrapper'));
```

Adding an About view to our app -> add an about.js file inside the app dir:

```js
import React from 'react';

var About = React.createClass({
  render: function(){
    return(
      <h2>All about me</h2>
    );
  }
});

module.exports = About;
```

The react router v4 requires us to wrap subroutes into an enclosing component - we will call it <AppLayout />:

```js
const AppLayout = () => (
  <div className="layout">
    <header>
      <h1>Our Todo List</h1>
      <nav>
        <NavLink to="/" exact activeClassName="active">Home /</NavLink>
        <NavLink to="/about" activeClassName="active"> About</NavLink>
      </nav>
    </header>
    <main>
      <switch>
        <Route path='/' exact component={TodoComponent} />
        <Route path='/about' component={About} />
      </switch>
    </main>
  </div>
)

const App = () => (
  <Router>
    <AppLayout />
  </Router>
)
```