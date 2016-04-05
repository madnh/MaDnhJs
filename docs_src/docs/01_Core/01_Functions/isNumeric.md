title: _.M.isNumeric
-----

Kiểm tra một giá trị có là kiểu số học hoặc giá trị số học ở dạng chuỗi

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
    <td><code>value</code></td>
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
_.M.isNumeric(123); //true
_.M.isNumeric(123.5); //true
_.M.isNumeric('123.5'); //true
_.M.isNumeric('123.5 yahoo'); //false
```