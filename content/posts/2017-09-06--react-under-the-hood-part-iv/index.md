---
title: React under the Hood (Part IV)
subTitle: A look behind the curtain of React Starters
category: "Babel"
date: 2016-09-06
cover: photo-34606004425_223f1c6e87_o-cover.jpg
hero: photo-34606004425_223f1c6e87_o.jpg
---


![Harbin, China](./photo-34606004425_223f1c6e87_o.jpg)


> A look behind the curtain of React Starters like:
> 
> * [create-react-app](https://github.com/facebookincubator/create-react-app)
> * [Gatsby.js](https://github.com/gatsbyjs/gatsby)
> * [Next.js](https://github.com/zeit/next.js)
> * [Neutrino](https://neutrino.js.org)
> 
> React is often said to be easy to learn, but impossible to set up in an dev environment. Once you start reading about it, you will be faced by an exhausting amount of choices that you have to make, before you can move on to actual coding. Starter Packages, like the ones named above, give a quick access to the React world. Let's take a look into that black box now.



### Table of Content

01. [Pure React](/react-under-the-hood-part-i/)
02. [JSX and Babel](/react-under-the-hood-part-ii/)
	* Transpilation
03. [Webpack](/react-under-the-hood-part-iii/)
	* Loading JSON
	* Adding SASS
04. [React Components](#04-react-components)
	* ES6 Class Syntax
	* Stateless Functions
05. [Adding React-Icons](/react-under-the-hood-part-v/)
06. [Working with Props](/react-under-the-hood-part-vi/)
	* Default Props
	* PropType Validation
07. [Working with State](/react-under-the-hood-part-vii/)



## 04 React Components

Let us now build a small component that list [how many countries] there are in the world, how many we have visited and how much we want to visit in total. We can also add a little bit of math to it and calculate the completion percentage of our endeavor. When you look at code examples on Github, you will find a couple of different ways to write such a component. The first, and oldest one uses the __createClass__ syntax and will no longer work in react v16 - [React 15.5.0: React.createClass officially deprecated](https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).


```js
import React from 'react'
import '../assets/sass/kraken.scss'

// cannot be rendered inside react 16 - you need to downgrade your react and reactDom version to react < 15.5

export const CountriesVisited = React.createClass({
	percentToDecimal(decimal) {
		return ((decimal * 100) + '%')
	},
	calcGoalProgress(total, goal) {
		return this.percentToDecimal(total/goal)
	},
	render() {
		return (
			<div className="countries-visited">
        <hr/>
        <h3>The React.createClass Syntax is no longer supported inside React v16!</h3>
				<div className="total-contries">
					<span>{this.props.total} </span>
					<span>total countries</span>
				</div>
				<div className="visited">
					<span>{this.props.visited} </span>
					<span>visited countries</span>
				</div>
				<div className="wish-list">
					<span>{this.props.liked} </span>
					<span>countries on wishlist</span>
				</div>
				<div>
					<span>
						{this.calcGoalProgress(
							this.props.total,
							this.props.goal
						)}
					</span>
				</div>
			</div>
		)
	}
})
```

Here we are working with props (properties) that are passed down from the parent component in _./src/index.js_. That means, if we want to add this component, we also have to inject those properties. If you add the following to the render function inside the parent component (see further below, on how to implement it):

```js
<CountriesVisited total={196}
									visited={86}
									liked={186}
									goal={96}/>
```

and given that you are using react < v16, our component would be rendered inside our main component, just as our buttons did in the example before.

Just in case that you stumble over a code bit somewhere that looks like this... Now lets bring it up to speed and rewrite the component with ES16 syntax!




### ES6 Class Syntax

```js
export class MyComponent extends Component {
		render() {
			return (
				<div>{props.title}</div>
	    )
	  }
	}
```


```js
import { Component } from 'react'

import '../assets/sass/kraken.scss'
import '../assets/sass/ui.scss'

export class CountriesVisitedES6 extends Component {
  percentToDecimal (decimal) {
    return ((decimal * 100) + '%')
  }
  calcTravelProgress (visited, goal) {
    return this.percentToDecimal (visited/goal)
  }
  render() {
    return (
      <div>
        <hr/>

        <div className="grid-full space-bottom text-center">
          <span>{this.props.total} </span>
          <span>total countries </span>
          <Globe className="text-tall" />
        </div>

        <div className="grid-half text-center space-bottom">
          <span>{this.props.visited} </span>
          <span>visited countries </span>
          <Landing className="text-tall" />
        </div>

        <div className="grid-half space-bottom text-center">
          <span>{this.props.liked} </span>
          <span>countries on wishlist </span>
          <Heart className="text-tall" />
        </div>

        <div className="grid-full space-bottom text-center">
          <span>{this.calcTravelProgress (
                    this.props.visited,
                    this.props.goal
                )}
          </span>
          <span> Completion </span>
          <Checked className="text-tall" />
        </div>

        <p className="text-small text-muted">This Data is calculated inside an ES6 Class Component</p>
      </div>
    )
  }
}
```

One thing to point out, is that, written in this ES6 class syntax, we no longer need to wrap our component in parenthesis and the different methods inside the component don't have to be separated by commas anymore. But we can go even one step further and turned it into a Stateless functional component.




### Stateless Functions

Stateless functional component - just as their name implies - are components that are created by a function. They do not have access to state - you cannot use __this__ to access variables. They follow the following structure:

```js
const MyComponent = (props) => (
	<div>{props.title}</div>
)
```

They take in property information from their parent component and return (unrendered) JSX Elements to them. That means, that we also do not have to import react anymore. But local methods - like our calculations - have to be removed from the component and put into their own functions:


```js
import '../assets/sass/kraken.scss'
import '../assets/sass/ui.scss'

const percentToDecimal = (decimal) => {
  return ((decimal * 100) + '%')
}

const calcTravelProgress = (visited, goal) => {
  return percentToDecimal (visited/goal)
}

export const CountriesVisitedStateless = (props) => (

  <div>
    <div className="grid-full space-bottom text-center">
      <span>{props.total} </span>
      <span>total countries</span>
    </div>
    <div className="grid-half text-center space-bottom">
      <span>{props.visited} </span>
      <span>visited countries</span>
    </div>
    <div className="grid-half space-bottom text-center">
      <span>{props.liked} </span>
      <span>countries on wishlist</span>
    </div>
    <div className="grid-full space-bottom text-center">
      <span>{calcTravelProgress (
                props.visited,
                props.goal
            )}
      </span>
      <span> Completion</span>
    </div>
  </div>
)
```

To destructure this a little bit more, we can declaratively state only the object keys that we actually want to use from props - this way we don't have to add the __props.__ in front anymore:

```js
import '../assets/sass/kraken.scss'
import '../assets/sass/ui.scss'

const percentToDecimal = (decimal) => {
  return ((decimal * 100) + '%')
}

const calcTravelProgress = (visited, goal) => {
  return percentToDecimal (visited/goal)
}

export const CountriesVisitedStateless = ({ total, visited, liked, goal }) => (

  <div>
    <hr/>

    <div className="grid-full space-bottom text-center">
      <span>{total} </span>
      <span> total </span>
      <Globe className="text-tall" />
    </div>

    <div className="grid-half text-center space-bottom">
      <span>{visited} </span>
      <span> visited </span>
      <Landing className="text-tall" />
    </div>

    <div className="grid-half space-bottom text-center">
      <span className="text-tall">{liked} </span>
      <span> wishlist </span>
      <Heart className="text-tall" />
    </div>

    <div className="grid-full space-bottom text-center">
      <span>{calcTravelProgress (
                visited,
                goal
            )}
      </span>
      <Checked className="text-tall" /><br/><br/>
    </div>

    <p className="text-small text-muted">This Data is calculated inside a stateless Component</p>

  </div>
)
```