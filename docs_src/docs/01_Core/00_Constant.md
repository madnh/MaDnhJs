Các hằng số là các giá trị gắn vào object `_.M` và không thể thay đổi, được khai báo bằng hàm `_.M.defineConstant`

```js
_.M.defineConstant('FOO', 'bar');
```
Truy cập một hằng số đã tồn tại

```js
alert(_.M.FOO); //bar
```

Kiểm tra 1 hằng số có tồn tại bằng hàm `_.M.isDefinedConstant`

```js
_.M.isDefinedConstant('FOO'); //true
_.M.isDefinedConstant('BAR'); //false
```

Các constant luôn ở dạng IN HOA

```js
_.M.defineConstant('baz', 'foo');
_.M.isDefinedConstant('baz'); //false
_.M.isDefinedConstant('BAZ'); //true
```


# Core constants
----------------

### VERSION
Phiên bản của `_.M`
```js
alert(_.M.VERSION); //1.1.2
```

### SORT_NUMBER
Hàm so sánh dùng khi sắp sếp mảng, sắp sếp dạng số học, tăng dần
```JavaScript
var scores = [1, 10, 2, 21];
scores.sort(); // [1, 10, 2, 21]
scores.sort(_.M.SORT_NUMBER); // [1, 2, 10, 21]
```

### SORT_NUMBER_DESC
Hàm so sánh dùng khi sắp sếp mảng, sắp sếp dạng số học, giảm dần
```JavaScript
var scores = [1, 10, 2, 21];
scores.sort(_.M.SORT_NUMBER_DESC); // [21, 10, 2, 1]
```



