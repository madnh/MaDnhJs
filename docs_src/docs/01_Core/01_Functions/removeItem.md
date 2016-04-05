title: _.M.removeItem
-----

Xóa các item của một object

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
        <td><code>obj</code></td>
        <td>object</td>
        <td></td>
        <td>Object chứa các item cần xóa</td>
    </tr>
    <tr>
        <td><code>items</code></td>
        <td>
            string[]/ nhiều đối số là string hoặc là một callback
        </td>
        <td></td>
        <td>
            Mảng tên các item hoặc callback. <br>
            Callback nhận các đối số: <code>item value</code>, <code>item key</code>, <code>obj</code> và trả về
            true/false sẽ xóa/giữ item
        </td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string[]</dt>
    <dd>Tên các item đã xóa</dd>
</dl>

### Ví dụ
Object
```js
var object = {
    foo: 'A',
    baz: 'B',
    bar: 'C',
    cee: 5,
    deep: true
};
```

Xóa bằng mảng các item name
```js
_.M.removeItem(object, ['baz', 'bar']);
```

Xóa bằng nhiều đối số
```js
_.M.removeItem(object, 'baz', 'bar');
```

Xóa bằng callback
```js
_.M.removeItem(object, function(value, key, obj){
    return -1 !== ['baz', 'bar'].indexOf(key);
})
```
