---
title: Windows Control
subTitle: "Every time Microsoft decides to take control away from us users, I am one step closer to permanetly switch to LINUX #DELETEWINDOWS"
category: "Windows"
date: 2017-07-07
cover: photo-11627014666_359f04f9db_o-cover.png
hero: photo-11627014666_359f04f9db_o.png
---

![Hokkaido, Abashiri](./photo-11627014666_359f04f9db_o.png)


> This is my Angry-Blog - every time I run into an undesired Windows feature, I want to use this space to unload my emotional ballast. My wording might therefore be slightly more colorful than usual. Readers discretion is advised.



<!-- TOC -->

- [Prevent Auto-Reboot](#prevent-auto-reboot)

<!-- /TOC -->


## Prevent Auto-Reboot

Windows Updates are important and sometimes require you to reboot. Some Operating systems are able to gracefully shutdown and reboot restoring all programs that were running - __WINDOWS CANNOT__. But still, Windows keeps rebooting... And everytime I keep my PC running over night there is a perfectly good reason for me to do that!

How to stop your PC from automatically restarting after installing updates. First I tried the task scheduler:

1. Open __Start__.
2. Search for `Task Scheduler` and click the result to open the tool.
3. Right-click the __Reboot task__ and select Properties (note that it was already set to disabled).


![Windows 10 Whisperer](./win10_01.png)


4. Go to the __Triggers__ tab, uncheck __enabled__ and confirm (this should prevent the task from being executed).


![Windows 10 Whisperer](./win10_02.png)
![Windows 10 Whisperer](./win10_03.png)


5. But it seems that my administrator account does not have the rights to do that (?????????????????)


![Windows 10 Whisperer](./win10_04.png)


6. Also deleting (right-click on __Reboot__ and choose __delete__) the complete task fails.


![Windows 10 Whisperer](./win10_05.png)


7. Use __Run__ (Windows key + R keyboard shortcut to open the Run command) and type in `%windir%\System32\Tasks\Microsoft\Windows\UpdateOrchestrator` and confirm.


![Windows 10 Whisperer](./win10_06.png)


8. Rename the Reboot file to `Reboot.bak` and create a folder called `Reboot`.


![Windows 10 Whisperer](./win10_07.png)

![Windows 10 Whisperer](./win10_08.png)