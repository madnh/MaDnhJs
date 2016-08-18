title: _.M.valueAt
-----

Trả về giá trị tại một vị trí của array, hỗ trợ lấy các giá trị tại các vị trí âm và lớn hơn số lượng của array

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
        <td>
            <ul>
                <li>string</li>
                <li>number</li>
                <li>array</li>
            </ul>
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td><code>index</code></td>
        <td>number</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>*</dt><dd></dd>
</dl>

### Ví dụ
```js
var arr = ['a', 'b', 'c'];
var str = 'Yahoo';

_.M.valueAt(arr, 1); //'b'
_.M.valueAt(arr, 4); //'b'
_.M.valueAt(arr, -1); //'c'
_.M.valueAt(arr, -2); //'b'
_.M.valueAt(str, 2); //'h'
_.M.valueAt(str, -2); //'o'
```
