title: _.M.errorArgs
-----

Tương tự console.error

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
        <td>Các đối số tương tự như console.error, không hạn chế</td>
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
var args = [1,2,3,4];

_.M.errorArgs('a',123);
_.M.errorArgs.apply(null, args);
```