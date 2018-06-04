## Auto-complete plugin in jquery

#### This is an auto-complete jquery plugin. When you use this plugin, you should pass it 3 arguments, includes keyCode, keyChar and sourceData:
* **startKkey**: means the correspond key that when we press the key should the recommend list appear.
* **endKey**: means the correspond key that when we press the key should the recommend list disappear.
* **sourceData**: means the array of list data that appears on the drop down list.

#### How to use:
* import the '[jquery.autoCompleteToken.js](/jquery.autoCompleteToken.js)' file.
* Add the necessary css style that marked in '[style.css](/style.css)' into your file, and your can adjust it as you like.
* Call the plugin for an editable input box everywhere you need.
```js
$("#input").autocompleteToken('{', '}', [A, B, C, D, E, F, G]);
```

#### License
Copyright ©[Summer Dong](https://github.com/Summer-Dong/auto-complete-for-text-input-box)

Licensed under the MIT license.
