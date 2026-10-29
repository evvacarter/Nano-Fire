# Nano Fire 
 nano fire is a firewrok animated website that represent the indian diwali festival vibes the only thing is missing here is sound that i am currently learnig that to implement it with very optimised way so right now its completly done with animation only 

 i just use pure javaScript for core logic and animation and basic html and css for just layout only 


 ## feature 
** sparkler and the main mode ** here you move your mouse or drag your finger across the screen to create a glowing and sparkling animation 

** sky short mode ** here you have to tap anywhere on the screen to launch a rocket or skyshort the go straight up and blast with spark and generate a tiny sound also .

** sound ** instead of using mp3 download i decided to generate the sound inside browser using code that gave 0.001 % load on my cpu and no extra lag or delay issue 

** theme swithcer ** i added 4 different wallpape that are totally copyright free becouse i use if from copy right free platform like unsplash (https://www.unsplash.com)and added a new pure black theme option to go to previous mode 

** font style ** i used Orbitron font with transpaent buttons that dont get in the way of firework 

## let me explain how its works 
 
so basic layout should be done with html canvas it draws all the firework particles directly without heavy external libraries like three.js 

and javascript handles the physics like gravity speed color and fade 

for performance i used object pooling instead of creating or deleting hundred of particles every seconds 

sound feature is enables with the help of web audio api its sync a deep pop sound using code oscillator . no audio files to load.

design are done with css and google fonts like outfitt and orbitron fonts with glassmorphisam blur and fire gradient text 

all wallpaper taken from unsplash (https://unsplash.com) under the unsplash license its completly free for personal project ,, no copyright strikes .

## step to run it locally 

open your terminal and paste the clone repositry prompt the link is here 
```bash
   git clone https://github.com/evvacarter/Nano-Fire.git.
```
here you found a index.html just tap on this and run using any extension like live server live preview anyone you want 

thats it all about nano fire made with hardwork and love 