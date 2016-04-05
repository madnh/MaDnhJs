## Vấn đề
Trong quá trình phát triển chúng ta thường gặp trường hợp cần lưu trữ các thông tin theo một tiêu chí nào đó.
Công việc này có thể đơn giản giải quyền bằng cách sử dụng một array, lưu các item vào đó

```js
var items = [];

function addItem(item){
items.push(item);
}

function hasItem(item){
for(var i = 0; i < items.length; i++){
if(items[i] === item){
return true;
}
}

return false;
}

function editItem(item, new_value){
//.....
}

function deleteItem(item){
//.....
}

/**
* Các function khác
* .....
*/
```

<dl class="dl-horizontal">
    <dt>Ưu điểm</dt>
    <dd><ul>
        <li>Gọn</li>
        <li>Tối ưu cho từng trường hợp</li>
    </ul></dd>
    <dt>Nhược</dt>
    <dd><ul>
        <li>Phải lặp lại các thao tác như nhau (<strong>CRUD</strong>) ở tất cả các trường hợp: thêm, kiểm tra, lấy list, cập nhật, xóa,...</li>
        <li>Số lượng item càng nhiều thì chi phí cho 1 tác vụ càng lớn: nếu list là unique thì mỗi thao tác thêm dữ liệu phải kiểm tra tồn tại.
            Mỗi lần thực hiện tác vụ phải lặp qua từng phần tử</li>
    </ul></dd>
</dl>

## Giải pháp
Sử dụng ContentManager để lưu trữ, bỏ qua các thao tác đọc CRUD, tập trung vào việc phát triển.

<ul>
    <li>Lưu trữ theo kiểu dữ liệu, tự động xác định kiểu như number, string, function,... hay chỉ định kiểu tùy chọn</li>
    <li>Truy vấn bằng key</li>
    <li>Filter bằng item value, callback</li>
    <li>Hỗ trợ lưu trữ thông tin bổ trợ cho item (meta info)</li>
    <li>Có sẵn các chức năng CRUD: thêm, kiểm tra tồn tại, lấy, cập nhật và xóa item</li>
    <li>Danh sách các item đang được sử dụng, xóa những item không dùng</li>
</ul>

```js
var items = new _.M.ContentManager();
```

### Thêm:
Thêm item, tự động xác định kiểu dữ liệu
```js
var key = items.add('a');

console.log(key); //content_string_0
items.add(true); //content_boolean_0
items.add([1,2,true, {a:'A', c:'C'}]); //content_array_0
```

Thêm item, meta info, tự động xác định kiểu dữ liệu
```js
items.add('a', {id: 123}); //content_string_1
items.add(true, {name: 'yahoo'}); //content_boolean_1
items.add([1,2,true, {a:'A', c:'C'}], {expire: 1735693261}); //content_array_1
```

Thêm item, meta info, kiểu dữ liệu tùy chọn
```js
items.add('a', {id: 123}, 'yahoo'); //content_yahoo_0
```

Thêm item nếu chưa có, nếu có trả về key của item đầu tiên (unique)
```js
items.addUnique('a'); //content_string_0
items.addUnique('b'); //content_string_2
```

### Kiểm tra tồn tại
Tồn tại kiểu dữ liệu?
```js
items.hasType('string'); //true
items.hasType('yahoo'); //true
items.hasType('foo'); //false
```

Tồn tại key?
```js
items.hasKey('content_string_0'); //true
items.hasKey('content_foo_1'); //false
```

Tồn tại item?
```js
items.hasContent('a'); //true
items.hasContent('a', 'yahoo'); //true
items.hasContent('a', 'foo'); //false
```
### Lấy item
Lấy item content và meta info bằng key
```js
items.get('content_string_0'); //{content: 'a', meta: undefined}
items.get('content_string_999'); //false
```

Lấy item content bằng key, hỗ trợ giá trị mặc định nếu key không tồn tại
```js
items.getContent('content_string_0', 'hihihi'); //'a'
items.getContent('content_string_999', 'ohhoho'); //ohhoho
```

Lấy tất cả item của một kiểu dữ liệu
```js
items.getType('string');{content_string_0: {....}, content_string_1: {....}, ....}
```

### Cập nhật
Cập nhật content
```js
items.update('content_string_0', 'A');
items.update('content_string_0', 'A', {id: 234});
```

Cập nhật meta info
```js
items.updateMeta('content_string_1', {id: 456});
```
### Sử dụng item
Sử dụng và kiểm tra sử dụng item
```js
items.using('content_string_1');
items.isUsing('content_string_1'); //true
items.isUsing('content_string_999'); //false
items.isUsingContent('a'); //false
```

Các item đang sử dụng
```js
items.get(items._using);
```

Không sử dụng item
```js
items.using('content_string_1', false);
//or
items.unused('content_string_1');
```

Xóa các item đang được sử dụng
```js
items.removeUsing();
```

Xóa các item không được sử dụng
```js
items.removeUnusing();
```

### Xóa item
Xóa bằng key
```js
items.remove('content_yahoo_0'); //[{type: 'yahoo', key: 'content_yahoo_0'}]
```

Xóa bằng content
```js
items.removeContent('a'); //[{type: 'string', key: 'content_yahoo_1'}]
```