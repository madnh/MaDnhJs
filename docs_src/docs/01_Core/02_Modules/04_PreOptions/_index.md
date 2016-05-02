Quản lý các options được định nghĩa trước

```js
_.M.PreOptions.define('test', {name: 'M'});
function Test(){
    this.options = _.M.PreOptions.get('test');
}

var test = new Test();
alert(test.options.name);
```