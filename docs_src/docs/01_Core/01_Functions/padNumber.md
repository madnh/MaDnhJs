title: _.M.padNumber
-----

Thêm vào number số 0 và dấu

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
        <td><code>number</code></td>
        <td>number</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>place</code></td>
        <td>number</td>
        <td></td>
        <td>Số ký tự bao gồm cả số 0</td>
    </tr>
    <tr>
        <td><code>sign</code></td>
        <td>boolean</td>
        <td>false</td>
        <td>Bao gồm dấu chỉ chiều của number. Nếu <code>number</code> < 0 sẽ bỏ qua parameter này</td>
    </tr>
    <tr>
        <td><code>base</code></td>
        <td>number</td>
        <td>10</td>
        <td>Cơ số của <code>number</code></td>
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
_.M.padNumber(2,2); //"02"
_.M.padNumber(2,15); //"000000000000002"
_.M.padNumber(-2,2) //"-02"
_.M.padNumber(-2,2, true) //"-02"
_.M.padNumber(2,2, true); //"+02"
```