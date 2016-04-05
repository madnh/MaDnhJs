title: _.M.isDefinedConstant
-----

Kiểm tra một hằng số của MaDnh có được khai báo chưa

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
        <td><code>name</code></td>
        <td>string</td>
        <td></td>
        <td>Tên constant, không phân biệt HOA/thường</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.isDefinedConstant('VERSION') => true
_.M.isDefinedConstant('vERsIoN') => true
_.M.isDefinedConstant('TEST') => false
```