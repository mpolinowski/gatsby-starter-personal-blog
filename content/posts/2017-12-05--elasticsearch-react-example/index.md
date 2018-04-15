---
title: React Search Interface
subTitle: An example project showing how to use Elasticsearch with React
category: "Elasticsearch"
date: 2016-09-03
cover: photo-34445485832_9f5f2a9aea_o-cover.png
hero: photo-34445485832_9f5f2a9aea_o.png
---


![Tanna Island, Vanuatu](./photo-34445485832_9f5f2a9aea_o.png)


## elasticsearch-react-example
An example project showing how to use ElasticSearch with React - based on [elasticsearch-react-example](https://github.com/scotchfield/elasticsearch-react-example) by [scotchfield](https://github.com/scotchfield)



## Prerequisites

To run this example, you will need to configure Elasticsearch to accept requests from the browser using [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing). To enable CORS, add the following to Elasticsearch's config file. Usually, this file is located near the elasticsearch executable at `config/elasticsearch.yml`. [source](https://github.com/spalger/elasticsearch-angular-example)

```yml
http.cors:
  enabled: true
  allow-origin: /https?:\/\/localhost(:[0-9]+)?/
```

## To run the example:
1. Clone this repo locally (or just download and unzip it)

  ```bash
  git clone https://github.com/mpolinowski/elasticsearch-react-example.git
  ```

2. Move into the project

  ```sbashh
  cd elasticsearch-react-example
  ```

3. Run npm install

  ```bash
  npm install
  ```

4. Run webpack (or webpack-dev-server) to build the index.js source file.
---



## Original createClass Syntax

```js
import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

let client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
})

const App = React.createClass({
  getInitialState() {
    return {
      results: []
    }
  },
  handleChange(event) {
    const search_query = event.target.value

    client.search({
      q: search_query
    }).then(function (body) {
      this.setState({ results: body.hits.hits })
    }.bind(this), function (error) {
      console.trace(error.message);
    });
  },
  render() {
    return (
      <div className="container">
        <input type="text" onChange={this.handleChange} />
        <SearchResults results={this.state.results} />
      </div>
    )
  }
})

const SearchResults = React.createClass({
  propTypes: {
    results: React.PropTypes.array
  },
  getDefaultProps() {
    return { results: [] }
  },
  render() {
    return (
      <div className="search_results">
        <hr />
        <ul>
          {this.props.results.map((result) => {
            return <li key={result._id}>{result._source.name}</li>
          })}
        </ul>
      </div>
    )
  }
})


render(<App />, document.getElementById('main'))
```



## Update to a Elasticsearch 5.x index

```js
import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

const connectionString = 'localhost:9200';
const _index = 'wiki2_de_2017_09_09';
const _type = 'article';

const App = React.createClass({
  getInitialState() {
    return {
      results: []
    }
  },
  handleChange(event) {
    const search_query = event.target.value

    client.search({
      index: _index,
      type: _type,
      q: search_query,
      body: {
        query: {
          multi_match: {
            query: search_query,
            fields: ['title^100', 'tags^100', 'abstract^20', 'description^10', 'chapter^5', 'title2^10', 'description2^10'],
            fuzziness: 1,
          },
        },
      },
    }).then(function (body) {
      this.setState({ results: body.hits.hits })
    }.bind(this), function (error) {
      console.trace(error.message);
    });
  },

  render() {
    return (
      <div className="container">
        <input type="text" onChange={this.handleChange} />
        <SearchResults results={this.state.results} />
      </div>
    )
  }
})

const SearchResults = React.createClass({
  propTypes: {
    results: React.PropTypes.array
  },
  getDefaultProps() {
    return { results: [] }
  },
  render() {
    return (
      <div className="search_results">
        <hr />
        <ul>
          {props.results.map((result) => {
            return
            <li key={result._id}>
              <h3>{result._source.title}</h3><br />
              <a href={`${result._source.link}`}><img src={result._source.image} alt={result._source.abstract} /><br /></a>
              <p>{result._source.abstract}</p>
            </li>
          })}
        </ul>
      </div>
    )
  }
})


render(<App />, document.getElementById('main'))
```



## ES6 Class Syntax


```js
import React, { Component } from "react";
import { render } from "react-dom";
import elasticsearch from "elasticsearch";

const connectionString = 'localhost:9200';
const _index = 'wiki2_de_2017_09_09';
const _type = 'article';

let client = new elasticsearch.Client({
  host: connectionString,
  log: "trace"
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { results: [] };
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const search_query = event.target.value;

    client.search({
      index: _index,
      type: _type,
      body: {
        query: {
          multi_match: {
            query: search_query,
            fields: ['title^100', 'tags^100', 'abstract^20', 'description^10', 'chapter^5', 'title2^10', 'description2^10'],
            fuzziness: 1,
          },
        },
      },
    }).then(function (body) {
      this.setState({ results: body.hits.hits });
    }.bind(this),
      function (error) {
        console.trace(error.message);
      }
    );
  }

  render() {
    return (
      <div className="container">
        <input type="text" onChange={this.handleChange} />
        <SearchResults results={this.state.results} />
      </div>
    );
  }
}

const SearchResults = ({ results }) => (
  <div className="search_results">
    <hr />

    <table>
      <thead>
        <tr>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, i) =>
          <ResultRow key={i}
            title={result._source.title2} />
        )}
      </tbody>
    </table>
  </div>
)

const ResultRow = ({ title }) => (
  <tr>
    <td>
      {title}
    </td>
  </tr>
)



render(<App />, document.getElementById("main"));
```


https://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes

https://babeljs.io/blog/2015/06/07/react-on-es6-plus

https://medium.com/dailyjs/we-jumped-the-gun-moving-react-components-to-es2015-class-syntax-2b2bb6f35cb3