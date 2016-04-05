title: _.M.toggle
-----

Thêm/xóa các phần tử của mảng

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
        <td><code>array</code></td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>elements</code></td>
        <td>array</td>
        <td></td>
        <td>Mảng các phần tử cần thêm/xóa</td>
    </tr>
    <tr>
        <td><code>status</code></td>
        <td>boolean</td>
        <td><code>undefined</code></td>
        <td>
            <ul>
                <li><strong>boolean:</strong> true/false -> thêm/xóa</li>
                <li><strong>undefined:</strong> xóa nếu đã có, thêm nếu chưa có</li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>array</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
var arr = ['A', 'B', 'C', 'D'];

_.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
_.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
_.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
```