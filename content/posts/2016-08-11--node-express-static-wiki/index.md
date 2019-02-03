---
title: Node Express Static
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
  - [3 Install and Configure Gulp.js](#3-install-and-configure-gulpjs)
  - [4 Install NGINX on a CentOS 7 web server](#4-install-nginx-on-a-centos-7-web-server)
  - [5 Install Node.js on a CentOS 7 web server](#5-install-nodejs-on-a-centos-7-web-server)
  - [6 Clone Repo from Git](#6-clone-repo-from-git)
  - [7 Run the app as a service (PM2)](#7-run-the-app-as-a-service-pm2)
  - [8 Install Java](#8-install-java)
    - [Public Signing Key](#public-signing-key)
    - [Install Java 8](#install-java-8)
  - [9 Install Elasticsearch](#9-install-elasticsearch)
    - [Public Signing Key](#public-signing-key-1)
    - [Install Elasticsearch](#install-elasticsearch)
    - [Access-Control-Allow-Origin](#access-control-allow-origin)
    - [Set-up Elasticsearch Service](#set-up-elasticsearch-service)
  - [10 Install Kibana](#10-install-kibana)
    - [Create and edit a new yum repository file for Kibana](#create-and-edit-a-new-yum-repository-file-for-kibana)
    - [Install Kibana with this command:](#install-kibana-with-this-command)
    - [Set Elasticsearch Connection URL](#set-elasticsearch-connection-url)
    - [Install Kibana Service](#install-kibana-service)
    - [Secure Kibana with NGINX](#secure-kibana-with-nginx)
    - [Securing Kibana in a Nginx server block](#securing-kibana-in-a-nginx-server-block)
    - [Install Sense](#install-sense)

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


### 4 Install NGINX on a CentOS 7 web server
___

* **Step One** — Add Nginx Repository

Step One—Add Nginx Repository
To add the CentOS 7 EPEL repository, open terminal and use the following command:
```
 sudo yum install epel-release
```

* **Step Two** — Install Nginx

Now that the Nginx repository is installed on your server, install Nginx using the following yum command:
```
 sudo yum install nginx
```

* **Step Three** — Start Nginx

Nginx does not start on its own. To get Nginx running, type:
```
 sudo systemctl start nginx
```
Test:
```
http://server_domain_name_or_IP/
```

* **Step Four** — Nginx as a Service

To enable Nginx to start when your system boots, enter the following command:
```
 sudo systemctl enable nginx
```

Always test your config after changes:
```
nginx -t
```

And try to reload instead of restarting - reload will fail but old config keeps running in case of error
```
service nginx reload
```

To restart the Nginx service, enter the following command:
```
 service nginx restart
```


### 5 Install Node.js on a CentOS 7 web server
___

* **Step One** — Download the Node.js Source

Choose your version and download the source:
```
 curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
```

* **Step Two** — Install Node.js

Then install, as root:
```
 sudo yum -y install nodejs
```
```
 sudo yum install -y gcc-c++ make
```


### 6 Clone Repo from Git
___

* **Step One** — Install Git

After this line you will have Git installed on your CentOS server:
```
 sudo yum install -y git
```

Putting your Git code on your server:
```
 cd /opt/
 sudo mkdir apps
 sudo chown your_app_user_name app
 git clone https://github.com/INSTAR-Deutschland/express-static.git apps
 cd apps
 npm install
```

Update an existing repo by cd into directory and:
```
 git pull origin master
```


### 7 Run the app as a service (PM2)
___

* **Step One** — Demonization

Now we will install PM2, which is a process manager for Node.js applications. PM2 provides an easy way to manage and daemonize applications (run them as a service).

We will use Node Packaged Modules (NPM), which is basically a package manager for Node modules that installs with Node.js, to install PM2 on our app server. Use this command to install PM2:
```
 sudo npm install pm2@latest -g
```

To update PM2 to the latest version and update version in memory
```
 sudo npm install pm2@latest -g

 pm2 update
```

* **Step Two** — Manage Application with PM2

The first thing you will want to do is use the pm2 start command to run your application, app.js, in the background. With node Node apps the entry point is the app.js (or index.js). In case you used Express-Generator to do your app scaffolding, use the www file in the /bin directory instead :

```
 pm2 start app.js
```

This also adds your application to PM2's process list, which is outputted every time you start an application:

| App name        | id           | mode  | pid  | status  | restart  | uptime  | mem  | watching  |
| ------------- |:-------------:| :-----:| :-----:| :-----:| :-----:| :-----:| :-----:| -----:|
| app      | 0 | fork | 9495 | online | 0 | 0s | 36.4 MB | disabled |

Repeat for all your node apps and save:

```
 pm2 save
```

Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot). Luckily, PM2 provides an easy way to do this, the startup subcommand.

Once you started all apps, type the following to make sure that they restart after a server restart. You must also specify the init system you are running on, which is centos, in our case:
```
 pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd]
```

The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots. We won´t specify our OS and let pm2 decide what to do:
```
 sudo pm2 startup
```

Bring back previously saved processes (via pm2 save):
```
 pm2 save
```

Disabling startup system
```
pm2 resurrect
```

Disabling startup system
```
pm2 unstartup
```

* **Step Three** — Other PM2 Commands (Optional)

Stop an application with this command (specify the PM2 App name or id):
```
 sudo pm2 stop app
```

Restart an application with this command (specify the PM2 App name or id):
```
 sudo pm2 restart app
```

Will 0s downtime reload (for NETWORKED apps):
```
 sudo pm2 reload all
```

Will remove process 0 from pm2 list:
```
 pm2 delete 0
```

The list of applications currently managed by PM2 can also be looked up with the list subcommand:
```
 pm2 list
```

More information about a specific application can be found by using the info subcommand (specify the PM2 App name or id):
```
 pm2 info app
```

The PM2 process monitor can be pulled up with the monit subcommand. This displays the application status, CPU, and memory usage:
```
 pm2 monit
```


### 8 Install Java
___

#### Public Signing Key

Download the Oracle Java 8:

```
 cd ~
 wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u73-b02/jdk-8u73-linux-x64.rpm"
```

#### Install Java 8

```
sudo yum -y localinstall jdk-8u73-linux-x64.rpm
```

Now Java should be installed at /usr/java/jdk1.8.0_73/jre/bin/java, and linked from /usr/bin/java. u may delete the archive file that you downloaded earlier:

```
rm ~/jdk-8u*-linux-x64.rpm
```

### 9 Install Elasticsearch


#### Public Signing Key

Download and install the public signing key:

```
 rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
```


Add the following in your /etc/yum.repos.d/ directory in a file with a .repo suffix, for example elasticsearch.repo

```
[elasticsearch-5.x]
name=Elasticsearch repository for 5.x packages
baseurl=https://artifacts.elastic.co/packages/5.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
```


#### Install Elasticsearch

```
sudo yum install elasticsearch
```

#### Access-Control-Allow-Origin

Restrict outside access to your Elasticsearch instance (port 9200)


```
sudo vi /etc/elasticsearch/elasticsearch.yml

-> network.host: localhost
```

To get rid of the following Error:

```
Failed to load http://localhost:9200/: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8000' is therefore not allowed access.
```

Add the following line to elasticsearch.yml

```
http.cors:
  enabled: true
  allow-origin: /https?:\/\/localhost(:[0-9]+)?/
```

#### Set-up Elasticsearch Service

To configure Elasticsearch to start automatically when the system boots up, run the following commands:


```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

Elasticsearch can be started and stopped as follows:

```
sudo systemctl start elasticsearch.service
sudo systemctl stop elasticsearch.service
```


| Type | Description | Location RHEL/CentOS |
| ------------- |:-------------:| -----:|
| home | Home of elasticsearch installation. | /usr/share/elasticsearch |
| bin | Binary scripts including elasticsearch to start a node. | /usr/share/elasticsearch/bin |
| conf | Configuration files elasticsearch.yml and logging.yml. | /etc/elasticsearch |
| conf | Environment variables including heap size, file descriptors. | /etc/sysconfig/elasticsearch |
| data | The location of the data files of each index / shard allocated on the node. | /var/lib/elasticsearch |
| logs | Log files location | /var/log/elasticsearch |
| plugins | Plugin files location. Each plugin will be contained in a subdirectory. | /usr/share/elasticsearch/plugins |
| repo | Shared file system repository locations. | Not configured |
| script | Location of script files. | /etc/elasticsearch/scripts |


### 10 Install Kibana
___


#### Create and edit a new yum repository file for Kibana

```
 sudo vi /etc/yum.repos.d/kibana.repo
```

Add the following repository configuration:

```
[kibana-5.x]
name=Kibana repository for 5.x packages
baseurl=https://artifacts.elastic.co/packages/5.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
```

#### Install Kibana with this command:

```
sudo yum install kibana
```

#### Set Elasticsearch Connection URL

```
sudo vi /opt/kibana/config/kibana.yml

-> elasticsearch.url: "http://localhost:9200"
```

#### Install Kibana Service

To configure Kibana to start automatically when the system boots up, run the following commands:


```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service
```


Kibana can be started and stopped as follows:

```
sudo systemctl start kibana.service
sudo systemctl stop kibana.service
```


#### Secure Kibana with NGINX

Use NGINX to securely access Kibana and use htpasswd to create an admin user:


```
sudo yum -y install httpd-tools
sudo htpasswd -c /etc/nginx/htpasswd.users admin
```


Add your password.

#### Securing Kibana in a Nginx server block

```
sudo vi /etc/nginx/nginx.conf
```

Find the default server block (starts with server {), the last configuration block in the file, and delete it. When you are done, the last two lines in the file should look like this:

```
include /etc/nginx/conf.d/*.conf;
}
```

Now we will create an Nginx server block in a new file:

```
sudo vi /etc/nginx/conf.d/kibana.conf
```

Paste the following code block into the file. Be sure to update the server_name to match your server's name:

```
server {
    listen 80;

    server_name example.com;

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/htpasswd.users;

    location / {
        proxy_pass http://localhost:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;        
    }
}
```

Now start and enable Nginx to put our changes into effect:

```
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install Sense

Once Kibana is installed, you can install Sense running the following command from your /opt/kibana folder:


```
./bin/kibana plugin --install elastic/sense
```


You will now need to start Kibana:

```
./bin/kibana
```


The apps are now available via:

```
http://localhost:5601/app/kibana
http://localhost:5601/app/sense
```

Use Sense to feed Elasticsearch with mappings/postings (see wiki-data.json)