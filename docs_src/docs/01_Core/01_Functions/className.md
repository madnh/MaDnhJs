title: _.M.className
-----

Trả về constructor name của một object instance


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
        <td><code>obj</code></td>
        <td>*</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>constructor_only</code></td>
        <td>boolean</td>
        <td><var>false</var></td>
        <td>Chỉ trả về tên của constructor</td>
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
_.M.className(_.App); //"[object Object]"
_.M.className(_.App, true); //EventEmitter
_.M.className(new _.M.EventEmitter(), true); //EventEmitter
```
