title: _.M.isInstanceOf
-----

Kiểm tra object có phải là instance của một class?

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
        <td>*</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>class_name</code></td>
        <td>string</td>
        <td></td>
        <td>Tên class</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.isInstanceOf(_.App, 'EventEmitter');//true
_.M.isInstanceOf(123, 'Object'); //false
_.M.isInstanceOf(123, 'Number'); //true
_.M.isInstanceOf('123', 'String'); //true
_.M.isInstanceOf(new _.M.EventEmitter(), 'EventEmitter'); //true
```
