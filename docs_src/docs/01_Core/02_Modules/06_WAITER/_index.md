Lưu trữ các callback, gọi callback bằng key.
<ul>
    <li>Lưu callback, gọi bằng key, hỗ trợ parameters</li>
    <li>Gọi callback từ DOM, vd: các thuộc tính href, onclick,...</li>
</ul>

```js
var key = _.M.WAITER.add(function(name){
    console.log('Hi,', name);
});
//"waiter_key_0"
_.M.WAITER.run(key, 'Manh');
//Hi, Manh
```

Gọi callback từ DOM
```js
var key = _.M.WAITER.createFunc(function(name){
    console.log('Hi,', name);
});
var tag_a = '<a href="javascript:'+key+'(\'Manh\')">Yahoo</a>';
```