title: _.M.isMultiple
-----

Kiểm tra một số có chia hết cho số khác?

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
        <td><code>number_1</code></td>
        <td>number</td>
        <td></td>
        <td>Số bị chia</td>
    </tr>
    <tr>
        <td><code>number_2</code></td>
        <td>number</td>
        <td></td>
        <td>Số chia</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.isMultiple(12, 3); //true
_.M.isMultiple(12, 5); // false
_.M.isMultiple(12, '4'); // true
_.M.isMultiple(12, 0); //false
```