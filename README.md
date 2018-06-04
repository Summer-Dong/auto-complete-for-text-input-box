## Auto-complete plugin in jquery

#### This is an auto-complete jquery plugin. When you use this plugin, you should pass it 3 arguments, includes keyCode, keyChar and sourceData:
* **startKkey**: means the correspond key that when we press the key should the recommend list appear.
* **endKey**: means the correspond key that when we press the key should the recommend list disappear.
* **sourceData**: means the array of list data that appears on the drop down list.
#### Example
```js
$("#input").autocompleteToken('{', '}', [A, B, C, D, E, F, G]);
```
