title: _.M.defineObject
-----

Tạo, định nghĩa và trả về object với các property. Các property của object không thể change, có thể đếm được (enumerable)

### Tham số
<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Kiểu dữ liệu</th>
        <th>Tham số tùy chọn và giá trị mặc định</th>
        <th>Mô tả</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>properties</code></td>
        <td>object</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>{}</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
var obj = _.M.defineObject({
    name: 'Manh',
    old: 123,
    hello: function(){
        alert('Hello ' + this.name);
    }
});

console.log(obj); //{name: 'Manh', old: 123}
obj.old = 10;
console.log(obj); //{name: 'Manh', old: 123}

_.each(obj, function(value, key){
    console.log(key, '=>', value);
});
//name => Manh
//old => 123
```