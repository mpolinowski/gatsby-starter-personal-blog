---
title: Node Express Static (II)
subTitle: Building a product Wiki based on Node.js, Express.js, AMP and Elasticsearch
category: "Gulp.js"
date: 2016-08-12
cover: photo-11628186083_7be6d858ce_o-cover.png
hero: photo-11628186083_7be6d858ce_o.png
---


![Siem Reap, Cambodia](./photo-11628186083_7be6d858ce_o.png)


## Node/Express Wiki/Knowledgebase
**Bootstrap/Accelerated Mobile Pages**


This code is part of a training in web development with **Node.js** and **Express /Generator**. Goal of this course is to quickly set up a node/express environment to serve static HTML/CSS/JS content.

This App was created in several steps:

<!-- TOC -->

- [Node/Express Wiki/Knowledgebase](#nodeexpress-wikiknowledgebase)
  - [3 Install and Configure Gulp.js](#3-install-and-configure-gulpjs)
  - [4 Install NGINX on a CentOS 7 web server](#4-install-nginx-on-a-centos-7-web-server)
  - [5 Install Node.js on a CentOS 7 web server](#5-install-nodejs-on-a-centos-7-web-server)
  - [6 Clone Repo from Git](#6-clone-repo-from-git)
  - [7 Run the app as a service (PM2)](#7-run-the-app-as-a-service-pm2)
  - [8 Install Java](#8-install-java)
  - [9 Install Elasticsearch](#9-install-elasticsearch)
  - [10 Install Kibana](#10-install-kibana)

<!-- /TOC -->


### 3 Install and Configure Gulp.js
___

* **Step One** — Install [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) globally:

```
npm install --global gulp-cli
```

* **Step Two** — Install [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0) into your Project - cd to project directory and:

```
npm install --save-dev gulpjs/gulp#4.0
```

* **Step Three** — Create a gulpfile.babel.js at the root of your project:

Node already supports a lot of ES2015, to avoid compatibility problem we suggest to install Babel and rename your gulpfile.js as gulpfile.babel.js.

```
npm install --save-dev babel-register babel-preset-es2015
```

Then create a .babelrc file with the preset configuration.

```
{
  "presets": [ "es2015" ]
}
```

Now install all Gulp dependencies that you want to use

```
npm install --save-dev gulp-babel gulp-uglify gulp-rename gulp-clean-css gulp-htmlclean gulp-newer gulp-imagemin del
```

Now write the gulpfile.babel.js and import all gulp dependencies...

```javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import cleanHTML from 'gulp-htmlclean';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import del from 'del';
```

... and write your Gulp Tasks.

* **Step Four** — Define your source and destination directories:

```javascript
const paths = {
  views: {
    src: 'dev/views/**/*.ejs',
    dest: 'build/views/',
  },
  images: {
    src: 'dev/public/images/**/*.{jpg,jpeg,png}',
    dest: 'build/public/images/',
  },
  styles: {
    src: 'dev/public/stylesheets/**/*.css',
    dest: 'build/public/stylesheets/',
  },
  scripts: {
    src: 'dev/public/javascripts/**/*.js',
    dest: 'build/public/javascripts/',
  },
};
```

* **Step Five** — Add a Gulp Task [using imagemin](https://www.npmjs.com/package/gulp-imagemin) to compress your images:

```javascript
export function images() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    // Pass through newer files only
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}
```

Run the task with:

```
gulp images
```

to compress all images in ./dev/public/images and save them in ./build/public/images.

* **Step Six** — Add a Gulp Task to minify CSS, EJS/HTML and JS:

Now we have to create minify jobs for each file type - (add more tasks if needed):

```javascript
// Minify EJS files
export function views() {
  return gulp.src(paths.views.src)
    .pipe(newer(paths.views.dest))
    // Pass through newer files only
    .pipe(cleanHTML())
    .pipe(gulp.dest(paths.views.dest));
}

// Minify CSS files
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(newer(paths.styles.dest))
    // Pass through newer files only
    .pipe(cleanCSS())
    // Pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min',
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

// Minify JS files
export function scripts() {
  return gulp.src(paths.routes.src, { sourcemaps: true })
    .pipe(newer(paths.routes.dest))
    // Pass through newer files only
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.routes.dest));
}

// Minify routes
gulp.task('routes', function() {
  return gulp.src(routes.in)
    .pipe(newer(routes.out))
    .pipe(uglify())
    .pipe(gulp.dest(routes.out))
});
```

All those tasks can be triggered individually - e.g.:

```
gulp views
```

But to make it more convenient, we will create a combined task - that will also watch for changes:

```javascript
export function watch() {
  gulp.watch(paths.views.src, views);
  gulp.watch(paths.images.src, images);
}
```

You can create a build task to create a fresh build:

```javascript
Const build = gulp.series(clean, gulp.parallel(views, images, styles, scripts));
export { build };
```

```
gulp build
```

This task will grab all files from the dev folder, minify/compress them and save them in the build folder.

<br/>


[Previous Step](/node-express-static-wiki-part-i/) / [Next Step](/node-express-static-wiki-part-iii/)