---
title: Node Express Static (IV)
subTitle: Building a product Wiki based on Node.js, Express.js, AMP and Elasticsearch
category: "PM2"
date: 2016-08-17
cover: photo-11627898645_5f0761ff9e_o-cover.png
hero: photo-11627898645_5f0761ff9e_o.png
---


![Angkor Wat, Cambodia](./photo-11627898645_5f0761ff9e_o.png)


## Node/Express Wiki/Knowledgebase
**Bootstrap/Accelerated Mobile Pages**


This code is part of a training in web development with **Node.js** and **Express /Generator**. Goal of this course is to quickly set up a node/express environment to serve static HTML/CSS/JS content.

This App was created in several steps:

<!-- TOC -->

- [Node/Express Wiki/Knowledgebase](#nodeexpress-wikiknowledgebase)
  - [7 Run the app as a service (PM2)](#7-run-the-app-as-a-service-pm2)

<!-- /TOC -->


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

<br/>


[Previous Step](/node-express-static-wiki-part-iii/) / [Next Step](/node-express-static-wiki-part-v/)