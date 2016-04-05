title: _.M.minMax
-----

Đảm bảo giá trị chỉ trong một khoảng cho phép (bao gồm cả 2 giá trị đầu/cuối của khoảng cho phép)

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
        <td>number</td>
        <td></td>
        <td>Giá trị cần xử lý</td>
    </tr>
    <tr>
        <td><code>min</code></td>
        <td>number</td>
        <td></td>
        <td>Giá trị nhỏ nhất</td>
    </tr>
<tr>
    <td><code>max</code></td>
    <td>number</td>
    <td></td>
    <td>Giá trị lớn nhất</td>
</tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>number</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.minMax(10, -15, 50); //10
_.M.minMax(10, 20, 50); //20
_.M.minMax(100, 20, 50); //50
```