title: _.M.contentType
-----

Kiểu dữ liệu. Nếu là các dữ liệu nguyên thủy sẽ trả về dạng lowercase, nếu là dạng object sẽ trả về dạng in hoa chữ cái đầu tiên. Nếu là object sẽ trả về tên của object constructor

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
        <td><code>content</code></td>
        <td>*</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>string</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.contentType(123); //number
_.M.contentType('123'); //string
_.M.contentType('Yahooooooo'); //string
_.M.contentType(true); //boolean
_.M.contentType([1,2]); //Array
_.M.contentType({color: 'red'}); //Object
_.M.contentType(_.App); //EventEmitter
```
