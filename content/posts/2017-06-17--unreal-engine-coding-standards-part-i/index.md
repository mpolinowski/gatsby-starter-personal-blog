---
title: Unreal Engine Coding Standards (I)
subTitle: The Unreal Engine Developer Course - Learn C++ & Make Games. Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
category: "C++"
date: 2017-06-17
cover: photo-34221445950_a285c6eee4_o-cover.png
hero: photo-34221445950_a285c6eee4_o.jpg
---

![Unreal Engine Coding Standards](./photo-34221445950_a285c6eee4_o.jpg)


> Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
> This is a fork of the Part I of the first section of the [Unreal Course](https://github.com/UnrealCourse) teaching C++ coding standards for the Unreal Game Engine.
> The Source Code can be found in [consoleApplication](https://github.com/mpolinowski/consoleApplication)
> The following is the commented Course Journal:


### Intro, Notes & Section 2 Assets

+ Welcome to the first actual coding video.
+ Why we’re doing this in the IDE only.
+ What you’ll be building, see resources.
+ You’ll learn types, loops, routines, classes.
+ We’ll follow Unreal’s coding style, and re-use.
+ Notes and resources are attached.

### S02 Game Design Document (GDD)

+ How much planning should we do?
+ Define the emotional problem the game solves\*
+ Chose concept, rules & requirements.
+ Start to think about the architecture.
+ _Copy_ as much as possible into the code!
+ Document now what may change later.

**Useful Links**
+ \* [McConnell, Steve. _Code Complete._ Microsoft Press 2004. Chapter 3.3](https://www.amazon.com/gp/product/0735619670/)

### How Solutions & Projects Relate

+ How projects and solutions relate.
+ Setting up a new command line project.
+ An overview of the structure of our solution.
+ (Adding main.cpp to our project).

### C++ Function Syntax

+ The difference between an engine and a library.
+ How this relates to this console application.
+ What is building / compiling code?
+ How the console knows where to find our code.
+ The syntax of a function in C++.
+ Write the minimal C++ program to remove error.
+ Testing our application runs without error.

```cpp
// Standard C++ library automatically included by Visual Studio
#include "stdafx.h"

int main() {
  return 0;
}
```

Created a C++ function "main" in a file "main.cpp" that can be run CTRL+F5 without errors and returns integer 0.

### Using, #include and Namespaces

+ **#** represents a “preprocessor directive”.
+ **#include** copies-and-pastes other code.
+ The idea of using library code.
+ Use <> for standard libraries.
+ Use “ “ for files you have created yourself.
+ Notice the namespace icon in autocomplete.
+ Import **iostream** library and use **std** namespace
+ Clean up your code by removing **std::** that is no longer needed

```cpp
#include "stdafx.h"
#include <iostream>

int main()
{
  std::cout << "Welcome to Bulls and Cows" << std::endl;
  return 0;
}
```

By defining the std namespace we can simplify our code:

```cpp
#include "stdafx.h"
#include <iostream>

using namespace std;

int main()
{
  cout << "Welcome to Bulls and Cows" << endl;
  return 0;
}
```

### Magic Numbers and Constants

+ What a “magic number” is.
+ Why it’s a good idea to avoid them.
+ **constexpr** means “evaluated at compile time”.
+ Introduce coding standards\*.
+ Use a constant expression for the word length.

```cpp
int main()
{
  // introduce the game
  constexpr int WORD_LENGTH = 9;
  cout << "Welcome to Bulls and Cows" << endl;
  cout << "Can you guess the << WORD_LENGTH;
  cout << " letter isogram I'm thinking of?/n";

  cout << endl;
  return 0;
}
```

There are 2 ways to break to a new line - "endl" and "/n". The latter does not flush the output buffer - otherwise identical.

**Useful Links**
+ \* [Unreal Engine - Coding Standard](https://docs.unrealengine.com/latest/INT/Programming/Development/CodingStandard/index.html)