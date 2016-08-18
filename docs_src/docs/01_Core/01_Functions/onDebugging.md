title: _.M.onDebugging
-----

Chạy một callback khi một thể loại test đang enable 

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
        <td></td>
        <td>Chủ đề test, nếu là null thì là tất cả các chủ đề</td>
    </tr>
    <tr>
        <td><code>callback</code></td>
        <td>function</td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Ví dụ
```js
//At somewhere
_.M.onDebugging('home', _.M.logCb('debugging - home'));
```
```js
//At somewhere
var item = 123;
_.M.onDebugging('home', (function(val) {
  console.log('Item:', val);
})(item));
```


