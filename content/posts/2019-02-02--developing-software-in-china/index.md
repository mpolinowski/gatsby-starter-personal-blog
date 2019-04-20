---
title: Developing Software in China
subTitle: Being a Software Developer in China can be a nightmare. Every time you try to install some library there is a really good chance that your run into a 404. A lot of the Open Source efforts are all but invisible behind the Golden Shield - Proxy Squid to the rescue.
category: "LINUX"
date: 2019-02-02
cover: photo-76834w36_4vkhjk89776s_78-cover.png
hero: photo-76834w36_4vkhjk89776s_78.png
---


![Phnom Penh, Cambodia](./photo-76834w36_4vkhjk89776s_78.png)


<!-- TOC -->

- [Setting up a Squid Proxy Server](#setting-up-a-squid-proxy-server)
  - [Setup Access Restrictions](#setup-access-restrictions)
  - [Squid Proxy Client Authentication](#squid-proxy-client-authentication)
  - [Configuring FirewallD](#configuring-firewalld)
- [Adding the Proxy Server to your Raspberry Pi](#adding-the-proxy-server-to-your-raspberry-pi)
  - [Changing the Nameserver](#changing-the-nameserver)

<!-- /TOC -->


## Setting up a Squid Proxy Server

How To Install [Squid Proxy](http://www.squid-cache.org/Intro/) on CentOS 7:


```bash
yum -y install squid
chkconfig squid on
```




### Setup Access Restrictions

Since this Squid proxy would allow anyone using it to make connections from your servers's IP address, you would want to restrict access to it.

We will use the free service from [NoIP.com](https://www.noip.com/sign-up) to create a DDNS address for our proxy service. We can then later configure squid to only accept traffic coming from this address.


![Squid Proxy](./Squid_Proxy_01.png)


This hostname should be added to /etc/squid/squid.conf. Edit the file and add your hostname, e.g. `acl localnet src myproxy.no-ip.org`:


![Squid Proxy](./Squid_Proxy_02.png)


We can now start squid and enable it as a system service:


```bash
systemctl start squid
systemctl enable squid
systemctl status squid
```


![Squid Proxy](./Squid_Proxy_03.png)


You now can test your Proxy by adding it to your network configuration, e.g. in Chrome (s. below) and navigate to a website like [whatismyip.com](http://www.whatismyip.com/). It should now show you that you are actually accessing the web site from your proxies IP address.


![Squid Proxy](./Squid_Proxy_04.png)



### Squid Proxy Client Authentication

You will most probably want your users to authenticate before using the proxy. For that purpose, you can enable basic http authentication. It is easy and fast to configure.

First you will need __httpd-tools__ installed:


```bash
yum -y install httpd-tools
```


Now lets create a file that will later store the username for the authentication. Squid runs with user `squid` so the file should be owned by that user:


```bash
touch /etc/squid/passwd
chown squid: /etc/squid/passwd
```


Now we will create a new user called `proxyclient` and setup its password:


```bash
htpasswd /etc/squid/passwd proxyclient
```


Now to configure the authentication open the configuration file with `nano /etc/squid/squid.conf` and after the ports ACLs add the following lines:


```bash
auth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic children 5
auth_param basic realm Squid Basic Authentication
auth_param basic credentialsttl 2 hours
acl auth_users proxy_auth REQUIRED
http_access allow auth_users
```


![Squid Proxy](./Squid_Proxy_05.png)


Save the file and restart squid so that the new changes can take effect `systemctl restart squid`.


### Configuring FirewallD

And make sure that your firewall allows traffic on your proxy port (default `3128`):


```bash
firewall-cmd --zone=public --add-port=3128/tcp

firewall-cmd --permanent --zone=public --add-port=3128/tcp
```



## Adding the Proxy Server to your Raspberry Pi


You will need to set up three environment variables __http_proxy__,  __https_proxy__, and __no_proxy__ so your Raspberry Pi knows how to access the proxy server.


```bash
sudo nano /etc/environment
```


Add the following to the `/etc/environment` file to create the  __http_proxy__ variable:


```bash
export http_proxy="http://proxyclient:password@proxyipaddress:proxyport"
```


Replace _proxyipaddress_ and _proxyport_ with the IP address and port (Squid default `3128`) of your proxy. And _password_ with the password you used for the `proxyclient`.


Enter the same information for the environment variable __https_proxy__:


```bash
export https_proxy="http://username:password@proxyipaddress:proxyport"
```


Create the no_proxy environment variable, which is a comma-separated list of addresses your Pi should not use the proxy for:


```bash
export no_proxy="localhost, 127.0.0.1"
```

Your `/etc/environment` file should now look like this:


![Squid Proxy](./Squid_Proxy_06.png)


In order for operations that run as sudo (e.g. downloading and installing software) to use the new environment variables, you'll need to update __sudoers__:


```bash
sudo visudo
```


Add the following line to the file so sudo will use the environment variables you just created:


```bash
Defaults    env_keep+="http_proxy https_proxy no_proxy"
```


![Squid Proxy](./Squid_Proxy_07.png)


Now add the following line to `sudo nano /etc/apt/apt.conf.d/01proxy`:


```bash
Acquire::http::Proxy "http://username:password@proxyipaddress:proxyport";
```


### Changing the Nameserver

Unfortunately this isn't enough when you want to access servers by their domain name - e.g. Google CDNs for your libraries. Already the name resolution will be blocked or redirected to places you do not want to go. In some cases it is possible to get around this by the IP address of those servers instead of the domain (Note: you have to flag your `curls` with `--insecure` when accessing __HTTPS__ sites, as the certificate will match the domain but not the IP!)


But it makes much more sense to drop the DNS server that your ISP provides and go with an open one instead. At the moment of writing both the [secondary Google DNS](https://developers.google.com/speed/public-dns/docs/using) (8.8.4.4) as well as the [OpenDNS](https://use.opendns.com) server is reachable without a VPN. So I am going to set up those two as primary and secondary DNS for my Dev RaspberryPi.


This can usually be done inside `/etc/resolv.conf` but Raspbian installs a program called __resolvconf__ that will auto-generate this file every time you restart your Pi. To fix this problem we need to edit the DHCP config instead:


```bash
sudo nano /etc/dhcpcd.conf
```

Add the following line to the bottom of the file:


```bash
static domain_name_servers=8.8.4.4 208.67.222.222
```


And restart your Pi with:

```bash
sudo systemctl daemon-reload
sudo service dhcpcd restart
```


You can afterwards verify that the resolve configuration was generated successfully `sudo nano /etc/resolv.conf`


![Squid Proxy](./Squid_Proxy_08.png)



Reboot your Raspberry Pi for the changes to take effect. You should now be able to access the internet via your proxy server. You can the `curl https://www.wieistmeineip.de` - search for `wimip.ip` to verify that it shows your Proxy IP address:


```js
<script>
  var _SITE_NAME="WIMIP";
  var wimip = wimip || [];
  wimip.ip = "My Proxy IP";
</script>
```
















