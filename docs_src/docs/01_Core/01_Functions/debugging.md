title: _.M.debugging
-----

Đặt tình trạng cho một thể loại test là enable. 

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

### Ví dụ
```js
_.M.debugging('home');
_.M.isDebugging('home'); //true
```
```js
_.M.debugging();//Debug all of types
_.M.isDebugging('home'); //true
```

