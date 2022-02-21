# generals.io tools

## Overview
These tools assist you in playing the game by bringing your attention to, and maintaining an easily visible trace of, potentially useful information. Everything is done in client-side Javascript.

## To use
Before the game starts, copy/paste the code in `main.js` into your browser console (can be found via right-click => inspect element => some form of 'console' area) and run the code.

## Instructions
- Squares bounded by a solid white border denote confirmed locations of generals (taken or not).
- Light-colored foggy squares are squares you've "seen" (previously unfogged) without a general. By contrast, dark-colored foggy squares have not been "seen" - so there might be an opposing general! This is to help you remember where you've explored.
- Mountains you've "seen" permanently stay seen, so you know they're not cities.
- Cities you've seen that have since been fogged up have solid borders with the color of the last player who controlled that city.
- The stars column has been replaced with by an estimate of how many cities each player controls.

## Other things
If you want to contribute or have any feature requests, feel free to make a pull request! Or bring up an issue.
