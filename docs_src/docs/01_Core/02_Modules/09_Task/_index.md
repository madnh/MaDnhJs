Thực hiện các xử lý trên một dữ liệu. Một task có thể bao gồm nhiều task khác.

### Khai báo dạng instance
```js
var t1 = new _.M.Task();

t1.name = 't1';
t1.handler = function(data, success_cb, error_cb){
    if(_.isString(data)){
        success_cb(data + '_t1');
    }else{
        error_cb('Data must be a string');
    }
}
t1.process('123');
if(t1.isError()){
    alert('Error:' + t1.getError().message);
} else {
    alert('Result: ' + t1.getResult());
}
```

### Đăng ký Task bằng name và handler
```js
_.M.Task.register(t1);
_.M.Task.register('t2', function(data){
    if(_.isString(data)){
        this.setProcessResult(data + '_t2');
    }else{
        this.setProcessError('Data must be a string');
    }
});
```

### Đăng ký một task bao gồm nhiều tasks khác
Khi thực thi, kết quả của task trước sẽ là dữ liệu của task sau. Trong quá trình thực thi, nếu kết quả xử lý của một
task là lỗi thì quá trình xử lý sẽ được dừng lại. Kết quả của task cuối cùng hoặc error trong quá trình xử lý các task sẽ là kết quả/error của task cha.
```js
_.M.Task.register('test', ['t1', 't2']);
```

### Sử dụng task đã được đăng ký
```js
var task = _.M.Task.factory('test');
if(task.process('123')){
    alert('Result: ' + task.getResult());
}else{
    alert('Error: ' + task.getError().message);
}
```