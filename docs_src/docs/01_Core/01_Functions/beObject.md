title: _.M.beObject
-----

Đảm bảo đối số truyền vào là object hoặc là tên và giá trị của một field của object

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
        <td><code>object/name</code></td>
        <td>*</td>
        <td></td>
        <td>Object cần kiểm tra. Nếu parameter <code>value</code> được gán sẽ dùng như string -> tên của field của object</td>
    </tr>
    <tr>
        <td><code>value</code></td>
        <td>*</td>
        <td>*</td>
        <td>Giá trị của field của object</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>object</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.beObject(); //{}
_.M.beObject('yahoo'); //{}
_.M.beObject(235); //{}
_.M.beObject('yahoo', 123); //{yahoo: 123}
_.M.beObject({yahoo: 123, goooo:'ASDWd'}); //{yahoo: 123, goooo:'ASDWd'}
```
