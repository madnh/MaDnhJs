title: _.M.errorCb
-----

Tạo callback <code>console.error</code> với description là argument đầu tiên

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
        <td><code>description</code></td>
        <td>string</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>arguments</code></td>
        <td>*</td>
        <td>*</td>
        <td>Các đối số tương tự như console.log, không hạn chế</td>
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
var cb = _.M.errorCb('Test 1');

cb(1,2,3); // Console error as: 'Test 1' 1 2 3
```