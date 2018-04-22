---
title: Unreal Engine Coding Standards (V)
subTitle: The Unreal Engine Developer Course - Learn C++ & Make Games. Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
category: "C++"
date: 2017-06-17
cover: photo-34605459545_86a3d9a34f_o-cover.jpg
hero: photo-33795443263_fcb0014fd2_o.jpg
---

![Unreal Engine Coding Standards](./photo-33795443263_fcb0014fd2_o.jpg)


> Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
> This is a fork of the Part I of the first section of the [Unreal Course](https://github.com/UnrealCourse) teaching C++ coding standards for the Unreal Game Engine.
> The Source Code can be found in [consoleApplication](https://github.com/mpolinowski/consoleApplication)
> The following is the commented Course Journal:


<!-- TOC -->

- [Using using for Type Aliases](#using-using-for-type-aliases)
- [Using struct for Simple Types](#using-struct-for-simple-types)
- [Using if Statements in C++](#using-if-statements-in-c)
- [Debugging 101](#debugging-101)
- [A Place for Everything](#a-place-for-everything)
- [Introducing enumerations](#introducing-enumerations)
- [Writing Error Checking Code](#writing-error-checking-code)
- [Using switch Statements](#using-switch-statements)
- [Warm Fuzzy Feelings](#warm-fuzzy-feelings)
- [Handling Game Win Condition](#handling-game-win-condition)
- [Win or Lose "Screen"](#win-or-lose-screen)
- [Introducing Big O Notation](#introducing-big-o-notation)
- [TMap and map Data Structures](#tmap-and-map-data-structures)
- [Range-based for Loop](#range-based-for-loop)
- [Design a Helper Function](#design-a-helper-function)
- [Playtesting Your Game](#playtesting-your-game)
- [Difficulty & Play Tuning](#difficulty--play-tuning)
- [Polishing & Packaging](#polishing--packaging)
- [Section 2 Wrap-Up](#section-2-wrap-up)

<!-- /TOC -->


### Using using for Type Aliases

+ We’re substituting types to be “Unreal ready”
+ The declaration is **using \<alias\> = \<type\>;**
+ For example **using int32 = int;**
+ Why Unreal uses **int32** rather than **int**
+ **FText** is for output, **FString** is “mutable”
+ Where to use each type of string
+ Map **FText** and **FString** to **std::string**

### Using struct for Simple Types

+ **struct** is almost identical to **class**
+ It’s member variables (data) is public by default
+ Ideal for simple value types like **BullCowCount**
+ Outline **BullCowCount SubmitGuess(FString)**

### Using if Statements in C++

+ Why we need conditionals (selection)
+ Use **if** when it reads better (e.g. few conditions)
+ Use **switch** for multiple, simple conditions
+ (for loads of statements consider a table lookup)
+ The syntax of an **if** statement
+ Using **if** to write count bulls and cows.

### Debugging 101

+ A very brief intro to Visual Studio’s debugger
+ Set a break-point by clicking in margin
+ Watch values by highlighting in debug mode
+ Use “Continue” to cycle back to breakpoint.

### A Place for Everything

+ Centralising the hidden word length
+ Making this a property of the game class
+ Writing a getter to access this value
+ Updating our intro to vary with word length.

### Introducing enumerations

+ An **enum**erated type consists of named values
+ Use instead of coded meaning
+ Makes the code more readable and meaningful
+ Only defined values can be used - more robust
+ A benefit of C++ 11’s strongly typed enums
+ Creating an **enum class** for error checking.

### Writing Error Checking Code

+ Use **else if** for the first time
+ Outline or **CheckGuessValidity()** method
+ Write working code for checking guess length
+ Use the debugger to test the return values.

### Using switch Statements

+ Use our error values to communicate with user
+ All our user interaction is via **GameManager.cpp**
+ We’ll use **FText** in this file, as it’s UI text
+ We can “switch” what we say based on the error
+ The syntax of a **switch** statement
+ Remember your **break** keywords!

### Warm Fuzzy Feelings

+ _Don’t_ get comfortable with compiler warnings
+ Refactor **GetValidGuess()** to remove warning
+ Rename **SubmitGuess()** to **SubmitValidGuess()**
+ Improve readability of **SubmitValidGuess()**
+ Get a warm fuzzy feeling!

### Handling Game Win Condition

+ Change our **PlayGame()** loop to a **while**
+ Implement our **IsGameWon()** function

### Win or Lose "Screen"

Write a method to print a game summary to the screen once the game is over.

### Introducing Big O Notation

+ Algorithm: the recipe for solving a problem
+ or: 45th US Vice President’s dance style
+ Introducing the complexity of algorithms
+ A quick introduction to “Big O” notation
+ Comparing three ways of checking for isograms.

### TMap and map Data Structures

+ The importance of knowing your data types
+ Introducing the **std::map** data type
+ **#define TMap std::map** to keep it ‘Unreal’
+ How we’ll be using the map
+ **TMap\<char, bool\> LetterSeen;** to declare
+ Using **LetterSeen[Letter]** to access
+ Wiring-up and pseudocoding **IsIsogram()**

### Range-based for Loop

+ Introducing containers and iterators
+ Using a range-based for loop in Unreal\*
+ Gently introducing the auto keyword
+ Finishing our IsIsogram()

**Useful Links**

+ \* [Unreal Engine - Ranged Based For Loops](https://www.unrealengine.com/blog/ranged-based-for-loops)

### Design a Helper Function

+ Gain confidence with a multi-stage challenge
+ A word on implicit dependencies

### Playtesting Your Game

+ Having someone else play test your game is vital
+ Silently take notes, or record screen if possible
+ Immediately go away and fix obvious bugs
+ For improvements consider 2nd or 3rd opinion
+ Repeat until the bug / issue rate plateaus.

### Difficulty & Play Tuning

+ About the flow channel\*
+ **map** word length to max tries
+ Play test to determine correct difficulty.

**Useful Links**

+ \* Read more in [Sylvester, T. Designing Games - O’Reilly](https://www.amazon.com/dp/B00AWKX1FO/)

### Polishing & Packaging

+ First impressions count (think reviews)
+ Don’t ship a half-baked product, even if digital
+ Check through your code (polish)
+ Ship to your customers (package).

### Section 2 Wrap-Up

+ HUGE congratulations on your progress
+ Over 5 hours of pure C++ learning
+ Over 30 challenges you’ve completed
+ The journey has only just begun
+ Share your source code for others to play
+ Here are some suggested improvements
+ Next we take the game logic into Unreal :-)