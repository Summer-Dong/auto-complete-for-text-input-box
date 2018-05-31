### auto-complete plugin in jquery

#### This is an auto-complete jquery plugin. This plugin should have 3 arguments, includes keyCode, keychar and sourceData.
* **keycode**: means the keycode of key on keyboard that when we press the key should the recommend list pop up.
* **keychar**: means the correspond char that when we press the char should the recommend list pop up.
* **sourceData**: means the array of list data that appears on the drop down list.
#### How to use:
For example
```js
$("#input").autocompleteToken(219, '{', sourceData);
```
