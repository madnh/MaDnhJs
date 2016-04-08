title: _.M.pairsAsObject
-----

Tương tự hàm `_.pairs` nhưng mỗi phần tử là một object, với cấu trúc `{key: <field key>, value: <field value>}`

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
        <td><code>object</code></td>
        <td>{}</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>array</dt>
    <dd>Mảng các object</dd>
</dl>

### Ví dụ
```js
_.M.pairsAsObject({one: 1, two: 2, three: 3});
=> [{key: 'one', value: 1},{key: 'two', value: 2},{key: 'three', value: 3}]
```