---
title: Centos Administration
subTitle: Red Hat Enterprise and Centos Linux Server Adminsitration
category: "LINUX"
date: 2019-01-13
cover: photo-19196703263_69f9f0df5f_o-cover.png
hero: photo-19196703263_69f9f0df5f_o.png

---

![Abashiri, Japan](./photo-19196703263_69f9f0df5f_o.png)


<!-- TOC -->

- [Changing your SSH login](#changing-your-ssh-login)
- [Running FirewallD](#running-firewalld)
- [Changing the SSH Port](#changing-the-ssh-port)
- [Changing the Hostname](#changing-the-hostname)
- [Kernel Update Troubleshooting](#kernel-update-troubleshooting)
- [Working with IP tables](#working-with-ip-tables)
  - [How do I view blocked ports rules?](#how-do-i-view-blocked-ports-rules)

<!-- /TOC -->


## Changing your SSH login

SSH uses your linux user password. Simply use the passwd command after logging in. It will prompt you to change it. Or name a different user to change theirs:

```ssh
passwd
passwd user1
```


## Running FirewallD

```bash
yum install -y firewalld
systemctl enable firewalld
systemctl start firewalld
systemctl status firewalld
firewall-cmd --permanent --zone=public --add-service=http
firewall-cmd --permanent --zone=public --add-port=1880/tcp
firewall-cmd --reload
firewall-cmd --list-all
```


## Changing the SSH Port

```bash
firewall-cmd --permanent --zone=public --add-port=4444/tcp
firewall-cmd --reload
semanage port -a -t ssh_port_t -p tcp 4444
nano /etc/ssh/sshd_config
```

```yaml
# If you want to change the port on a SELinux system, you have to tell
# SELinux about this change.
# semanage port -a -t ssh_port_t -p tcp #PORTNUMBER
#
Port 4444
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::
```

```bash
service sshd restart
```


## Changing the Hostname

```bash
hostnamectl set-hostname your-new-hostname
hostnamectl
systemctl reboot
```


## Kernel Update Troubleshooting

How to fix: `At least xMB more space needed on the /boot filesystem`. List all installed kernel packages with:


```bash
yum list kernel
```


The kernel in-use will be underlined and cannot be removed. Now to remove unused kernels, install the yum-utils package and use the package-cleanup util:


```bash
yum install yum-utils
package-cleanup --oldkernels --count=2
```


To make this permanent, edit `/etc/yum.conf` and change the following line:


```bash
installonly_limit=2
```


## Working with IP tables

### How do I view blocked ports rules?

_Use the iptables command:_

```bash
# /sbin/iptables -L -n -v
# /sbin/iptables -L -n -v | grep port
# /sbin/iptables -L -n -v | grep -i DROP
# /sbin/iptables -L OUTPUT -n -v
# /sbin/iptables -L INPUT -n -v
```


Generally Useful Rules
This section includes a variety of iptables commands that will create rules that are generally useful on most servers.

Allow Loopback Connections
The loopback interface, also referred to as lo, is what a computer uses to forward network connections to itself. For example, if you run ping localhost or ping 127.0.0.1, your server will ping itself using the loopback. The loopback interface is also used if you configure your application server to connect to a database server with a "localhost" address. As such, you will want to be sure that your firewall is allowing these connections.

To accept all traffic on your loopback interface, run these commands:

sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT
Allow Established and Related Incoming Connections
As network traffic generally needs to be two-way—incoming and outgoing—to work properly, it is typical to create a firewall rule that allows established and related incoming traffic, so that the server will allow return traffic to outgoing connections initiated by the server itself. This command will allow that:

sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
Allow Established Outgoing Connections
You may want to allow outgoing traffic of all established connections, which are typically the response to legitimate incoming connections. This command will allow that:

sudo iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED -j ACCEPT
Internal to External
Assuming eth0 is your external network, and eth1 is your internal network, this will allow your internal to access the external:

sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
Drop Invalid Packets
Some network traffic packets get marked as invalid. Sometimes it can be useful to log this type of packet but often it is fine to drop them. Do so with this command:

sudo iptables -A INPUT -m conntrack --ctstate INVALID -j DROP
Block an IP Address
To block network connections that originate from a specific IP address, 15.15.15.51 for example, run this command:

sudo iptables -A INPUT -s 15.15.15.51 -j DROP
In this example, -s 15.15.15.51 specifies a source IP address of "15.15.15.51". The source IP address can be specified in any firewall rule, including an allow rule.

If you want to reject the connection instead, which will respond to the connection request with a "connection refused" error, replace "DROP" with "REJECT" like this:

sudo iptables -A INPUT -s 15.15.15.51 -j REJECT
Block Connections to a Network Interface
To block connections from a specific IP address, e.g. 15.15.15.51, to a specific network interface, e.g. eth0, use this command:

iptables -A INPUT -i eth0 -s 15.15.15.51 -j DROP
This is the same as the previous example, with the addition of -i eth0. The network interface can be specified in any firewall rule, and is a great way to limit the rule to a particular network.

Service: SSH
If you're using a cloud server, you will probably want to allow incoming SSH connections (port 22) so you can connect to and manage your server. This section covers how to configure your firewall with various SSH-related rules.

Allow All Incoming SSH
To allow all incoming SSH connections run these commands:

sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 22 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established SSH connections, is only necessary if the OUTPUT policy is not set to ACCEPT.

Allow Incoming SSH from Specific IP address or subnet
To allow incoming SSH connections from a specific IP address or subnet, specify the source. For example, if you want to allow the entire 15.15.15.0/24 subnet, run these commands:

sudo iptables -A INPUT -p tcp -s 15.15.15.0/24 --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 22 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established SSH connections, is only necessary if the OUTPUT policy is not set to ACCEPT.

Allow Outgoing SSH
If your firewall OUTPUT policy is not set to ACCEPT, and you want to allow outgoing SSH connections—your server initiating an SSH connection to another server—you can run these commands:

sudo iptables -A OUTPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A INPUT -p tcp --sport 22 -m conntrack --ctstate ESTABLISHED -j ACCEPT
Allow Incoming Rsync from Specific IP Address or Subnet
Rsync, which runs on port 873, can be used to transfer files from one computer to another.

To allow incoming rsync connections from a specific IP address or subnet, specify the source IP address and the destination port. For example, if you want to allow the entire 15.15.15.0/24 subnet to be able to rsync to your server, run these commands:

sudo iptables -A INPUT -p tcp -s 15.15.15.0/24 --dport 873 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 873 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established rsync connections, is only necessary if the OUTPUT policy is not set to ACCEPT.

Service: Web Server
Web servers, such as Apache and Nginx, typically listen for requests on port 80 and 443 for HTTP and HTTPS connections, respectively. If your default policy for incoming traffic is set to drop or deny, you will want to create rules that will allow your server to respond to those requests.

Allow All Incoming HTTP
To allow all incoming HTTP (port 80) connections run these commands:

sudo iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 80 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established HTTP connections, is only necessary if the OUTPUT policy is not set to ACCEPT.

Allow All Incoming HTTPS
To allow all incoming HTTPS (port 443) connections run these commands:

sudo iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 443 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established HTTP connections, is only necessary if the OUTPUT policy is not set to ACCEPT.

Allow All Incoming HTTP and HTTPS
If you want to allow both HTTP and HTTPS traffic, you can use the multiport module to create a rule that allows both ports. To allow all incoming HTTP and HTTPS (port 443) connections run these commands:

sudo iptables -A INPUT -p tcp -m multiport --dports 80,443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m conntrack --ctstate ESTABLISHED -j ACCEPT
The second command, which allows the outgoing traffic of established HTTP and HTTPS connections, is only necessary if the OUTPUT policy is not set to ACCEPT.







Run the following. It'll insert the rule at the top of your iptables and will allow all traffic unless subsequently handled by another rule.

```bash
iptables -I INPUT -j ACCEPT
```


You can also flush your entire iptables setup with the following:


```bash
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
```



If you flush it, you might want to run something like:


```
iptables -A INPUT -i lo -j ACCEPT -m comment --comment "Allow all loopback traffic"
iptables -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT -m comment --comment "Drop all traffic to 127 that doesn't use lo"
iptables -A OUTPUT -j ACCEPT -m comment --comment "Accept all outgoing"
iptables -A INPUT -j ACCEPT -m comment --comment "Accept all incoming"
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT -m comment --comment "Allow all incoming on established connections"
iptables -A INPUT -j REJECT -m comment --comment "Reject all incoming"
iptables -A FORWARD -j REJECT -m comment --comment "Reject all forwarded"
```

If you want to be a bit safer with your traffic, don't use the accept all incoming rule, or remove it with "iptables -D INPUT -j ACCEPT -m comment --comment "Accept all incoming"", and add more specific rules like:


```bash
iptables -I INPUT -p tcp --dport 80 -j ACCEPT -m comment --comment "Allow HTTP"
iptables -I INPUT -p tcp --dport 443 -j ACCEPT -m comment --comment "Allow HTTPS"
iptables -I INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT -m comment --comment "Allow SSH"
iptables -I INPUT -p tcp --dport 8071:8079 -j ACCEPT -m comment --comment "Allow torrents"
```

NOTE: They need to be above the 2 reject rules at the bottom, so use I to insert them at the top. Or if you're anal like me, use "iptables -nL --line-numbers" to get the line numbers, then use "iptables -I INPUT ..." to insert a rule at a specific line number.

Finally, save your work with:

```
iptables-save > /etc/network/iptables.rules #Or wherever your iptables.rules file is
```