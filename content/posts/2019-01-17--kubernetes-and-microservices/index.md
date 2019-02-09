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

- [Domain Driven Design and boundedContext](#domain-driven-design-and-boundedcontext)
  - [Deploying the Queue](#deploying-the-queue)
  - [Deploying the Position Simulator](#deploying-the-position-simulator)
  - [How to Debug a failed Deployment](#how-to-debug-a-failed-deployment)
  - [Deploying the Position Tracker](#deploying-the-position-tracker)
  - [Deploying the API Gateway](#deploying-the-api-gateway)
  - [Deploying the Angular Frontend](#deploying-the-angular-frontend)

<!-- /TOC -->



## Domain Driven Design and boundedContext

A Microservice architecture is an implementation of the [Domain Drive Design](https://martinfowler.com/tags/domain%20driven%20design.html) principle and [bounded Context](https://martinfowler.com/bliki/BoundedContext.html) is a central pattern in Domain-Driven Design. It is the focus of DDD's strategic design section which is all about dealing with large models and teams. DDD deals with large models by dividing them into different Bounded Contexts and being explicit about their interrelationships.


The idea behind the principle is to break architectures into small, __cohesive components__ that only fullfil one job (__single responsibility principle__) for one other component (__loosely coupled__). E.g. instead of having one big Integration Database that is build with a single schema and serves all parts of your monolithic application we will add a small, exclusive database to every component that needs data storage.


We are going to continue to build the web application we [started to build earlier](https://mpolinowski.github.io/creating-a-kubernetes-cluster/) - with an ActiveMQ Message broker in the backend and an Angular web frontend that will show us the position of our car fleet on a map. The architecture will consist of 5 pods:


```
Position Simulator -> ActiveMQ -> Position Tracker <- API Gateway <- NGINX Reverse Proxy <-> Web Browser
```


The necessary Docker images can be found on [DockerHUB](https://hub.docker.com/u/richardchesterwood) - their corresponding source code can be found on [Github](https://github.com/DickChesterwood/k8s-fleetman).

* The [Position Simulator](https://hub.docker.com/r/richardchesterwood/k8s-fleetman-position-simulator) will simulate the GPS signal from our cars, reporting in their position every 10s.
* The Position Simulator is then send to our [ActiveMQ](https://hub.docker.com/r/richardchesterwood/k8s-fleetman-queue) service we already deployed earlier.
* This Queue server / Message Broker then forwards the information it received to the [Position Tracker](https://hub.docker.com/r/richardchesterwood/k8s-fleetman-position-tracker) that is storing the information as well as doing some basic calculations on it, like estimating the average speed the car is traveling with.
* To prevent the frontend code to directly contact this backend part of our application, we will add an [API Gateway](https://hub.docker.com/r/richardchesterwood/k8s-fleetman-api-gateway) that will serve as an interface between front- and backend. This way changes in the backend will never directly affect the frontend, or vice versa - see [API Gateway Pattern](https://microservices.io/patterns/apigateway.html).
* The final container will run our [Web Application Frontend](https://hub.docker.com/r/richardchesterwood/k8s-fleetman-webapp-angular) with the help of an NGINX reverse proxy.



### Deploying the Queue

We want to start with a fresh cluster - if you already [followed the earlier steps](https://mpolinowski.github.io/creating-a-kubernetes-cluster/), just enter the directory that contains all your configuration files (services.yaml, pods.yaml, networking-tests.yaml) and force delete everything that was build from them on your cluster:


```bash
kubectl delete -f .
rm networking-tests.yaml
mv pods.yaml workloads.yaml
nano workloads.yaml
```

We are also deleting an unnecessary file from the previous step and renaming another - just if you are following along. We can now add the queue server to the `workloads.yaml` file:


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  # Unique key of the ReplicaSet instance
  name: queue
spec:
  selector:
    matchLabels:
      # the ReplicaSet manages all Pods
      # where the label = app: queue
      app: queue
  # only 1 Pod should exist atm - if it
  # crashes, a new pod will be spawned.
  replicas: 1
  template:
    metadata:
      labels:
        app: queue
    spec:
      containers:
      - name: queue
        image: richardchesterwood/k8s-fleetman-queue:release1
```


Secondly, we need to apply a service that exposes our Queue container, which is done in the `services.yaml` file (if you still have the webapp service from the previous step - just leave it in for now):


```yaml
apiVersion: v1
kind: Service
metadata:
  # Unique key of the Service instance
  name: fleetman-queue
spec:
  ports:
    - name: admin-console
      port: 8161
      targetPort: 8161
      # The nodePort is available from outside of the
      # cluster when is set to NodePort. It's value has
      # to be > 30000
      nodePort: 30010
    - name: endpoint
      port: 61616
      targetPort: 61616
  selector:
    # Define which pods are going to
    # be represented by this service
    # The service makes an network
    # endpoint for our app
    app: queue
  # Setting the Service type to ClusterIP makes the
  # service only available from inside the cluster
  # To expose a port use NodePort instead
  type: NodePort
```

The Queue service is going to expose the port __8161__ for the administration console (this should be removed once the app goes into production!) and makes it accessible over the port __30010__ from outside of the Kubernetes cluster. Additionally we need to expose the port __61616__ that ActiveMQ is using to broker messages.


You can now start both the pod as well as the service with:


```bash
kubectl apply -f workloads.yaml
kubectl apply -f services.yaml
kubectl get all
```


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_01.png)

---


The Admin panel should now be accessible over the IP address of your Kubernetes master server with the port __30010__:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_02.png)

---





### Deploying the Position Simulator

We can now add the Position Simulator to the `workloads.yaml` file - directly under the configuration of our queue server, divided by `---`:


```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  # Unique key of the ReplicaSet instance
  name: position-simulator
spec:
  selector:
    matchLabels:
      app: position-simulator
  # only 1 Pod should exist atm - if it
  # crashes, a new pod will be spawned.
  replicas: 1
  template:
    metadata:
      labels:
        app: position-simulator
    spec:
      containers:
      - name: position-simulator
        image: richardchesterwood/k8s-fleetman-position-simulator:release1
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: production-microservice
```


The configuration for deployment is similar to the ActiveMQ config. We only need to add a __Environment Variable__ that sets the service to _Production Settings_ - `SPRING_PROFILES_ACTIVE: production-microservice` (the service can be started with different profiles, depending if you are in a development or production environment).


We can apply the new workloads configuration, check for the name of the new container (it will be called `position-simulator` + an deployment ID + an replicationSet ID) and check if it is build correctly:


```bash
kubectl apply -f workloads.yaml
kubectl get all
kubectl describe pod position-simulator-68bfc8d6fb-8vxkt
```


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_03.png)

---


This service does not need to be accessed from outside of the Kubernetes cluster - so __we do not need to create a service__ for it.


We can test the deployment by accessing the IP Address followed by the port __30010__, click on _Managing ActiveMQ Broker_, sign in with __admin, admin__ and click on __Queues__:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_07.png)

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_08.png)

---


You should see a rising number of pending messages, telling you that our __Position Simulator__ is successfully sending GPS coordinates to the message broker.



### How to Debug a failed Deployment

As we have seen above the deployment work and the Position Simulator is up and running - but how would we debug a container that cannot be started for some reason? We can create this circumstance by adding a typo in the environment variable inside the config file we created above, e.g. `SPRING_PROFILES_ACTIVE: production-microservice-typo`:


```bash
kubectl apply -f workloads.yaml
kubectl get all
kubectl describe pod position-simulator-77dcb74d75-dt27n
```


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_04.png)

---


We can now see that the deployment is failing and Kubernetes is trying to restart the container in a loop (__CrashLoopBackOff__). To check what is going wrong, we can call the Kubernetes logs for the failing container:


```bash
kubectl logs position-simulator-77dcb74d75-dt27n
```


And the developer of the application should be able to spot the typo inside the selected profile for you:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_05.png)

---


Fixing the _typo_ and re-applying the configuration should show you that the "loop-crashing" container is now being discarded and replaced by a working version:


```bash
kubectl apply -f workloads.yaml
kubectl get all
```


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_06.png)

---



### Deploying the Position Tracker

Now we need to start up the position tracker who's job it is take out the message that are send by our position simulator and are currently piling up in our ActiveMQ Server. The position tracked does some calculation on those messages and exposes his results through an REST interface to the API gateway.


We can now add the __Position Tracker__ to the `workloads.yaml` file - directly under the configuration of our position simulator, divided by `---`:


```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  # Unique key of the ReplicaSet instance
  name: position-tracker
spec:
  selector:
    matchLabels:
      app: position-tracker
  # only 1 Pod should exist atm - if it
  # crashes, a new pod will be spawned.
  replicas: 1
  template:
    metadata:
      labels:
        app: position-tracker
    spec:
      containers:
      - name: position-tracker
        image: richardchesterwood/k8s-fleetman-position-tracker:release1
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: production-microservice
```


We can now deploy the position tracker and then take a look at our message queue. We should be able to see that the tracker is working and messages are getting de-queued:



```bash
kubectl apply -f workloads.yaml
```


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_09.png)

---


We can now add a service for the position tracker to expose the REST interface directly on port __8080__ (_optional - only for testing_). For this we need to add the following lines to our `services.yaml`:


```yaml
---
apiVersion: v1
kind: Service
metadata:
  # Unique key of the Service instance
  name: fleetman-position-tracker
spec:
  ports:
    - name: rest-interface
      port: 8080
      targetPort: 8080
      # The nodePort is available from outside of the
      # cluster when is set to NodePort. It's value has
      # to be > 30000
      nodePort: 30020
  selector:
    app: position-tracker
  # Setting the Service type to ClusterIP makes the
  # service only available from inside the cluster
  # To expose a port use NodePort instead
  type: NodePort
```


Now apply the changes `kubectl apply -f services.yaml` and open the REST interface on your Master server IP address with the port __30020__:


```bash
http://195.201.148.210:30020/vehicles/City%20Truck
```


You should be able to see the current location and speed of the vehicle with the designation __City Truck__:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_10.png)

---


Since it would be dangerous to expose the REST API directly to the internet, we will remove the NodePort and have the API be available only from inside our cluster on port 8080:


```yaml
---
apiVersion: v1
kind: Service
metadata:
  # Unique key of the Service instance
  name: fleetman-position-tracker
spec:
  ports:
    - name: rest-interface
      port: 8080
      targetPort: 8080
  selector:
    app: position-tracker
  # Setting the Service type to ClusterIP makes the
  # service only available from inside the cluster
  # To expose a port use NodePort instead
  type: ClusterIP
```



### Deploying the API Gateway


We can now add the __API Gateway__ to the `workloads.yaml` file - directly under the configuration of our position tracker, divided by `---`:


```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  # Unique key of the ReplicaSet instance
  name: api-gateway
spec:
  selector:
    matchLabels:
      app: api-gateway
  # only 1 Pod should exist atm - if it
  # crashes, a new pod will be spawned.
  replicas: 1
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: richardchesterwood/k8s-fleetman-api-gateway:release1
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: production-microservice
```


We can now deploy the gateway with `kubectl apply -f workloads.yaml`. And then expose the port __8080__ to the Kubernetes cluster in `services.yaml`:


```yaml
---
apiVersion: v1
kind: Service
metadata:
  # Unique key of the Service instance
  name: fleetman-api-gateway
spec:
  ports:
    - name: rest-interface
      port: 8080
      targetPort: 8080
  selector:
    app: api-gateway
  # Setting the Service type to ClusterIP makes the
  # service only available from inside the cluster
  # To expose a port use NodePort instead
  type: ClusterIP
```



### Deploying the Angular Frontend


We can now add the __Web APP__ to the `workloads.yaml` file - directly under the configuration of our position tracker, divided by `---`:


```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  # Unique key of the ReplicaSet instance
  name: webapp
spec:
  selector:
    matchLabels:
      app: webapp
  # only 1 Pod should exist atm - if it
  # crashes, a new pod will be spawned.
  replicas: 1
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: richardchesterwood/k8s-fleetman-webapp-angular:release1
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: production-microservice
```


We can now deploy the frontend with `kubectl apply -f workloads.yaml`. And then expose the port __80__ to the Kubernetes cluster in `services.yaml`, as well as adding the public port (NodePort) __30080__:


```yaml
apiVersion: v1
kind: Service
metadata:
  # Unique key of the Service instance
  name: fleetman-webapp
spec:
  ports:
    # Accept traffic sent to port 80
    - name: http
      port: 80
      targetPort: 80
      # The nodePort is available from outside of the
      # cluster when is set to NodePort. It's value has
      # to be > 30000
      nodePort: 30080
  selector:
    # Define which pods are going to
    # be represented by this service
    # The service makes an network
    # endpoint for our app
    app: webapp
  # Setting the Service type to ClusterIP makes the
  # service only available from inside the cluster
  # To expose a port use NodePort instead
  type: NodePort
```


Your complete Microservice deployment should now look something like this:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_11.png)

---


And you should be able to access the web interface on port __30080__ on your master server IP address:


---

![A Kubernetes Cluster & Microservices](./kubernetes_microservices_12.gif)

---