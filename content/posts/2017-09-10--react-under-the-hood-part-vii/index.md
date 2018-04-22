---
title: React under the Hood (VII)
subTitle: A look behind the curtain of React Starters
category: "React.js"
date: 2017-09-10
cover: photo-34607491985_e91fa7d4bc_o-cover.png
hero: photo-34607491985_e91fa7d4bc_o.png
---


![Tanna Island, Vanuatu](./photo-34607491985_e91fa7d4bc_o.png)


> A look behind the curtain of React Starters like:
> 
> * [create-react-app](https://github.com/facebookincubator/create-react-app)
> * [Gatsby.js](https://github.com/gatsbyjs/gatsby)
> * [Next.js](https://github.com/zeit/next.js)
> * [Neutrino](https://neutrino.js.org)
> 
> React is often said to be easy to learn, but impossible to set up in an dev environment. Once you start reading about it, you will be faced by an exhausting amount of choices that you have to make, before you can move on to actual coding. Starter Packages, like the ones named above, give a quick access to the React world. Let's take a look into that black box now.


[Github](https://github.com/mpolinowski/react-under-the-hood)


<!-- TOC -->

- [07 Working with State](#07-working-with-state)

<!-- /TOC -->


## 07 Working with State

So far we used props to pass down data into our components. The other way to do this is by handling the state of a component. Here - when you are not using state managements like Redux - it is very important that we limit the amount of components that handle our components state. To do this, we want to create another component in _./src/components/app-createClass.js_ called \<App /\>:


```js
import {createClass} from 'react'

import { CountriesVisitedES6 } from './countries-visited-es6'
import { CountryList } from './country-list'

export const App = createClass({

    getInitialState() {
      return {
        countries: [
          {
            country: "Japan",
            date: new Date ("10/19/2010"),
            visited: true,
            liked: true
          },
          {
            country: "Taiwan",
            date: new Date ("12/12/2006"),
            visited: true,
            liked: true
          },
          {
            country: "China",
            date: new Date ("10/20/2010"),
            visited: true,
            liked: true
          }
        ]
      }
    },

    render() {
      return (
        <div className="app">
          <CountryList countries={this.state.countries} />
          <CountriesVisitedES6 total={196}
        												visited={86}
        												liked={186} />
        </div>
      )
    }
})
```

We can remove the CountryList and CountriesVisitedES6 components from _./src/index.js_ amd import App now, as their new parent component. The [countries] array is now made available t our CountryList component by the __getInitialState__ function in \<App /\>.

We can also add a filter function that allows us to filter all countries, that are either _visited_ or _liked_ to


```js
countCountries(filter) {
	return this.state.countries.filter(function(country) {
			if(filter {
				return country[filter]
			} else {
				return country
			}
			})
	}).length
},
```

And again, we can use the the __inline If/Else syntax__ to clean up our _countCountries_ function:

```js
countCountries(filter) {
	return this.state.countries.filter(
		(country) => (filter) ? country[filter] : country
	).length
}
```

This filter takes the countries array, takes all countries and returns them - unless the function call uses a filter string. In this case only the countries are returned that fulfill the filter condition.

The function call and filter condition can then be applied in our render function:

```js
render() {
	return (
		<div className="app">
			<CountryList countries={this.state.countries} />
			<CountriesVisitedES6 total={this.countCountries()}
														visited={this.countCountries("visited")}
														liked={this.countCountries("liked")} />
		</div>
	)
}
```

For _total_ we don't use a filter - we want to display the number of all countries. But for _visited_ and _liked_ we only want to count countries that have the corresponding variable set to true. This way we now managed to get rid of the hard-coded numbers. And instead started to simply count those countries inside the state of our component.


Now lets re-write our App component using ES6 classes in _./src/components/app-es6.js_:


```js
import {Component} from 'react'

import { CountriesVisitedES6 } from './countries-visited-es6'
import { CountryList } from './country-list'

export class App extends Component {

     constructor(props) {
      super(props)
        this.state = {
          countries: [
            {
              country: "Japan",
              date: new Date ("10/19/2010"),
              visited: true,
              liked: true
            },
            {
              country: "Taiwan",
              date: new Date ("12/12/2006"),
              visited: true,
              liked: true
            },
            {
              country: "China",
              date: new Date ("10/20/2010"),
              visited: true,
              liked: true
            },
            {
              country: "Austria",
              date: new Date ("10/20/2010"),
              visited: true,
              liked: false
            }
          ]
        }
      }

      countCountries(filter) {
        return this.state.countries.filter(
          (country) => (filter) ? country[filter] : country
        ).length
      }

      render() {
        return (
          <div className="app">
            <CountryList countries={this.state.countries} />
            <CountriesVisitedES6 total={this.countCountries()}
          												visited={this.countCountries("visited")}
          												liked={this.countCountries("liked")} />
          </div>
        )
      }

  }

```