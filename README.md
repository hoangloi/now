# Point terminal to folder 

`npm install`

## HTML files

add `file.html` to `src/include` folder

use `<!--=include header.html -->` to include file in `index.html`

if you use tag `<comment>content</comment>`,`/*content*/`, `<!--content-->` (do not have white space) it will clean this.

if you want use file `file.(format)?version=1` code will replace 1 -> current time

## CSS files

add `file.scss` to `src/sass` folder

it will auto generation to dist/css.

## JS files

you can free add js file in `src/script`

## run

just use `gulp watch` from terminal and live edit HTML, SASS, JS files

Let's Enjoy