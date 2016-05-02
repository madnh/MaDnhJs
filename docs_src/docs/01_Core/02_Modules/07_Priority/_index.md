Lưu trữ, truy xuất thông tin theo độ ưu tiên

```js
var callbacks = new _.M.Priority();

callbacks.addContent(function(){
    console.log('callback 1');
});
callbacks.addContent(function(){
    console.log('callback 2');
}, _.M.PRIORITY_HIGH);

_.each(callbacks.getContents(true), function(cb){
    cb();
});
=> callback 2
=> callback 1
```