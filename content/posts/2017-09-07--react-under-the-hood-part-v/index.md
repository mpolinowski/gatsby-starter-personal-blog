---
title: React under the Hood (Part V)
subTitle: A look behind the curtain of React Starters
category: "React.js"
date: 2017-09-07
cover: photo-34475542491_9069464269_o-cover.jpg
hero: photo-34475542491_9069464269_o.jpg
---


![Shenzhen, China](./photo-34475542491_9069464269_o.jpg)


> A look behind the curtain of React Starters like:
> 
> * [create-react-app](https://github.com/facebookincubator/create-react-app)
> * [Gatsby.js](https://github.com/gatsbyjs/gatsby)
> * [Next.js](https://github.com/zeit/next.js)
> * [Neutrino](https://neutrino.js.org)
> 
> React is often said to be easy to learn, but impossible to set up in an dev environment. Once you start reading about it, you will be faced by an exhausting amount of choices that you have to make, before you can move on to actual coding. Starter Packages, like the ones named above, give a quick access to the React world. Let's take a look into that black box now.


[Github](https://github.com/mpolinowski/react-under-the-hood)



### Table of Content

01. [Pure React](/react-under-the-hood-part-i/)
02. [JSX and Babel](/react-under-the-hood-part-ii/)
	* Transpilation
03. [Webpack](/react-under-the-hood-part-iii/)
	* Loading JSON
	* Adding SASS
04. [React Components](/react-under-the-hood-part-iv/)
	* ES6 Class Syntax
	* Stateless Functions
05. [Adding React-Icons](#05-adding-react-icons)
06. [Working with Props](/react-under-the-hood-part-vi/)
	* Default Props
	* PropType Validation
07. [Working with State](/react-under-the-hood-part-vii/)



## 05 Adding React Icons

The [React-Icons](http://gorangajic.github.io/react-icons/) module allows you to include popular icons in your React projects. The module can be [installed by npm](https://www.npmjs.com/package/react-icons)

React-Icons can be imported to our component:

```js
import Globe from 'react-icons/lib/go/globe'
import Landing from 'react-icons/lib/md/flight-land'
import Heart from 'react-icons/lib/go/heart'
import Checked from 'react-icons/lib/ti/input-checked'
```

And simply be added to as a child component:

```js
<Globe />
<Landing />
<Heart />
<Checked />
```