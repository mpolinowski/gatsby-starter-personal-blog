---
title: Securing Elasticsearch with ReadOnlyREST
subTitle: Elasticsearch doesn't have a basic user authentication - a problem!
category: "Elasticsearch"
date: 2018-01-01
cover: photo-15514459555_50b13064fa_o-cover.png
hero: photo-15514459555_50b13064fa_o.png
---


![Battambang, Cambodia](./photo-15514459555_50b13064fa_o.png)


<!-- TOC -->

- [Securing Elasticsearch with ReadonlyREST](#securing-elasticsearch-with-readonlyrest)
  - [Install Elasticsearch](#install-elasticsearch)
  - [Install Kibana](#install-kibana)
  - [Secure Elasticsearch](#secure-elasticsearch)
  - [Securing Kibana](#securing-kibana)

<!-- /TOC -->


## Securing Elasticsearch with ReadonlyREST

Neither [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) nor [Kibana](https://www.elastic.co/downloads/kibana) offer a user authentication. In earlier [Projects](https://github.com/mpolinowski/express-static) we circumvented this issue by blocking all access - only allowing our Website and Kibana to access the database via localhost.

But now we need an anonymous user account that is only allowed to Request and Read search results - while Writing to the database is forbidden.


Elastic offer their own solution for it called [X-Pack](https://www.elastic.co/downloads/x-pack) (On how to set it up - [read more](https://mpolinowski.github.io/nginx-node-elasticsearch/)) - which is a premium extension to the ELK stack and nobody seems to know how much it would cost to buy it. But as the wise man from the vintage sport car dealership knows - if you have to ask for the prize, you cannot afford it anyway. So are there free solutions out there?


Yes! Searching for alternatives lead me to 2 solutions that are mentioned often - there are more if you keep searching:

1. [ReadOnlyREST](https://github.com/sscarduzio/elasticsearch-readonlyrest-plugin)
2. [SearchGuard](https://github.com/floragunncom/search-guard)


Today we are going to set up the first of them. The first thing I noticed is, that those plugins are written for the exact Version number of Elasticsearch. The newest version of RestOnlyREST supports Elasticsearch Version 6.2.3 - I am using 6.2.4, which unfortunately means that I have to downgrade my ES version.... and since there is no downgrade option with ES, I have to shut off the service and go in manually to delete every folder that ES has generated on my CentOS server (really ? That is the only option that I could find online.. but it is really a mess...).

### Install Elasticsearch

__I. Download and install the public signing key__


```bash
 rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
```


__II. Add the following in your /etc/yum.repos.d/ directory in a file with a .repo suffix, for example elasticsearch.repo__


```yml
[elasticsearch-6.x]
name=Elasticsearch repository for 6.x packages
baseurl=https://artifacts.elastic.co/packages/6.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
```

__III. Install a specific version of Elasticsearch__

ReadOnlyREST requires us to install a specific version (6.2.3) of Elasticsearch. Let's check what versions are available to install (CentOS/yum):


```bash
yum --showduplicates list elasticsearch | expand
Installed Packages
elasticsearch.noarch                 6.2.4-1                  @elasticsearch-6.x
Available Packages
elasticsearch.noarch                 6.0.0-1                  elasticsearch-6.x
elasticsearch.noarch                 6.0.0-1                  kibana-6.x
elasticsearch.noarch                 6.0.1-1                  elasticsearch-6.x
elasticsearch.noarch                 6.0.1-1                  kibana-6.x
elasticsearch.noarch                 6.1.0-1                  elasticsearch-6.x
elasticsearch.noarch                 6.1.0-1                  kibana-6.x
elasticsearch.noarch                 6.1.1-1                  elasticsearch-6.x
elasticsearch.noarch                 6.1.1-1                  kibana-6.x
elasticsearch.noarch                 6.1.2-1                  elasticsearch-6.x
elasticsearch.noarch                 6.1.2-1                  kibana-6.x
elasticsearch.noarch                 6.1.3-1                  elasticsearch-6.x
elasticsearch.noarch                 6.1.3-1                  kibana-6.x
elasticsearch.noarch                 6.1.4-1                  elasticsearch-6.x
elasticsearch.noarch                 6.1.4-1                  kibana-6.x
elasticsearch.noarch                 6.2.0-1                  elasticsearch-6.x
elasticsearch.noarch                 6.2.0-1                  kibana-6.x
elasticsearch.noarch                 6.2.1-1                  elasticsearch-6.x
elasticsearch.noarch                 6.2.1-1                  kibana-6.x
elasticsearch.noarch                 6.2.2-1                  elasticsearch-6.x
elasticsearch.noarch                 6.2.2-1                  kibana-6.x
elasticsearch.noarch                 6.2.3-1                  elasticsearch-6.x
elasticsearch.noarch                 6.2.3-1                  kibana-6.x
elasticsearch.noarch                 6.2.4-1                  elasticsearch-6.x
elasticsearch.noarch                 6.2.4-1                  kibana-6.x
```


To install the version 6.2.3 of elasticsearch type:

```bash
yum install elasticsearch-6.2.3-1
```

Here I ran into issues due to the messy uninstall of the earlier (newer) version of Elasticsearch - __if someone knows a cleaner way to do this, please tell :)__

Yum still had the older version in its DB leading to an "package already installed. Checking for update. Nothing to do" error. This can be fixed by:

```
rpm -e --justdb --nodeps elasticsearch
rpm -e --justdb --nodeps kibana
```

Now re-run the install command above:

```bash
yum install elasticsearch-6.2.3-1
Dependencies Resolved

====================================================================================================
 Package                  Arch              Version              Repository                    Size
====================================================================================================
Installing:
 elasticsearch            noarch            6.2.3-1              elasticsearch-6.x             28 M

Transaction Summary
====================================================================================================
Install  1 Package

Total download size: 28 M
Installed size: 31 M
Is this ok [y/d/N]:y
```


__IV. Restrict access to your Elasticsearch instance__

To configure Elasticsearch open the following file inside your text editor: _/etc/elasticsearch/elasticsearch.yml_. We want to limit access to localhost and a public domain that we are going to configure in NGINX. This can be done with the variable __network.host__:

```yml
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 127.0.0.1, my.domain.com
#
# Set a custom port for HTTP:
#
http.port: 9200
```

The HTTP port 9200 is the default port and should be changed - but we are only going to use it on localhost. NGINX will take care of it on the outside - so we will just leave it at it's default value. The webserver will also add a security layer to our app - which means, we will need to enable [CORS header](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for the transaction. Add the following lines below the Network Block:

```yml
# --------------------------------- CORS ----------------------------------
#
#
#http.cors:
#  enabled: true
#  allow-origin: /https?:\/\/my.domain.com(:[0-9]+)?/
http.cors:
 enabled: true
 allow-origin: /https?:\/\/my.domain.com(:[0-9][0-9][0-9][0-9])?/
```

Both examples above allow Cross-Origin Resource Sharing for your domain on every available port - but for some reasons the first regular expression stopped to work in Elasticsearch 6.2.x. You just need one of them.


__V. Set up the Elasticsearch Service__

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

### Install Kibana

Since we installed a specific version (6.2.3) of Elasticsearch we now need to install the same version of the admin panel Kibana. First Create and edit a new yum repository file for Kibana in _/etc/yum.repos.d/kibana.repo_:

```yml
[kibana-6.x]
name=Kibana repository for 6.x packages
baseurl=https://artifacts.elastic.co/packages/6.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
```

Then install the correct version as listed earlier:

```bash
yum install kibana-6.2.3-1
```

Now set the Elasticsearch Connection URL for Kibana in _/etc/kibana/kibana.yml_:

```yml
elasticsearch.url: "http://localhost:9200"
```


To configure Kibana to start automatically when the system boots up, run the following commands:

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service
```


Kibana can be started and stopped as follows:

```
sudo systemctl start kibana.service
sudo systemctl stop kibana.service
```


### Secure Elasticsearch

Now we can install RestOnlyREST to secure the database. First [download](https://readonlyrest.com/download.html) the correct package for the installed version of Elasticsearch and place it inside the _./tmp_ directory.


First set up the configuration file in _/etc/elasticsearch/readonlyrest.yml_ to allow all access from localhost (required by Kibana) and restrict outside access to specific indices to read only:

```yml
readonlyrest:
    #optional
    response_if_req_forbidden: Sorry, your request is forbidden.
    
    access_control_rules:

    - name: Accept all requests from localhost
      hosts: [127.0.0.1]

    - name: Just certain indices, and read only
      actions: ["indices:data/read/*"]
      indices: ["all_my_public_indices_start_with*"] # index aliases are taken in account!
```

Then install the plugin to the elasticsearch plugin directory:

```bash
cd /usr/share/elasticsearch/bin
./elasticsearch-plugin install file:///tmp/readonlyrest-1.16.18_es6.2.3.zip

-> Downloading file:///tmp/readonlyrest-1.16.18_es6.2.3.zip
[=================================================] 100%  
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* java.io.FilePermission << ALL FILES >> read
* java.lang.RuntimePermission accessDeclaredMembers
* java.lang.RuntimePermission getClassLoader
* java.lang.reflect.ReflectPermission suppressAccessChecks
* java.net.SocketPermission * connect,accept,resolve
* java.security.SecurityPermission getProperty.ssl.KeyManagerFactory.algorithm
* java.util.PropertyPermission * read,write
See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
for descriptions of what these permissions allow and the associated risks.

Continue with installation? [y/N]y
-> Installed readonlyrest
```


### Securing Kibana

Remember to [secure Kibana with NGINX](/nginx-node-security/), since it is not protected by the free version of ReadOnlyREST!