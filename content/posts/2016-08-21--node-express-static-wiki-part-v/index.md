---
title: Node Express Static (V)
subTitle: Building a product Wiki based on Node.js, Express.js, AMP and Elasticsearch
category: "Elasticsearch"
date: 2016-08-21
cover: photo-15491736416_6abd8de751_o-cover.png
hero: photo-15491736416_6abd8de751_o.png
---


![Pohkara, Nepal](./photo-15491736416_6abd8de751_o.png)


## Node/Express Wiki/Knowledgebase
**Bootstrap/Accelerated Mobile Pages**


This code is part of a training in web development with **Node.js** and **Express /Generator**. Goal of this course is to quickly set up a node/express environment to serve static HTML/CSS/JS content.

This App was created in several steps:

<!-- TOC -->

- [Node/Express Wiki/Knowledgebase](#nodeexpress-wikiknowledgebase)
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

<br/>


[Previous Step](/node-express-static-wiki-part-iv/)