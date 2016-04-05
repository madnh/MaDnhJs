title: _.M.firstNotEmpty
-----

Trả về giá trị đầu tiên khác rỗng, 0, false của các đối số truyền vào hàm

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
        <td><code>*</code></td>
        <td>*</td>
        <td></td>
        <td>Các giá trị kiểm tra</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>*</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.firstNotEmpty(['', 0, false, 123]); //123
```