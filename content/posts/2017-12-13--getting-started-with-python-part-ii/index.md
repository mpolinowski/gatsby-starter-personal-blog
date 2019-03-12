---
title: Getting started with Python Part II
subTitle: According to Wikipedia Python is an interpreted, high-level, general-purpose programming language. And looking around, it seems to be everywhere - Machine Learning, Artificial Intelligence, Big Data Analysis all the way to Web Dev and Dev Ops.
category: "Python"
date: 2017-12-13
cover: photo-34607491985_e91fa7d4bc_o-cover.png
hero: photo-34607491985_e91fa7d4bc_o.png
---


![Port Vila, Vanuatu](./photo-34607491985_e91fa7d4bc_o.png)


<!-- TOC depthFrom:2 depthTo:4 -->

- [IF Elif Else](#if-elif-else)
- [For For-Else](#for-for-else)
  - [Looping through Arrays](#looping-through-arrays)
  - [Looping through Strings](#looping-through-strings)
  - [Working with Ranges](#working-with-ranges)
- [While While-Else](#while-while-else)
- [Nested Statements](#nested-statements)
  - [If](#if)
  - [For](#for)
  - [While](#while)
- [Controlling a Loop](#controlling-a-loop)
  - [Break](#break)
  - [Continue](#continue)
  - [Pass](#pass)
- [Exceptions Handling](#exceptions-handling)

<!-- /TOC -->


## IF Elif Else


![Python](./python-basics_01.png)


![Python](./python-basics_02.png)


![Python](./python-basics_03.png)



## For For-Else

### Looping through Arrays


![Python](./python-basics_04.png)


### Looping through Strings


![Python](./python-basics_05.png)


### Working with Ranges


![Python](./python-basics_06.png)


We can use the `len()` function to assign an index to an array, loop through the elements and print out their by their assigned index:


![Python](./python-basics_07.png)


A similar result can be achieved with the `enumerate()` function, that will give us both the index, as well as the value of the array element:


![Python](./python-basics_08.png)


We can also add an __Else__ statement to the __For Loop__ that is triggered when the loop reaches the end of the list:


![Python](./python-basics_09.png)



## While While-Else


![Python](./python-basics_10.png)


![Python](./python-basics_11.png)



## Nested Statements

### If

The first __If Statement__ checks if the string has the letter __a__ in it. If true, the second if statement is triggered and checks if the length of the string is greater than 6. Only if both statements are true, we will get a printout of the string itself and it's length:


![Python](./python-basics_12.png)


This code can be shortened by using the __And Operator__ instead of the inner if statement:


![Python](./python-basics_13.png)


### For


![Python](./python-basics_14.png)

![Python](./python-basics_15.png)


### While

In the following nested __While Loop__ we have __x__ being incremented with each loop until x reaches the value of 10. Each time the first while loop runs, the inner while loop is triggered to run until the value of __z__ reaches 10. This is repeated ten times until __x = 10__:

![Python](./python-basics_16.png)



## Controlling a Loop

### Break

![Python](./python-basics_17.png)


The loop runs until the if statement becomes __True__ and the break command is executed.


![Python](./python-basics_18.png)


In the second example we have a for loop that tries to multiply every element of _list1_ with every element in _list2_. But the __Break__ command stops the execution when the last element of _list2_ is reached:

```
5 x 1 = 5
5 x 2 => break
6 x 1 = 6
6 x 2 => break
7 x 1 = 7
7 x 2 => break
8 x 1 = 8
8 x 2 => break
```


### Continue


![Python](./python-basics_19.png)


The __Continue__ command is triggered when the second element of _list2_ is reached in the multiplication. But, unlike the __Break__ command, it does not stop the execution of the following multiplication:

```
4 x 1 = 4
4 x 2 => break 
4 x 3 = 12
5 x 1 = 5
5 x 2 => break
5 x 3 = 15
6 x 1 = 6
6 x 2 => break
6 x 3 = 18
```


### Pass


![Python](./python-basics_20.png)


The pass statement is just a placeholder that does nothing on execution - for debugging reasons or during the early concept phase of development.


## Exceptions Handling


![Python](./python-basics_21.png)


The function is trying to divide all members of the range by Zero, which would cause ein __Exception Error__ in our code. But because we wrapped our function in a __try/except__ block, the error triggers the code below the _except command_ instead of just crashing the program. If the first function is successful, the exception code is not triggered.


To catch all possible errors, just don't specify the error you are looking for - above we only caught `ZeroDivisionError`s. But it is recommended to rather add all possible errors to the block instead, to be able to differentiate between the possible root causes of the error (Catching all errors just gives you a generic error message):


![Python](./python-basics_22.png)


For debugging purposes you can also add an __Else  Clause__ at the bottom to get a feedback when a function was executed successfully:


![Python](./python-basics_23.png)


The code behind a __Finally Clause__ - unlike with __Else__ - is execute wether the function inside the __Try Block__ _was successfully executed or not_.


![Python](./python-basics_24.1.png)


![Python](./python-basics_24.2.png)