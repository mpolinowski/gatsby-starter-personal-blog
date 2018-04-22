---
title: Unreal Engine Coding Standards (III)
subTitle: The Unreal Engine Developer Course - Learn C++ & Make Games. Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
category: "C++"
date: 2017-06-17
cover: photo-34477006171_65093dd884_o-cover.jpg
hero: photo-34477006171_65093dd884_o.jpg
---

![Unreal Engine Coding Standards](./photo-34477006171_65093dd884_o.jpg)


> Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
> This is a fork of the Part I of the first section of the [Unreal Course](https://github.com/UnrealCourse) teaching C++ coding standards for the Unreal Game Engine.
> The Source Code can be found in [consoleApplication](https://github.com/mpolinowski/consoleApplication)
> The following is the commented Course Journal:


<!-- TOC -->

- [Iterating With For & While Loops](#iterating-with-for--while-loops)
- [Clarity is Worth Fighting For](#clarity-is-worth-fighting-for)
- [Booleans and comparisons](#booleans-and-comparisons)
- [Using do and while in C++](#using-do-and-while-in-c)

<!-- /TOC -->


### Iterating With For & While Loops

+ Use loops to prevent typing the same code repeatedly
+ When to use **for** vs **while** -> "When you know what you in **FOR**" / "When you are looping for a **WHILE**" -> use for-loop when you know the number of loops at compile time.
+ The syntax of a for-loop: **for** (**Initialization**: count = 1; **Condition**: count <= limit; **Increase**: count = count +1) {**Statement**}
+ Think carefully about the first & last loop.
+ Write a **for** loop to repeat the game.

```cpp
int main()
{
  // introduce the game
  PrintIntro ();

  // get a guess from player and loop for number of turns
  constexpr int NUMBER_OF_TURNS = 5;

  for (int i = 0; i < NUMBER_OF_TURNS; i++)
	{
		GetGuessAndPrintBack();
    cout << endl;
	}

  return 0;
}
```

**Useful Links**
+ \* [www.cplusplus.com](http://www.cplusplus.com/doc/tutorial/control)
+ \* [msdn.microsoft.com](https://msdn.microsoft.com/en-us/library/b80153d8.aspx)

### Clarity is Worth Fighting For

+ More about levels of abstraction.
+ A word on being clever.
+ Using Visual Studio’s Extract “Extract Function”
+ What a header file (.h) is.
+ What’s refactoring, and why we do it.
+ Removing side-effects.
+ Where to find the course code. [UnrealCourse](http://www.unrealcourse.com/) & [Github.com](https://github.com/UnrealCourse)

Encapsulate for-loop in PlayGame() to clean up main():

```cpp
void PrintIntro();
void PlayGame():
string GetGuessAndPrintBack();

int main()
{
  PrintIntro ();
  PlayGame ();

  return 0; //Exit application
}

void PlayGame()
{
  // get a guess from player and loop for number of turns
  constexpr int NUMBER_OF_TURNS = 5;
  for (int i = 0; i < NUMBER_OF_TURNS; i++)
	{
		GetGuessAndPrintBack();
    cout << endl;
	}
}
```

All functions should only do one thing - removing PrintBack from GetGuess:

```cpp
void PlayGame()
{
  // get a guess from player and loop for number of turns
  constexpr int NUMBER_OF_TURNS = 5;
  for (int i = 0; i < NUMBER_OF_TURNS; i++)
	{
		GetGuess();
    string Guess = GetGuess();
    cout << "Your guess was: " << Guess << endl;
	}
}

string GetGuess()
{
  cout << "Enter your guess: ";
  string Guess = "";
  getline(cin, Guess);
  return Guess;
}
```
To rename all instances of a function identifier in VisualStudio, select it and press **CTRL+R** twice!

### Booleans and comparisons

+ What a boolean is, and how to use it.
+ Only use when completely clear what you mean.
+ Use **==** for comparison.
+ Use **&&** for logical AND.
+ Use **||** for logical OR.
+ Use **[n]** to access a string, starting at n=0.
+ Use **‘ ‘** for characters, and **“ “** for strings.

Add true/false boolean for asking to restart the game after a completed run.

```cpp
void PrintIntro();
void PlayGame():
string GetGuessAndPrintBack();
bool AskToPlayAgain();

int main()
{
  PrintIntro ();
  PlayGame ();
  AskToPlayAgain();

  return 0; //Exit application
}

bool AskToPlayAgain()
{
  cout << "Do you want to play again? y/n ";
  string Response = "";
  getline(cin, Response);

  return (Response[0] == 'y') || (Response[0] = 'Y');
}
```

Response[0] takes the first character from the Response string. Compare to character y/Y and return true or false.

### Using do and while in C++

+ A **do while** loop is: do {code to repeat} while (condition);
+ A do/while code is always executed at least once and repeated until the condition is reached.
+ Making our game play multiple times.

```cpp
int main()
{
  bool bPlayAgain = false;

  do
  {
    PrintIntro ();
    PlayGame ();
    bPlayAgain = AskToPlayAgain();
  }

  while (bPlayAgain);

  return 0;
}
```

The boolean bPlayAgain is set to **false** at the beginning of the loop - AskToPlayAgain sets it to **true** if player types "yes".
The do/while loop is repeated until while is set to false.