title: _.M.isLikeString
-----

Kiểm tra một giá trị là chuỗi hoặc số

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
_.M.isLikeString('yahoo'); // true
_.M.isLikeString(123); // true
_.M.isLikeString({}); // false
_.M.isLikeString(true); // false
```