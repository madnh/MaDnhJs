title: _.M.randomString
-----

Tạo chuỗi ngẫu nhiên

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
        <td><code>length</code></td>
        <td>number</td>
        <td></td>
        <td>Số lượng ký tự</td>
    </tr>
    <tr>
        <td><code>chars</code></td>
        <td>string</td>
        <td><code>"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"</code></td>
        <td>Chuỗi các ký tự nguồn</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string</dt>
    <dd></dd>
</dl>

### Ví dụ
```js
_.M.randomString(10); //'mYJeC1xBcl'
_.M.randomString(10, 'ABCDEF'); //'CDABBEFADE'
```