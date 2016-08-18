title: _.M.isDebugging
-----

Kiểm tra có đang trong quá trình test của một chủ đề nào đó

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
        <td>string</td>
        <td>null</td>
        <td>Chủ đề test, mặc định là tất cả các chủ đề</td>
    </tr>
    </tbody>
</table>

### Kết quả trả về
<dl class="dl-horizontal">
    <dt>boolean</dt><dd></dd>
</dl>

### Ví dụ
```js
_.M.debugging('home');
_.M.isDebugging('home'); //true
```
```js
_.M.debugging();//Debug all of types
_.M.isDebugging('home'); //true
```

