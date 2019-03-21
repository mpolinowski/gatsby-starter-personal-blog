---
title: Kubernetes Bare Metal Ingress
subTitle: Red Hat Enterprise and Centos Linux Server Administration
category: "Container"
date: 2019-01-21
cover: photo-34607876585_6e59cd762e_o-cover.png
hero: photo-34607876585_6e59cd762e_o.png

---

![Victoria Harbour, Hongkong](./photo-34607876585_6e59cd762e_o.png)


<!-- TOC -->

- [Bare-metal considerations](#bare-metal-considerations)
- [Network Load-balancer MetalLB](#network-load-balancer-metallb)
  - [Installation With Kubernetes Manifests](#installation-with-kubernetes-manifests)
  - [MetalLB Configuration](#metallb-configuration)
  - [Layer 2 Configuration](#layer-2-configuration)

<!-- /TOC -->

> DRAFT - this article is still undergoing some "research"...



## Bare-metal considerations

In traditional cloud environments, where network load balancers are available on-demand, a single Kubernetes manifest suffices to provide a single point of contact to the NGINX Ingress controller to external clients and, indirectly, to any application running inside the cluster. [Bare-metal environments](https://kubernetes.github.io/ingress-nginx/deploy/baremetal/) lack this commodity, requiring a slightly different setup to offer the same kind of access to external consumers. The rest of this article describes a few recommended approaches to deploying the [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) inside a Kubernetes cluster running on bare-metal.



## Network Load-balancer MetalLB

[MetalLB](https://metallb.universe.tf/concepts/) hooks into your Kubernetes cluster, and provides a network load-balancer implementation. In short, it allows you to create Kubernetes services of type “LoadBalancer” in clusters that don’t run on a cloud provider, and thus cannot simply hook into paid products to provide load-balancers.

It has two features that work together to provide this service: address allocation, and external announcement:

* __Address Allocation__: In a cloud-enabled Kubernetes cluster, you request a load-balancer, and your cloud platform assigns an IP address to you. In a bare metal cluster, MetalLB is responsible for that allocation.
* __External Announcement__: Once MetalLB has assigned an external IP address to a service, it needs to make the network beyond the cluster aware that the IP “lives” in the cluster. MetalLB uses standard routing protocols to achieve this: ARP, NDP, or BGP.


Before starting with installation, make sure you meet all the [requirements](https://metallb.universe.tf/#requirements).



### Installation With Kubernetes Manifests

To install MetalLB, simply apply the manifest:


```bash
kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.7.3/manifests/metallb.yaml
```


This will deploy MetalLB to your cluster, under the metallb-system namespace. The components in the manifest are:

* The `metallb-system/controller deployment`. This is the cluster-wide controller that handles IP address assignments.
* The `metallb-system/speaker daemonset`. This is the component that speaks the protocol(s) of your choice to make the services reachable.


The installation manifest does not include a configuration file. MetalLB’s components will still start, but will remain idle until you define and deploy a configmap.


### MetalLB Configuration

To configure MetalLB, write a config map to `metallb-system/config` like [this example](https://raw.githubusercontent.com/google/metallb/v0.7.3/manifests/example-config.yaml):


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    # The peers section tells MetalLB what BGP routers to connect too. There
    # is one entry for each router you want to peer with.
    peers:
    - # The target IP address for the BGP session.
      peer-address: 10.0.0.1
      # The BGP AS number that MetalLB expects to see advertised by
      # the router.
      peer-asn: 64512
      # The BGP AS number that MetalLB should speak as.
      my-asn: 64512
      # (optional) the TCP port to talk to. Defaults to 179, you shouldn't
      # need to set this in production.
      peer-port: 179
      # (optional) The proposed value of the BGP Hold Time timer. Refer to
      # BGP reference material to understand what setting this implies.
      hold-time: 120
      # (optional) The router ID to use when connecting to this peer. Defaults
      # to the node IP address. Generally only useful when you need to peer with
      # another BGP router running on the same machine as MetalLB.
      router-id: 1.2.3.4
      # (optional) Password for TCPMD5 authenticated BGP sessions
      # offered by some peers.
      password: "yourPassword"
      # (optional) The nodes that should connect to this peer. A node
      # matches if at least one of the node selectors matches. Within
      # one selector, a node matches if all the matchers are
      # satisfied. The semantics of each selector are the same as the
      # label- and set-based selectors in Kubernetes, documented at
      # https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/.
      # By default, all nodes are selected.
      node-selectors:
      - # Match by label=value
        match-labels:
          kubernetes.io/hostname: prod-01
        # Match by 'key OP values' expressions
        match-expressions:
        - key: beta.kubernetes.io/arch
          operator: In
          values: [amd64, arm]

    # The address-pools section lists the IP addresses that MetalLB is
    # allowed to allocate, along with settings for how to advertise
    # those addresses over BGP once assigned. You can have as many
    # address pools as you want.
    address-pools:
    - # A name for the address pool. Services can request allocation
      # from a specific address pool using this name, by listing this
      # name under the 'metallb.universe.tf/address-pool' annotation.
      name: my-ip-space
      # Protocol can be used to select how the announcement is done.
      # Supported values are bgp and layer2.
      protocol: bgp
      
      # A list of IP address ranges over which MetalLB has
      # authority. You can list multiple ranges in a single pool, they
      # will all share the same settings. Each range can be either a
      # CIDR prefix, or an explicit start-end range of IPs.
      addresses:
      - 198.51.100.0/24
      - 192.168.0.150-192.168.0.200
      # (optional) If true, MetalLB will not allocate any address that
      # ends in .0 or .255. Some old, buggy consumer devices
      # mistakenly block traffic to such addresses under the guise of
      # smurf protection. Such devices have become fairly rare, but
      # the option is here if you encounter serving issues.
      avoid-buggy-ips: true
      # (optional, default true) If false, MetalLB will not automatically
      # allocate any address in this pool. Addresses can still explicitly
      # be requested via loadBalancerIP or the address-pool annotation.
      auto-assign: false
      # (optional) A list of BGP advertisements to make, when
      # protocol=bgp. Each address that gets assigned out of this pool
      # will turn into this many advertisements. For most simple
      # setups, you'll probably just want one.
      #
      # The default value for this field is a single advertisement with
      # all parameters set to their respective defaults.
      bgp-advertisements:
      - # (optional) How much you want to aggregate up the IP address
        # before advertising. For example, advertising 1.2.3.4 with
        # aggregation-length=24 would end up advertising 1.2.3.0/24.
        # For the majority of setups, you'll want to keep this at the
        # default of 32, which advertises the entire IP address
        # unmodified.
        aggregation-length: 32
        # (optional) The value of the BGP "local preference" attribute
        # for this advertisement. Only used with IBGP peers,
        # i.e. peers where peer-asn is the same as my-asn.
        localpref: 100
        # (optional) BGP communities to attach to this
        # advertisement. Communities are given in the standard
        # two-part form <asn>:<community number>. You can also use
        # alias names (see below).
        communities:
        - 64512:1
        - no-export
    # (optional) BGP community aliases. Instead of using hard to
    # read BGP community numbers in address pool advertisement
    # configurations, you can define alias names here and use those
    # elsewhere in the configuration. The "no-export" community used
    # above is defined below.
    bgp-communities:
      # no-export is a well-known BGP community that prevents
      # re-advertisement outside of the immediate autonomous system,
      # but people don't usually recognize its numerical value. :)
      no-export: 65535:65281
```


### Layer 2 Configuration

[Layer 2 mode](https://metallb.universe.tf/tutorial/layer2/) is the simplest to configure. The nice thing about layer 2 mode is that you don’t need any fancy network hardware at all, it should just work on any ethernet network. For example, the following configuration gives MetalLB control over IPs from __192.168.1.240__ to __192.168.1.250__, and configures [Layer 2 mode](https://metallb.universe.tf/configuration/#layer-2-configuration):


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.1.240-192.168.1.250
```


















---

![A Kubernetes Cluster & Microservices](./kubernetes_logging_04.png)

---