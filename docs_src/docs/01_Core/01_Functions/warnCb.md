title: _.M.warnCb
-----

Tạo callback <code>console.warn</code> với description là argument đầu tiên

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

### Ví dụ
```js
var cb = _.M.warnCb('Test 1');

cb(1,2,3); // Console warn as: 'Test 1' 1 2 3
```