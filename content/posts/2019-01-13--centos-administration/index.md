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
