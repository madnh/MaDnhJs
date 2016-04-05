title: _.M.warnArgs
-----

Tương tự <code>console.warn</code>

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
        <td><code>arguments</code></td>
        <td>*</td>
        <td>*</td>
        <td>Các đối số tương tự như <code>console.warn</code>, không hạn chế</td>
    </tr>
    </tbody>
</table>

### Ví dụ
```js
var args = [1,2,3,4];

_.M.warnArgs('a',123);
_.M.warnArgs.apply(null, args);
```