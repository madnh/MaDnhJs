title: _.M.hasDeep
-----

Kiểm tra giá trị ở một độ sâu nào đó của value có tồn tại?

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
        <td><code>object</code></td>
        <td>*</td>
        <td></td>
        <td>Giá trị chứa</td>
    </tr>
    <tr>
        <td><code>deep</code></td>
        <td>
            <ul>
                <li>string: tên giá trị ở mỗi độ sâu, có thể ngăn cách nhau bằng dấu chấm: <strong>.</strong></li>
                <li>string[]: Mảng các tên giá trị ở mỗi độ sâu</li>
            </ul>
        </td>
        <td></td>
        <td>Độ sâu cần kiểm tra</td>
    </tr>
    <tr>
        <td><code>separator</code></td>
        <td>string</td>
        <td>dấu chấm(<strong>.</strong>)</td>
        <td>Ký tự dùng để phân tách parameter <code>deep</code> khi giá trị là một chuỗi</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt><dd></dd>
</dl>

### Ví dụ
```js
var obj = {a: {a1: {a2: true}}, b: 'hihi'};
_.M.hasDeep(obj, 'a.a1'); //true
_.M.hasDeep(obj, 'a.yahoo'); //false
_.M.hasDeep([obj, 123], 1); //true
_.M.hasDeep([obj, 123], 10); //false
```