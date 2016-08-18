title: _.M.getDebugString
-----

Trả về chuỗi dạng JSON của một array, dùng khi tạo ra nội dung để truyền vào console.

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
        <td><code>details</code></td>
        <td>array</td>
        <td></td>
        <td>Mảng các nội dung</td>
    </tr>
    <tr>
        <td><code>glue</code></td>
        <td>string</td>
        <td><code>\n</code></td>
        <td>Chuỗi phân tách các phần tử của array</td>
    </tr>
    </tbody>
</table>

### Ví dụ
Bình thường
```js
//At somewhere
var name = "Tom", old = 25;
_.M.onDebugging('user', (function(tmp_name, tmp_old) {
  console.log('Name:', tmp_name);
  console.log('Old', tmp_old);
})(name, old));
```

Sử dụng <code>_.M.getDebugString</code>

```js
//At somewhere
var name = "Tom", old = 25;
_.M.onDebugging('user', _.M.logCb(_.M.getDebugString([
    'Name: ' + name,
    'Old: ' + old
])));
```
