---
title: Node Express Static (I)
subTitle: Building a product Wiki based on Node.js, Express.js, AMP and Elasticsearch
category: "Node.js"
date: 2016-08-11
cover: photo-11626620916_804d27ae54_o-cover.png
hero: photo-11626620916_804d27ae54_o.png
---


![Siem Reap, Cambodia](./photo-11626620916_804d27ae54_o.png)


## Node/Express Wiki/Knowledgebase
**Bootstrap/Accelerated Mobile Pages**


This code is part of a training in web development with **Node.js** and **Express /Generator**. Goal of this course is to quickly set up a node/express environment to serve static HTML/CSS/JS content.

<!-- TOC -->

- [Node/Express Wiki/Knowledgebase](#nodeexpress-wikiknowledgebase)
  - [1 Install Node.js and Express.js to develop our Web Application](#1-install-nodejs-and-expressjs-to-develop-our-web-application)
  - [2 Preparing the Site Structure](#2-preparing-the-site-structure)

<!-- /TOC -->


### 1 Install Node.js and Express.js to develop our Web Application
___

* Install [Node.js](https://nodejs.org/en/download/).
* Install express-generator globally to set up our node/express scaffolding: *npm install -g express-generator*
* Apply the generator with the EJS templating engine (*-e*) and give your app an name (*e.g. express-static*): *express -e express-static*
* Switch to the created express-static folder and install dependencies: *cd express-static && npm install*
* Start the app with: DEBUG=my-application ./bin/www


### 2 Preparing the Site Structure
___

The following folders and files will be created in the **dev** folder. Later [Gulp.js](#4-install-and-configure-gulpjs) will be used to create a distilled version ready for deployment in the **build** folder.

* Add *partials/content* to the *views* folder
* Add *partials/template* to views and add *head.ejs*, *header.ejs*, *footer.ejs* and *jsdefaults.ejs*
* Copy content from the *head* section of your web site (*index.ejs*) to *head.ejs*
* Reference the *head.ejs* file inside the *head* section of index.ejs: *<% include partials/template/head.ejs %>*
* Add *<script src="/javascrip/scrip.js"></script>* to *jsdefaults.ejs* and reference it in *index.ejs* at the end of body: *<% include partials/template/jsdefaults.ejs %>*
* Copy all JS script tags to *jsdefaults.ejs*
* Copy content from the *footer* section of your web site (*index.ejs*) to *footer.ejs*
* Reference the *footer.ejs* file inside the *footer* section of index.ejs: *<% include partials/template/footer.ejs %>*
* Repeat with other partials that you might want to reuse on other pages!
* Copy all your websites (EJS files) pages into the content folder

<br/>

__Now lets try to build this:__


![INSTAR Wiki Knowledgebase](./node-express-static_01.png)

<br/>

[Next Step](/node-express-static-wiki-part-i/)