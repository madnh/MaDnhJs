title: _.M.span
-----

Điền ký tự vào chuỗi/số cho đủ chiều dài

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
        <td>
            <ul>
                <li>number</li>
                <li>string</li>
            </ul>
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>length</code></td>
        <td>number</td>
        <td></td>
        <td>Độ dài cuối cùng của <code>value</code> (dạng chuỗi)</td>
    </tr>
    <tr>
        <td><code>span_character</code></td>
        <td>string</td>
        <td></td>
        <td>Ký tự thêm vào</td>
    </tr>
    <tr>
        <td><code>before</code></td>
        <td>boolean</td>
        <td>true</td>
        <td>Thêm vào phía trước của <code>value</code></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.span(123, 5, '_'); //'__123'
_.M.span(123, 5, '_', false); //'123__'
_.M.span('ABCDEF', 5, '_'); //'ABCDEF'
```