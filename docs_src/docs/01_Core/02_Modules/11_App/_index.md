Object cung cấp các method, thuộc tính mang tính toàn cục.
- Chứa các biến toàn cục
- Các event toàn cục
- Khởi chạy các hàm với sự kiện init của App

`_.App` là instance của class `_.M.EventEmitter`, mặc định được khởi tạo khi load `_.M`

## Chứa các biến toàn cục
Bản chất của `_.App` chỉ là một object, chúng ta có thể dùng để lưu trữ các biến, method dùng chung.

Gán trực tiếp
```js
_.App.register_url = 'register.php';
```

Gán nhiều thông tin bằng hàm `option`
```js
_.App.option({a: 1, b: 2});
_.App.option('c', 3);
_.App.option('d.e', 4);
```

## Các event toàn cục
Vì `_.App` là một instance của `_.M.EventEmitter` nên có thể sử dụng là nơi lắng nghe/phát sinh sự kiện ở mức toàn trang
```js
_.App.on('test', function(){
    alert('This is a test');
});
_.App.emit('test');
```

## Khởi chạy các hàm với sự kiện init của App
Khởi chạy các lệnh khi trang web đã được load, giống như cách sử dụng jQuery sau:
```js
$(document).ready(function() {
  alert('Page loaded');
});
```

Khởi chạy với `_.App`:
```js
_.App.onInit(function() {
  alert('Page loaded');
});

//Thêm vào cuối của trang web, hoặc dùng trong chính $(document).ready
_.App.init();
```

So sánh với cách sử dụng của jQuery:

**Giống**
- Chạy các lệnh sau khi đã load xong page

**Khác**
- jQuery dùng sự kiện ready của object `document`, _.App chạy ở bất kỳ đâu
- Các callback dùng _.App cũng như jQuery, có thể chỉ chạy một lần (không bắt buộc). Đối với _.App, mặc định sau khi chạy các callback sẽ được gỡ bỏ khỏi danh sách init
- _.App.init() có thể được dùng lại nhiều lần, ví dụ như khi load một phần của page bằng ajax, các ứng dụng Single Page Application.
jQuery không làm được như vậy


