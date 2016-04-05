title: _.M.isPrimitiveType
-----

Kiểm tra object là kiểu dữ liệu nguyên thủy - <code>null</code> <code>string</code> <code>number</code> <code>boolean</code>?

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
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.isPrimitiveType(123); //true
_.M.isPrimitiveType('123'); //true
_.M.isPrimitiveType(null); //true
_.M.isPrimitiveType(); //true
_.M.isPrimitiveType(_.App); //false
```