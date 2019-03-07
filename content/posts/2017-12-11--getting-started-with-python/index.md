---
title: Getting started with Python
subTitle: Acording to Wikipedia Python is an interpreted, high-level, general-purpose programming language. And looking around, it seems to be everywhere - Machine Learning, Artificial Intelligence, Big Data Analysis all the way to Web Dev and Dev Ops.
category: "Python"
date: 2017-12-11
cover: photo-34445490202_b13f40bd9d_o-cover.png
hero: photo-34445490202_b13f40bd9d_o.png
---


![Port Vila, Vanuatu](./photo-34445490202_b13f40bd9d_o.png)


<!-- TOC depthFrom:2 depthTo:4 -->

- [Python - Introduction](#python---introduction)
  - [Hello World](#hello-world)
  - [User Input](#user-input)
  - [Variables](#variables)
  - [Data Types](#data-types)
    - [Strings](#strings)
    - [Numbers](#numbers)
    - [Booleans](#booleans)
    - [Lists](#lists)
    - [Set](#set)
    - [Tuples](#tuples)
    - [Ranges](#ranges)
    - [Dictionaries](#dictionaries)
    - [Conversion between Data Types](#conversion-between-data-types)

<!-- /TOC -->


## Python - Introduction

### Hello World

```python
print("Hello World")
```

### User Input

```python
user_says = input ("Please enter a string: ")

print(user_says)
```

`user_says` is a Python variable that is used to store data, in this case it is assigned the string from the input function. We can then print out the variable to see if it worked.


### Variables

![Python](./python_01.png)


### Data Types

* mutable data type
    * lists
    * dictionaries
    * sets
*  immutable data types
   *  strings
   *  numbers
   *  tuples
   *  frozensets


#### Strings

![Python](./python_02.png)

![Python](./python_03.png)

![Python](./python_04.png)

![Python](./python_05.png)



#### Numbers

![Python](./python_06.png)



#### Booleans

![Python](./python_07.png)



#### Lists

![Python](./python_08.png)

![Python](./python_09.png)

![Python](./python_10.png)



#### Set

Sets = unordered lists of __unique items__.


![Python](./python_11.png)


You can create a set from a list to remove duplicates.


![Python](./python_12.png)


![Python](./python_13.png)


![Python](./python_14.png)


Just as list before sets are mutable - you can add or remove elements at will. To create an immutable set from a list you have to use __FrozenSets__:


![Python](./python_15.png)



#### Tuples

Tuples are immutable list - elements cannot be added or removed once the tuples was created.


![Python](./python_16.png)


Tuples allow you to map values to variables by assigning a tuple, made up of variables, to a tuple, made up of values:


![Python](./python_17.png)



#### Ranges


![Python](./python_18.png)



#### Dictionaries

Dictionaries are an unordered list of key-value pairs. Every key has to be unique and should be of an immutable type - strings, numbers or tuples.


![Python](./python_19.png)



#### Conversion between Data Types


![Python](./python_20.png)


![Python](./python_21.png)
