---
title: Node Express Static (III)
subTitle: Building a product Wiki based on Node.js, Express.js, AMP and Elasticsearch
date: 2016-08-15
cover: photo-15328454698_e5687fc21d_o-cover.png
hero: photo-15328454698_e5687fc21d_o.png
---


![Mustang, Nepal](./photo-15328454698_e5687fc21d_o.png)


## Node/Express Wiki/Knowledgebase
**Bootstrap/Accelerated Mobile Pages**


This code is part of a training in web development with **Node.js** and **Express /Generator**. Goal of this course is to quickly set up a node/express environment to serve static HTML/CSS/JS content.

This App was created in several steps:

<!-- TOC -->

- [Node/Express Wiki/Knowledgebase](#nodeexpress-wikiknowledgebase)
  - [4 Install NGINX on a CentOS 7 web server](#4-install-nginx-on-a-centos-7-web-server)
  - [5 Install Node.js on a CentOS 7 web server](#5-install-nodejs-on-a-centos-7-web-server)
  - [6 Clone Repo from Git](#6-clone-repo-from-git)

<!-- /TOC -->


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

<br/>


[Previous Step](/node-express-static-wiki-part-ii/) / [Next Step](/node-express-static-wiki-part-iv/)