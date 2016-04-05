title: _.M.nextID
-----

Trả về ID tiếp theo của một danh mục

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
        <td><code>type</code></td>
        <td>string/number</td>
        <td><code>"unique_id"</code></td>
        <td>Danh mục</td>
    </tr>
    <tr>
        <td><code>type_as_prefix</code></td>
        <td>boolean</td>
        <td>true</td>
        <td>Dùng danh mục như là tiền tố của ID trả về</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>number</dt><dd>ID hiện tại</dd>
    <dt>string</dt><dd>ID hiện tại và tiền tố</dd>
</dl>

### Ví dụ
```js
_.M.nextID(); //unique_id_0
_.M.nextID(); //unique_id_1
_.M.nextID(null, false); //2
_.M.nextID('superman'); //superman_0
_.M.nextID('superman'); //superman_1
_.M.nextID(); //unique_id_3
_.M.nextID('superman', false); //2
```