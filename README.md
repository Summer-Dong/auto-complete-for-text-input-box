## Auto-complete plugin in jquery

#### This is an auto-complete jquery plugin. When you use this plugin, you should pass it 3 arguments, includes keyCode, keyChar and sourceData:
* **keyCode**: means the keycode of key on keyboard that when we press the key should the recommend list pop up.
* **keyChar**: means the correspond char that when we press the char should the recommend list pop up.
* **sourceData**: means the array of list data that appears on the drop down list.
#### Example
```js
$("#input").autocompleteToken(219, '{', sourceData);
```
