---
title: React under the Hood (Part II)
subTitle: A look behind the curtain of React Starters
category: "Babel"
date: 2016-09-04
cover: photo-34443677922_8f09e47dd3_o-cover.png
hero: photo-34443677922_8f09e47dd3_o.png
---


![Harbin, China](./photo-34443677922_8f09e47dd3_o.png)


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
02. [JSX and Babel](#02-jsx-and-babel)
	* Transpilation
03. [Webpack](/react-under-the-hood-part-iii/)
	* Loading JSON
	* Adding SASS
04. [React Components](/react-under-the-hood-part-iv/)
	* ES6 Class Syntax
	* Stateless Functions
05. [Adding React-Icons](/react-under-the-hood-part-v/)
06. [Working with Props](/react-under-the-hood-part-vi/)
	* Default Props
	* PropType Validation
07. [Working with State](/react-under-the-hood-part-vii/)




## 02 JSX and Babel

React offers a way to write our mark-up directly inside the Javascript component - called JSX. The title component written in JSX looks like this:

```js
render(
	<h1 id = 'title'
			className = 'header'
			style = {style}>
		Hello World
	</h1>,
	document.getElementById('react-container')
)
```

Since our webbrowser don't understand JSX, we will have to transpile it to pure Javascript using Babel - this can be quickly done with the babel-cli transpiler. Let us first initialize our node project by _npm init -y_ then install the babel-cli both globally as well as a development dependency inside our project:




### Transpilation

```bash
npm install -g babel-cli

npm install --save-dev babel-cli
```

now create a folder called src inside the root dir and move the index.js file into it - since we want to use Babel to transpile all JSX files from the source directory and copy them to the distribution directory, where they can be picked up and served by our webserver.

Now we need to configure Babel to transpile JSX and all latest and proposed versions of ECMA Script, by adding a file .babelrc inside the root director:

```json
{
  'presets': ['latest', 'react', 'stage-0']
}
```

Now we need to install those presets as dev-dependencies __be advised__: _we later throw out babel-preset-latest babel-preset-stage-0 and replace it with [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) to work with webpack 3!_ :

```bash
npm install --save-dev babel-preset-react babel-preset-latest babel-preset-stage-0
```

We can now use the cli tool to transpile our JSX source file and create the browser-readable bundle.js file from it:

```bash
babel ./src/index.js --out-file ./dist/bundle.js
```

Now open index.html inside the /dist directory and change the index.js to bundle.js. Reloading our webserver will now show our app again. To make our life easier we will add the httpster call as our npm start script inside the package.json file - then start your webserver with _npm start_

```json
"scripts": {
  "start": "httpster -p 3000 -d ./dist"
}
```


We are now able to write our React code in JSX as well as to use ES2015 or ES2017 syntax inside our source files. Babel will transpile them into browser-friendly code inside /dist/bundle.js. But now we don't want to do this by hand, every time we made a small edit on our page - we need an automation solution for this process.