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

## _.M Core
-----
<table class="table table-striped">
    <thead>
    <tr>
        <td>Constant</td>
        <td>Value</td>
        <td>Description</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>VERSION</td>
        <td>string</td>
        <td>
            Phiên bản của <code>_.M</code><br>
            <code class="js">alert(_.M.VERSION); //1.1.2</code>
        </td>
    </tr>
    <tr>
        <td>SORT_NUMBER</td>
        <td>function</td>
        <td>
            Hàm so sánh dùng khi sắp sếp mảng, sắp sếp dạng số học, tăng dần <br>
            <code>
                var scores = [1, 10, 2, 21];<br>
                scores.sort(); // [1, 10, 2, 21]<br>
                scores.sort(_.M.SORT_NUMBER); // [1, 2, 10, 21]
            </code>
        </td>
    </tr>
    <tr>
        <td>SORT_NUMBER_DESC</td>
        <td>function</td>
        <td>
            Hàm so sánh dùng khi sắp sếp mảng, sắp sếp dạng số học, giảm dần <br>
            <code>
                var scores = [1, 10, 2, 21];<br>
                scores.sort(_.M.SORT_NUMBER_DESC); // [21, 10, 2, 1]
            </code>
        </td>
    </tr>
    <tr>
        <td>IS_EQUAL</td>
        <td>function</td>
        <td>
            Hàm so sánh 2 giá trị, <b>loose comparison</b> <br>
            <code>
                _.M.IS_EQUAL(1, 1); //true
                _.M.IS_EQUAL(1, '1'); //true
                _.M.IS_EQUAL(1, true); //true
                _.M.IS_EQUAL(1, false); //false
                _.M.IS_EQUAL(1, 2); //false
            </code>
        </td>
    </tr>
    <tr>
        <td>IS_STRICT_EQUAL</td>
        <td>function</td>
        <td>
            Hàm so sánh 2 giá trị, <b>strict comparison</b> <br>
            <code>
                _.M.IS_STRICT_EQUAL(1, 1); //true
                _.M.IS_STRICT_EQUAL(1, '1'); //false
            </code>
        </td>
    </tr>
    </tbody>
</table>

## _.M.Priority
-----
<table class="table table-striped">
    <thead>
    <tr>
        <td>Constant</td>
        <td>Value</td>
        <td>Description</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>PRIORITY_HIGHEST</td>
        <td>100</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_HIGH</td>
        <td>250</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_DEFAULT</td>
        <td>500</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LOW</td>
        <td>750</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LOWEST</td>
        <td>1000</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_1</td>
        <td>100</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_2</td>
        <td>200</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_3</td>
        <td>300</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_4</td>
        <td>400</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_5</td>
        <td>500</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_6</td>
        <td>600</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_7</td>
        <td>700</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_8</td>
        <td>800</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_9</td>
        <td>900</td>
        <td></td>
    </tr>
    <tr>
        <td>PRIORITY_LEVEL_10</td>
        <td>1000</td>
        <td></td>
    </tr>
    </tbody>
</table>

## _.M.CACHE
-----
<table class="table table-striped">
    <thead>
    <tr>
        <td>Constant</td>
        <td>Value</td>
        <td>Description</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>CACHE_MIN</td>
        <td>10</td>
        <td>10 giây</td>
    </tr>
    <tr>
        <td>CACHE_TINY</td>
        <td>60</td>
        <td>1 phút</td>
    </tr>
    <tr>
        <td>CACHE_SHORT</td>
        <td>300</td>
        <td>5 phút</td>
    </tr>
    <tr>
        <td>CACHE_MEDIUM</td>
        <td>600</td>
        <td>10 phút</td>
    </tr>
    <tr>
        <td>CACHE_LONG</td>
        <td>3600</td>
        <td>1 giờ</td>
    </tr>
    <tr>
        <td>CACHE_FOREVER</td>
        <td>true</td>
        <td>Không giới hạn</td>
    </tr>
    </tbody>
</table>

## _.M.EventEmitter
-----
<table class="table table-striped">
    <thead>
    <tr>
        <td>Constant</td>
        <td>Value</td>
        <td>Description</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>EVENT_EMITTER_EVENT_LIMIT_LISTENERS</td>
        <td>10</td>
        <td>Số lượng giới hạn các listener của mỗi event. Quá số lượng này sẽ hiện thông báo</td>
    </tr>
    <tr>
        <td>EVENT_EMITTER_EVENT_UNLIMITED</td>
        <td>-1</td>
        <td>Không giới hạn số listener của mỗi event</td>
    </tr>
    </tbody>
</table>

## _.M.AJAX
-----
<table class="table table-striped">
    <thead>
    <tr>
        <td>Constant</td>
        <td>Value</td>
        <td>Description</td>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td>AJAX_PRE_OPTIONS_NAME</td>
            <td>'_.M.AJAX'</td>
            <td>Tên PreOptions của _.M.AJAX</td>
        </tr>
        <tr>
            <td>AJAX_ABORTED</td>
            <td>'aborted'</td>
            <td>AJAX đã bị hủy</td>
        </tr>
        <tr>
            <td>AJAX_TIMEOUT</td>
            <td>'timeout'</td>
            <td>AJAX bị hủy do hết thời gian truy vấn</td>
        </tr>
        <tr>
            <td>AJAX_PARSER_ERROR</td>
            <td>'parser_error'</td>
            <td>Parser kiểu dữ liệu từ response về dạng yêu cầu không thành công</td>
        </tr>
        <tr>
            <td>AJAX_SERVER_ERROR</td>
            <td>500</td>
            <td>Có lỗi ở server</td>
        </tr>
        <tr>
            <td>AJAX_FORBIDDEN</td>
            <td>403</td>
            <td>Không được phép truy cập tài nguyên</td>
        </tr>
        <tr>
            <td>AJAX_NOT_FOUND</td>
            <td>404</td>
            <td>Tài nguyên không tồn tại</td>
        </tr>
    </tbody>
</table>


