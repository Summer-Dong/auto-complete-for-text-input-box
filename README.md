## Auto-complete plugin in jquery

[![release](https://img.shields.io/github/release/Summer-Dong/auto-complete-for-text-input-box.svg)](https://github.com/Summer-Dong/auto-complete-for-text-input-box/releases/latest)

![image](/src/example.gif)
#### How to use:
* import jquery source file, in this project, the jquery version is `1.7.1`, but please note that if your jquery version is higher than this, there are some API were removed, like `jquery.brower`, see more detail in jquery spec and find your ways to fix it.
* import the '[jquery.autoCompleteToken.js](/src/jquery.autoCompleteToken.js)' file.
* Add the necessary css style that marked in '[style.css](/src/style.css)' into your file, and you can adjust it as you like.
* Call the plugin for an editable input box everywhere you need, for example:
```js
$("#input").autoCompleteToken('{', '}', [A, B, C, D, E, F, G]);
```

#### License
Copyright ©[Summer Dong](https://github.com/Summer-Dong/auto-complete-for-text-input-box)

Licensed under Apache license.
