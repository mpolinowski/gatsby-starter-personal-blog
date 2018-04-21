---
title: NGINX, Node.js & Security
subTitle: Using NGINX as an SSL proxy for your Node.js apps
category: "NGINX"
date: 2016-12-24
cover: photo-34139903180_fd0c397abc_o-cover.png
hero: photo-34139903180_fd0c397abc_o.png
---


![Sydney, Australia](./photo-34139903180_fd0c397abc_o.png)


# Using NGINX as proxy for your nodejs apps
**We want to set up NGINX with http/2 to serve multiple node apps and an instance of Elasticsearch on a single centOS server**

<!-- TOC -->

- [Using NGINX as proxy for your nodejs apps](#using-nginx-as-proxy-for-your-nodejs-apps)
  - [1 Useful links](#1-useful-links)
  - [2 Install Nginx and Adjust the Firewall](#2-install-nginx-and-adjust-the-firewall)
  - [3 FirewallD](#3-firewalld)
  - [4 Create a login](#4-create-a-login)
  - [5 nginx.conf](#5-nginxconf)
  - [6 virtual.conf](#6-virtualconf)
  - [7 GoDaddy Certs](#7-godaddy-certs)
    - [Generate a CSR and Private Key](#generate-a-csr-and-private-key)
    - [Download your key from GoDaddy](#download-your-key-from-godaddy)
    - [Install Certificate On Web Server](#install-certificate-on-web-server)
  - [8 LetsEncrypt and Certbot](#8-letsencrypt-and-certbot)
    - [Install Certbot on CentOS 7](#install-certbot-on-centos-7)
    - [Run Certbot](#run-certbot)
    - [Setting Up Auto Renewal](#setting-up-auto-renewal)
      - [Systemd](#systemd)
      - [Cron.d](#crond)
    - [TLS-SNI-01 challenge Deactivated](#tls-sni-01-challenge-deactivated)

<!-- /TOC -->


## 1 Useful links
___

* [Apache2-Utils](https://kyup.com/tutorials/set-http-authentication-nginx/)
* [SSL Labs](https://www.ssllabs.com/ssltest/)
* [Set up NGINX with http/2](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-with-http-2-support-on-ubuntu-16-04)
* [Create a self-signed Certificate](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-centos-7/)
* [How To Secure Nginx with Let's Encrypt on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-centos-7)
* [Installing Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)
* [Installing Kibana](https://www.elastic.co/guide/en/kibana/current/install.html)
* [Installing X-Pack](https://www.elastic.co/downloads/x-pack)



## 2 Install Nginx and Adjust the Firewall
___

* **Step One** — Nginx is not available in CentOS's default repositories - but we can install it from the EPEL (extra packages for Enterprise Linux) repository.

```
 sudo yum install epel-release
```

* **Step Two** — Next, we can install Nginx.

```
 sudo yum install nginx
```

* **Step Three** — Start the Nginx service and test it inside your browser http://server_domain_name_or_IP/

```
 sudo systemctl start nginx
```

* **Step Four** — Check that the service is up and running by typing:

```
 systemctl status nginx
```

* **Step Five** — You will also want to enable Nginx, so it starts when your server boots:

```
 sudo systemctl enable nginx
```


## 3 FirewallD
___

* **Step One** — Installation

Open ports 80 and 443 in [FirewallD](http://www.firewalld.org/)

To start the service and enable FirewallD on boot:

```
sudo systemctl start firewalld
sudo systemctl enable firewalld
```

To stop and disable it:

```
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

Check the firewall status. The output should say either running or not running:

```
sudo firewall-cmd --state
```

To view the status of the FirewallD daemon:

```
sudo systemctl status firewalld
```

To reload a FirewallD configuration:

```
sudo firewall-cmd --reload
```

* **Step Two** — Configuration

Add the http/s rule to the permanent set and reload FirewallD.

```
sudo firewall-cmd --zone=public --add-service=https --permanent
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --reload
```

Allow traffic / block traffic over ports:

```
sudo firewall-cmd --zone=public --add-port=12345/tcp --permanent
sudo firewall-cmd --zone=public --remove-port=12345/tcp --permanent
```

Verify open ports:

```
firewall-cmd --list-ports
```

Check the firewall status:

```
sudo firewall-cmd --state
```

To view the status of the FirewallD daemon:

```
sudo systemctl status firewalld
```

To reload a FirewallD configuration:

```
sudo firewall-cmd --reload
```




## 4 Create a login
___

```
sudo htpasswd -c /etc/nginx/.htpasswd USERNAME
New password: xxxxxxxxx
Re-type new password: xxxxxxxxx
```


## 5 nginx.conf

/etc/nginx/nginx.conf

```nginx
user nginx;
worker_processes 8;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
	gzip on;
	gzip_vary on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_buffers 16 8k;
	gzip_http_version 1.1;
	gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
	# include /etc/nginx/sites-enabled/*;

	# Hide nginx version token
	server_tokens off;

	# Configure buffer sizes
	client_body_buffer_size 16k;
	client_header_buffer_size 1k;
	client_max_body_size 8m;
	large_client_header_buffers 4 8k;

}
```


## 6 virtual.conf

/etc/nginx/conf.d/virtual.conf

Set up virtual server instances for our 2 node/express apps, Elasticsearch and Kibana

```nginx
# redirect http/80 traffic to https/443 for our node apps
server {
       listen         80;
       listen    [::]:80;
       server_name    example.de example2.de;
       return         301 https://$server_name$request_uri;
}

# point to our first node app that is running on port 8888 and accept calls over https://example.de:443
upstream myApp_en {
	# point to the running node
	server 127.0.0.1:8888;
}

server {
	# users using this port and domain will be directed to the node app defined above
	# listen 80 default_server;
	# listen [::]:80 default_server ipv6only=on;
	listen 443 ssl http2 default_server;
	listen [::]:443 ssl http2 default_server;
	# If you want to run more then one node app, they either have to be assigned different web domains (server_name) or ports!
	server_name example.de;

	# Adding the SSL Certificates
    ssl_prefer_server_ciphers on;
	ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
	ssl_dhparam /etc/nginx/ssl/dhparam.pem;
	ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
	ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;

	# set the default public directory for your node
	root /opt/myApp_en/build/public;

	# Optimizing Nginx for Best Performance
	ssl_session_cache shared:SSL:5m;
    ssl_session_timeout 1h;

	location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	proxy_set_header Host $http_host;
    	proxy_set_header X-NginX-Proxy true;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    	proxy_max_temp_file_size 0;
		proxy_pass http://myApp_en;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
		# Authentication can be activated during development
		# auth_basic "Username and Password are required";
		# the user login has to be generated
		# auth_basic_user_file /etc/nginx/.htpasswd;
	}

	# use NGINX to cache static resources that are requested regularly
	location ~* \.(css|js|jpg|png|ico)$ {
		expires 168h;
	}
}


# point to our second node app that is running on port 8484 and accept calls over https://example2.de:443
upstream myApp_de {
	# point to the second running node
	server 127.0.0.1:8484;
}

server {
	# users using this port and domain will be directed to the second node app
	# listen 80;
	# listen [::]:8080 ipv6only=on;
	listen 443 ssl http2;
	# The IPv6 address is unique - only one app can use the default port 443!
	listen [::]:444 ssl http2;
	server_name example2.de;

	# adding the SSL Certificates
    ssl_prefer_server_ciphers on;
	ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
	ssl_dhparam /etc/nginx/ssl/dhparam.pem;
	ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
	ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;

	# set the default public directory for your second node
	root /opt/myApp_de/build/public;

	# optimizing Nginx for Best Performance
	ssl_session_cache shared:SSL:5m;
    ssl_session_timeout 1h;

	location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	proxy_set_header Host $http_host;
    	proxy_set_header X-NginX-Proxy true;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    	proxy_max_temp_file_size 0;
		proxy_pass http://myApp_de;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
		# auth_basic "Username and Password are required";
		# auth_basic_user_file /etc/nginx/.htpasswd;
	}

	# use NGINX to cache static resources that are requested regularly
	location ~* \.(css|js|jpg|png|ico)$ {
		expires 168h;
	}
}


# point to our Elasticsearch database that is running on port 9200 and accept calls over 8080
upstream elasticsearch {
	# point to the second running node
	server 127.0.0.1:9200;
}

server {
	# users using this port will be directed to Elasticsearch
	listen 8080;
	listen [::]:8080 ipv6only=on;
	server_name SERVER_IP_ADDRESS;

	location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	proxy_set_header Host $http_host;
    	proxy_set_header X-NginX-Proxy true;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    	proxy_max_temp_file_size 0;
		proxy_pass http://elasticsearch;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
		auth_basic "Username and Password are required";
		auth_basic_user_file /etc/nginx/.htpasswd;
	}

}

# point to our Kibana instance that is running on port 5601 and accept calls over 8181
server {
	# users using this port and will be directed to Elasticsearch/Kibana
	listen 8181;
	listen [::]:8181 ipv6only=on;

	server_name SERVER_IP_ADDRESS;

	auth_basic "Restricted Access";
	auth_basic_user_file /etc/nginx/.htpasswd;

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


## 7 GoDaddy Certs

When you ordered a wildcard certificate from goDaddy you will receive two files: Your SSL Certificate with a random name (Ex. 93rfs8dhf834hts.crt) and the GoDaddy intermediate certificate bundle (gd_bundle-g2-g1.crt). Lets install them on our server.


### Generate a CSR and Private Key

Create a folder to put all our ssl certificates:

```
mkdir /etc/nginx/ssl
cd /etc/nginx/ssl
```

Generate our private key, called example.com.key, and a CSR, called example.com.csr:

```
openssl req -newkey rsa:2048 -nodes -keyout example.com.key -out example.com.csr
```

At this point, you will be prompted for several lines of information that will be included in your certificate request. The most important part is the Common Name field which should match the name that you want to use your certificate with — for example, example.com, www.example.com, or (for a wildcard certificate request) [STAR].example.com.


### Download your key from GoDaddy

The files you receive will look something like this:

- 93rfs8dhf834hts.crt
- gd_bundle-g2-g1.crt

Upload both to /etc/nginx/ssl directory and rename the first one to your domain name example.com.cst


### Install Certificate On Web Server

You can use the following command to create a combined file from both GoDaddy files called example.com.chained.crt:

```
cat example.com.crt gd_bundle-g2-g1.crt > example.com.chained.crt
```

And now you should change the access permission to this folder:

```
cd /etc/nginx
sudo chmod -R 600 ssl/
```

To complete the configuration you have to make sure your NGINX config points to the right cert file and to the private key you generated earlier. Add the following lines inside the server block of your NGINX config:

```nginx
# adding the SSL Certificates
  ssl_prefer_server_ciphers on;
  ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
	ssl_certificate /etc/nginx/ssl/example.com.chained.crt;
	ssl_certificate_key /etc/nginx/ssl/example.com.key;
```

Always test your configuration first:

```
nginx -t
```

and then reload:

```
service nginx reload
```


## 8 LetsEncrypt and Certbot

### Install Certbot on CentOS 7

**yum install certbot-nginx**

```
Dependencies Resolved

==============================================================================================
 Package                         Arch             Version                Repository      Size
==============================================================================================
Installing:
 python2-certbot-nginx           noarch           0.14.1-1.el7           epel            52 k
Installing for dependencies:
 pyparsing                       noarch           1.5.6-9.el7            base            94 k

Transaction Summary
==============================================================================================
Install  1 Package (+1 Dependent package)

Complete!
```

### Run Certbot

**certbot --nginx -d wiki.instar.fr**

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel):
```

**myemail@email.com**
```
-------------------------------------------------------------------------------
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf. You must agree
in order to register with the ACME server at
https://acme-v01.api.letsencrypt.org/directory
-------------------------------------------------------------------------------
```

**(A)gree/(C)ancel: A**

```
Starting new HTTPS connection (1): supporters.eff.org
Obtaining a new certificate
Performing the following challenges:
tls-sni-01 challenge for wiki.instar.fr
Waiting for verification...
Cleaning up challenges
Deployed Certificate to VirtualHost /etc/nginx/conf.d/virtual.conf for set(['wiki.instar.fr'])

Please choose whether HTTPS access is required or optional.
-------------------------------------------------------------------------------
1: Easy - Allow both HTTP and HTTPS access to these sites
2: Secure - Make all requests redirect to secure HTTPS access
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
The appropriate server block is already redirecting traffic. To enable redirect anyway, uncomment the redirect lines in /etc/nginx/conf.d/virtual.conf.
-------------------------------------------------------------------------------
Congratulations! You have successfully enabled https://wiki.instar.fr
-------------------------------------------------------------------------------
```

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/wiki.instar.fr/fullchain.pem. Your cert will
   expire on 2017-12-13. To obtain a new or tweaked version of this
   certificate in the future, simply run certbot again with the
   "certonly" option. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
```

### Setting Up Auto Renewal


#### Systemd

Go to _/etc/systemd/system/_ and create the following two files

_certbot-nginx.service_
```
[Unit]
Description=Renew Certbot certificates (nginx)
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot-2 renew --deploy-hook "systemctl reload nginx"
```

_certbot-nginx.timer_
```
[Unit]
Description=Renew Certbot certificate (nginx)

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=86400

[Install]
WantedBy=multi-user.target
```

Now activate the service

```
$ systemctl daemon-reload
$ systemctl start certbot-nginx.service  # to run manually
$ systemctl enable --now certbot-nginx.timer  # to use the timer
```


#### Cron.d

Add Certbot renewal to Cron.d in /etc/cron.d - we want to run it twice daily at 13:22 and 04:17:

```
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed

17 4 * * * /usr/bin/certbot-2 renew --quiet
22 13 * * * /usr/bin/certbot-2 renew --quiet
```

### TLS-SNI-01 challenge Deactivated

If you are receiving the following error when trying to add a certificate to your domain:

```
Client with the currently selected authenticator does not support any combination of challenges that will satisfy the CA.
```

Follow the Instructions given [here](https://community.letsencrypt.org/t/solution-client-with-the-currently-selected-authenticator-does-not-support-any-combination-of-challenges-that-will-satisfy-the-ca/49983) and if you’re serving files for that domain out of a directory on that server, you can run the following command:

```
sudo certbot --authenticator webroot --webroot-path <path to served directory> --installer nginx -d <domain>
```

If you’re not serving files out of a directory on the server, you can temporarily stop your server while you obtain the certificate and restart it after Certbot has obtained the certificate. This would look like:

```
sudo certbot --authenticator standalone --installer nginx -d <domain> --pre-hook "service nginx stop" --post-hook "service nginx start"
```

e.g.

1. Create your virtual server conf - the given config below routes an node/express app running on localhost:7777 with a public directory in /opt/mysite-build/app :

```nginx
server {
       listen         80;
       listen    [::]:80;
       server_name    my.domain.com;
       return         301 https://$server_name$request_uri;
}

upstream app_test {
	# point to the running node
	server 127.0.0.1:7777;
}

server {
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	server_name my.domain.com;
	
	# set the default public directory for your node
	root /opt/mysite-build/app;
	
	# Optimizing Nginx for Best Performance
	ssl_session_cache shared:SSL:5m;
    ssl_session_timeout 1h;
	
	location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	proxy_set_header Host $http_host;
    	proxy_set_header X-NginX-Proxy true;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    	proxy_max_temp_file_size 0;
		proxy_pass http://wiki2_test;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
	}
	
	# use NGINX to cache static resources that are requested regularly
	location ~* \.(css|js|jpg|png|ico)$ {
		expires 168h;
	}

}
```

Test your your site by opening my.domain.com inside your browser - you should be automatically redirected to https://my.domain.com and be given a certificate warning. Click to proceed anyway to access your site.

Now run:

```
sudo certbot --authenticator webroot --webroot-path /opt/mysite-build/app --installer nginx -d my.domain.com
```

certbot will modify your NGINX config automatically!