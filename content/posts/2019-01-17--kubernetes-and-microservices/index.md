---
title: Kubernetes and Microservices
subTitle: Red Hat Enterprise and Centos Linux Server Adminsitration
category: "Container"
date: 2019-01-17
cover: photo-34364880182_fe2d33582b_o-cover.jpg
hero: photo-34364880182_fe2d33582b_o.jpg

---

![Sydney, Australia](./photo-34364880182_fe2d33582b_o.jpg)


<!-- TOC -->

- [Kubernetes + Compose = Kompose](#kubernetes--compose--kompose)
  - [Use Kompose](#use-kompose)

<!-- /TOC -->












## Kubernetes + Compose = Kompose

[Kompose](http://kompose.io) is a conversion tool for Docker Compose to container orchestrators such as Kubernetes (or OpenShift).

* Simplify your development process with Docker Compose and then deploy your containers to a production cluster
* [Convert](https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/) your _docker-compose.yaml_ with one simple command `kompose convert`
* Immediately bring up your cluster with `kompose up`
* Bring it back down with `kompose down`


Kompose is in EPEL CentOS repository. If you don’t have EPEL repository already installed and enabled you can do it by running `yum install epel-release`:


```bash
yum -y install kompose
```


### Use Kompose

In just a few steps, we’ll take you from Docker Compose to Kubernetes. All you need is an existing `docker-compose.yml` file:


1. Go to the directory containing your _docker-compose.yml_ file. Run the `kompose up` command to deploy to Kubernetes directly.
2. Or convert the _docker-compose.yml_ file to files that you can use with `kubectl`, run `kompose convert`:


---

![Creating a Kubernetes Cluster](./kubernetes_cluster_x1.png)

---


And then `kubectl create -f <output files>` - e.g. :
 

```bash
kubectl create -f api-service.yaml,elasticsearch-service.yaml,frontend-service.yaml,wiki-service.yaml,api-deployment.yaml,api-claim0-persistentvolumeclaim.yaml,elasticsearch-deployment.yaml,esdata-en-persistentvolumeclaim.yaml,frontend-deployment.yaml,frontend-claim0-persistentvolumeclaim.yaml,wiki-deployment.yaml
```


---

![Creating a Kubernetes Cluster](./kubernetes_cluster_x2.png)

---