---
title: Unreal Engine Coding Standards (Part II)
subTitle: The Unreal Engine Developer Course - Learn C++ & Make Games. Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
category: "C++"
date: 2017-06-17
cover: photo-34221455520_6e72413b0c_o-cover.jpg
hero: photo-34221455520_6e72413b0c_o.jpg
---

![Unreal Engine Coding Standards](./photo-34221455520_6e72413b0c_o.jpg)


> Learn C++ from scratch. How to make your first video game in Unreal engine. Gain confidence in programming.
> This is a fork of the Part I of the first section of the [Unreal Course](https://github.com/UnrealCourse) teaching C++ coding standards for the Unreal Game Engine.
> The Source Code can be found in [consoleApplication](https://github.com/mpolinowski/consoleApplication)
> The following is the commented Course Journal:


### Variables and cin for Input

+ Introducing pseudocode programming - add a comment to describe the function before you start programming
+ Why we need to **#import \<string\>**
+ Getting input using **cin**
+ cin breaks consuming input at space - you cannot input more then 1 word

```cpp
// string library is needed for the ">>" operator
#include <string>

int main()
{
  // introduce the game
  // ...

  // get a guess from player
  cout << "Enter your guess: ";
  string Guess = "";
  cin >> Guess;

  // return guess to player
  cout << "Your guess was: " << Guess << endl;

  cout << endl;
  return 0;
}
```

### Using getline()

+ Solve the problem that you cannot enter a guess with more then one word
+ **getline()** reads through spaces and discards input stream @endl
+ Where to find C++ documentation => www.cplusplus.com

```cpp
int main()
{
  // introduce the game
  // ...

  // get a guess from player
  cout << "Enter your guess: ";
  string Guess = "";
  getline (cin,Guess);

  // return guess to player
  cout << "Your guess was: " << Guess << endl;

  cout << endl;
  return 0;
}
```

### Simplifying With Functions

+ Programming is all about managing complexity.
+ We want to think about a few things at a time.
+ The idea of abstraction and encapsulation -> the scope of the constexpr WORD_LENGTH is now limited to the PrintIntro function.
+ Always use **return** at the end of your functions.

+ Wrap the code Intro code into function to make our code more readable.
+ The PrintIntro() then be called from within main()

*PrintIntro* function:

```cpp
void PrintIntro()
  {
    // introduce the game
    constexpr int WORD_LENGTH = 9;
    cout << "Welcome to Bulls and Cows" << endl;
    cout << "Can you guess the << WORD_LENGTH;
    cout << " letter isogram I'm thinking of?/n";
    cout << endl;
    return;
  }

  //Entry point of application
  int main()
  {
    // introduce the game
    PrintIntro ();

    // get a guess from player
    // ...

    // return guess to player
    // ...

    return 0;
  }
```

The collection of functions used by main() should be at the end of the document. We have to put the identifier for the function PrintIntro() on top of the document. This way we can put the body PrintIntro(){} below main()

```cpp
void PrintIntro():

//Entry point of application
int main()
{
  // introduce the game
  PrintIntro ();

  // get a guess from player
  // ...

  // return guess to player
  // ...

  return 0;
}

void PrintIntro()
  {
    // introduce the game
    constexpr int WORD_LENGTH = 9;
    cout << "Welcome to Bulls and Cows" << endl;
    cout << "Can you guess the << WORD_LENGTH;
    cout << " letter isogram I'm thinking of?/n";
    cout << endl;
    return;
  }
```

This makes it easy to spot main() inside the document. Descriptive identifier for each function inside main() make our code readable / **self-documenting**

Repeat this process with all other functions inside main():

```cpp
void PrintIntro():
string GetGuessAndPrintBack();

//Entry point of application
int main()
{
  PrintIntro ();
  GetGuessAndPrintBack ();
  return 0;
}

// introduce the game
void PrintIntro() {...}

// get a guess from player and print back
string GetGuessAndPrintBack()
{
  cout << "Enter your guess: ";
  string Guess = "";
  getline(cin, Guess);
  //print guess back to player
  cout << "Your guess was: " << Guess << endl;
  return Guess;
}
```