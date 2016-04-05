title: _.M.defineConstant
-----

Khai báo một hằng số của MaDnh

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
        <td>
            <ul>
                <li>string</li>
                <li>object</li>
            </ul>
        </td>
        <td></td>
        <td>
            Tên constant hoặc object chứa tên và value của các constant (khai báo nhiều constant)<br>
            Tên constance sẽ tự động chuyển về dạng UPPERCASE
        </td>
    </tr>
    <tr>
        <td><code>value</code></td>
        <td>*</td>
        <td>undefined</td>
        <td>Giá trị của constant, bỏ qua parameter này khi <code>name</code> là object</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt></dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.defineConstant('TEST', 123) => _.M.TEST = 123
_.M.defineConstant({
    X: function(){alert('Yahooo');},
    y: false
});
_.M.X(); //Yahooo
```