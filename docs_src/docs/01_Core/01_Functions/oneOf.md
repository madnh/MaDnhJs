title: _.M.oneOf
-----

Đảm bảo một giá trị là một trong phần tử trong một mảng

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
        <td><code>value</code></td>
        <td>*</td>
        <td></td>
        <td>Giá trị cần kiểm tra</td>
    </tr>
    <tr>
        <td><code>values</code></td>
        <td>array</td>
        <td></td>
        <td>Mảng các giá trị khả dĩ</td>
    </tr>
    <tr>
        <td><code>default_value</code></td>
        <td>*</td>
        <td>*</td>
        <td>Giá trị mặc định của <code>value </code> khi không tìm thấy trong <code>values</code></td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>*</dt>
    <dd>
        <ul>
            <li>Tìm thấy: <code>value</code></li>
            <li>Không tìm thấy:
                <ul>
                    <li><code>default_value</code>: không tìm thấy <code>value</code> trong <code>values</code></li>
                    <li>Phần tử đầu tiên của <code>values</code>: không dùng parameter <code>default_value</code></li>
                </ul>
            </li>
        </ul>
    </dd>
</dl>

### Ví dụ
```js
var items = [1,2,3,'a'];
_.M.oneOf(1, items); // 1
_.M.oneOf('a', items); // 'a'
//
_.M.oneOf(0, items); // 1
//
_.M.oneOf(1, items, 'FOO'); // 1
_.M.oneOf('b', items, 'FOO'); // 'FOO'
```
