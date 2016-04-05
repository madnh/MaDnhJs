title: _.M.repeat
-----

Lặp lại một giá trị n lần

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
        <td>Giá trị lặp lại</td>
    </tr>
    <tr>
        <td><code>times</code></td>
        <td>number</td>
        <td></td>
        <td>Số lần lặp lại, lớn hơn 0</td>
    </tr>
    <tr>
        <td><code>as_array</code></td>
        <td>boolean</td>
        <td>false</td>
        <td>Trả về kết quả dạng mảng</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string</dt><dd>Nếu parameter <code>as_array</code> là true</dd>
    <dt>array</dt><dd>Nếu parameter <code>as_array</code> là false</dd>
</dl>

### Ví dụ
```js
_.M.repeat('a', 5); //'aaaaa'
_.M.repeat('a', 5, true); //['a', 'a', 'a', 'a', 'a']
```