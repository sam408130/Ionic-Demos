# Cava Menu: a restaurant menu app
This ionic app displays the restaurany menu from here: [Take Away Menu](http://www.cavarestaurant.ie/download/CavaTakeAwayMenu_web.pdf).
It is only for teaching purposes.

## Branches
The branches just show the project in various stages.

**master:** The master branch contains the original code created by ionic from the *sidemenu* template.

**cleanup:** The cleanup branch simply removes all of the files that ionic created that we don't need, and changes the others into the format that we want.

**static:** The static branch displays the menu, dynamically changing from sub-menu to sub-menu, but the dishes are hard-coded into the HTML.

**icon:** The icon branch adds an icon.

**controller:** The controller branch moves the data about the dishes to the controller, with the result that the template becomes much smaller.

**nameicon:** The nameicon branch updates the icon, and changes the app's display name.

## Exercises
These are based on the nameicon branch.

1. Change the menu to display the dishes as cards, rather than list items. Google "ionic cards".

2. Add images to the cards that are displayed. You can just find images for the dishes online.

3. Add calorie counts to the dishes. You can just guess the calorie counts for each of the dishes.

4. Move the dishes data to a file called services.js in the js directory. Include it in index.html and tell controllers.js to use it.

5. Create a mini-webserver to feed the data to your app in JSON format.
