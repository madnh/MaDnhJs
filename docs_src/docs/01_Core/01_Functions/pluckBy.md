title: _.M.pluckBy
-----

Giống hàm `_.pluck` nhưng hỗ trợ thêm filed dùng làm key

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
        <td><code>collection</code></td>
        <td>[]</td>
        <td></td>
        <td>Mảng các object</td>
    </tr>
    <tr>
        <td><code>key_field</code></td>
        <td>string</td>
        <td></td>
        <td>Tên field chứa giá trị dùng làm key của object result. Nếu field không tìm thấy sẽ dùng chuỗi `undefined`</td>
    </tr>
    <tr>
        <td><code>value_field</code></td>
        <td>string</td>
        <td></td>
        <td>Tên field chứa giá trị dùng làm value của object result. Nếu field không tìm thấy sẽ dùng chuỗi `undefined`</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>{}</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
var stooges = [{name: 'moe', id: 1, age: 40}, {name: 'larry', id: 2, age: 50}, {name: 'curly', id: 4, age: 60}];
_.M.pluckBy(stooges, 'id', 'name');
=> {1: "moe", 2: "larry", 4: "curly"}
```