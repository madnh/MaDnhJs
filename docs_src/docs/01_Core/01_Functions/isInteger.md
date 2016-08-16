title: _.M.isInteger
-----

Kiểm tra một giá trị có là dạng số và là số nguyên

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
        <td><code>number</code></td>
        <td>number</td>
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
_.M.isInteger(123); //true
_.M.isInteger('123'); //true
_.M.isInteger(123.5); //false
_.M.isInteger(true); //false
_.M.isInteger([]); //false
```
