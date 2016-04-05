title: _.M.chunks
-----

Chia array thành n array nhỏ

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
        <td><code>chunks</code></td>
        <td>number</td>
        <td></td>
        <td>Số lượng các chunks</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>array</dt>
    <dd>Mảng các mảng con đã chia</dd>
</dl>

### Ví dụ
```js
var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

_.M.chunks(arr, 3)
=> [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9]
]
```