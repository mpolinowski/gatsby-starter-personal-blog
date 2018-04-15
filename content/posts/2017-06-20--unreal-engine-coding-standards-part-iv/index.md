---
title: Unreal Engine Coding Standards (Part IV)
subTitle: The Unreal Engine Developer Course - Learn C++ & Make Games. Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
category: "C++"
date: 2016-06-17
cover: photo-34606002985_b41c7bdcd5_o-cover.jpg
hero: photo-34606002985_b41c7bdcd5_o.jpg
---

![Unreal Engine Coding Standards](./photo-34606002985_b41c7bdcd5_o.jpg)


> Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
> This is a fork of the Part I of the first section of the [Unreal Course](https://github.com/UnrealCourse) teaching C++ coding standards for the Unreal Game Engine.
> The Source Code can be found in [consoleApplication](https://github.com/mpolinowski/consoleApplication)
> The following is the commented Course Journal:


### Introducing Classes

+ Lookup the Turing machine.
+ A quick overview of the MVC pattern.
+ User defined types (classes).
+ About working at an interface level (black box).
+ An overview of class **FBullCowGame**

### Using Header Files as Contracts

+ Introducing .h header files in C++.
+ Why the added complexity is worth it.
+ Defining the interface to our class.
+ Writing our first draft of FBullCowGame.

```cpp
#pragma once
#include <string>

class FBullCowGame
{
public:
  void Reset();
  int GetMaxTries();
  int GetCurrentTry();
  bool IsGameWon();
  bool CheckGuessValidity(std::string);

private:
  int MyCurrentTry;
  int MyMaxTries;
}
```

### Including Our Own Header File

+ NEVER use using namespace in a .h
+ In fact, why use it at all?
+ Create your .cpp files and **#include**
+ Don’t create chains of includes.

Remove **using namespace std;** from main.cpp - add std:: to all instances of cout, cin, string, endl, getline

Add *.cpp file to header - select void Reset(); right-click it, choose Quick-Action and Create Definition - this creates FBullCowGame.cpp. Repeat this for all methods in header file:

```cpp
#include FBullCowGame.h

void FBullCowGame::Reset()
{
  return;
}

int FBullCowGame::GetCurrentTry()
{
  return 0;
}

int FBullCowGame::GetMaxTries()
{
  return 0;
}

bool FBullCowGame::IsGameWon()
{
  return false,
}

void FBullCowGame::CheckGuessValidity(std::string)
{
  return false;
}
```

### Instantiating Your Class

+ Relax, they’re just user defined types!
+ string FirstName; creates a string object
+ FBullCowGame BCGame; works the same way
+ These instances are initialised by “constructors”
+ Instantiating means “creating an instance of”
+ So we’re simply creating a FBullCowGame game instance "BCGame".

```cpp
#include "FBullCowGame.h"

int main()
{...}

void PlayGame()
{
  FBullCowGame BCGame;

  constexpr int NUMBER_OF_TURNS = 5;
  for (int i = 0; i < NUMBER_OF_TURNS; i++)
  {
    std::string Guess = GetGuess();
    std::cout << "Your guess was: " << Guess << std::endl;
    std::cout << std::endl;
  }
}
```

### Writing & Using Getter Methods

+ Use GetMaxTries to GET number of turns / maxTries
+ Why we never access variables directly
+ How to call a method using the dot operator
+ Pros and cons of initializing in at compile time
+ Using “Rebuild Project” to make VS behave!

Initialize MyMaxTries/MyCurrentTry in FBullCowGame.h at compile time (will later be moved into constructor):

**FBullCowGame.h**
```cpp
class FBullCowGame {
public: ...
private:
	int MyCurrentTry = 1;
	int MyMaxTries = 5;
};
```

Use GetMaxTries/GetCurrentTry Method to access MyMaxTries/MyCurrentTry:

**FBullCowGame.cpp**
```cpp
int FBullCowGame::GetMaxTries() { return MyMaxTries; }
int FBullCowGame::GetCurrentTry() { return MyCurrentTry; }
```

Move the game Instantiating outside of the scope of PlayGame();, so the game instance becomes globally available to all following methods
Use MyMaxTries in main.cpp instead of adding the "magic number" NUMBER_OF_TURNS.
Add MyCurrentTry in GetGuss();

**main.cpp**
```cpp
FBullCowGame BCGame;

int main()
{...}

void PlayGame()
{

  BCGame.GetMaxTries();

  int MaxTries = BCGame.GetMaxTries();
  for (int i = 0; i < MaxTries; i++)
  {
    std::string Guess = GetGuess();
    std::cout << "Your guess was: " << Guess << std::endl;
    std::cout << std::endl;
  }
}

std::string GetGuess()
{
	int CurrentTry = BCGame.GetCurrentTry();

	std::cout << "Try " << BCGame.GetCurrentTry() << ". Enter your guess: ";
	std::string Guess = "";
	std::getline(std::cin, Guess);

	return Guess;
}
```

### Introducing the Const Keyword

+ **const**’s meaning depends on context
+ Generally means “I promise not to change this”
+ What this is depends on exactly where it appears
+ At the end of a member function, for example **int GetCurrentTry() const;** it prevents the function from modifying any member variables
+ This is a good safety feature.

By adding const at the end of a member function of a class, the variable is set at **compile time** and cannot be changed by the member function at **runtime** -> changing value of MyMaxTries = 12 somewhere inside the class member function will now result in an Error: int FBullCowGame::GetMaxTries() const { MyMaxTries = 12; return MyMaxTries; }

**FBullCowGame.h**
```cpp
int GetMaxTries() const;
int GetCurrentTry() const;
bool IsGameWon() const;
```

**FBullCowGame.cpp**
```cpp
int FBullCowGame::GetMaxTries() const { return MyMaxTries; }
int FBullCowGame::GetCurrentTry() const { return MyCurrentTry; }

bool FBullCowGame::IsGameWon() const
{
	return false;
}
```

### Constructors For Initialisation

+ Default constructor called when object created
+ Initialize in constructor when decided at runtime
+ Initialize in declaration if known at compile time
+ Constructor syntax simply: **ClassName()**;
+ Set the member variables in constructor

Add constructor function to headerfile and move private variable Initialization to constructor in FBullCowGame.cpp - before they were initialized at compile time. the constructor now initializes them at runtime. Adding private: int MyCurrentTry = 666; in headerfile will now be overwritten by constructor at runtime!

**FBullCowGame.h**
```cpp
class FBullCowGame {
public:
	FBullCowGame(); // constructor initialize state at BCGame
  ...
private:
  // see FBullCowGame constructor for initialization
  int MyCurrentTry;
	int MyMaxTries;
}
```

**FBullCowGame.cpp**
```cpp
FBullCowGame::FBullCowGame() // constructor initialize state at BCGame start
{
  int MyCurrentTry = 1;
	int MyMaxTries = 5;
}
```

MyCurrentTry and MyMaxTries are now no longer set at compile time - can be BCGame.Reset() at the end of a game to allow the player to play again:

**main.cpp**
```cpp
void PlayGame()
{
	BCGame.Reset();
	int MaxTries = BCGame.GetMaxTries();

	// loop for the number of turns asking guesses
	for (int i = 0; i < MaxTries; i++)
	{
		std::string Guess = GetGuess();
		std::cout << "Your guess was: " << Guess << std::endl;
		std::cout << std::endl;
	}
}
```

The constructor should also just call the Reset() and set the runtime default values:

**FBullCowGame.cpp**
```cpp
FBullCowGame::FBullCowGame() { Reset(); }

void FBullCowGame::Reset()
{
	constexpr int MAX_TRIES = 5;

	MyMaxTries = MAX_TRIES;
	MyCurrentTry = 1;

	return;
}
```

### Pseudocode Programming

+ More on Pseudocode Programming Practice (PPP)
+ Reviewing our code and architecture
+ Using **// TODO** as a comment prefix
+ Introducing Visual Studio’s Task List: View/Task List -> all your TODOs show up in that list
+ Planning our next wave of coding.

**main.cpp**
```cpp
void PlayGame()
{
	BCGame.Reset();
	int MaxTries = BCGame.GetMaxTries();

	// loop for the number of turns asking guesses
	// TODO change from for- to while-loop once we use try validation
	for (int i = 0; i < MaxTries; i++)
	{
		std::string Guess = GetGuess(); // TODO make loop check validity

		// submit only valid guesses to the game
		// print number of bulls and cows
		std::cout << "Your guess was: " << Guess << std::endl;
		std::cout << std::endl;
	}
	// TODO Summarize game
}
```