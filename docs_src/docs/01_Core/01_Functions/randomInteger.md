title: _.M.randomInteger
-----

Tạo số nguyên ngẫu nhiên trong khoảng cho phép, bao gồm giới hạn trên

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
        <td><code>min</code></td>
        <td>number</td>
        <td></td>
        <td>Giá trị thấp nhất</td>
    </tr>
    <tr>
        <td><code>max</code></td>
        <td>number</td>
        <td>0</td>
        <td>Giá trị cao nhất</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>number</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.randomInteger(10); //2
_.M.randomInteger(0, 10); //10
_.M.randomInteger(5, 10); //6
_.M.randomInteger(20, 8); //15
_.M.randomInteger(8, 15); //8
```