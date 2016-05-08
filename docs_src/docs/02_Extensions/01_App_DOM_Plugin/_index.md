Một ứng dụng web bây giờ thường sử dụng các plugin jQuery. Các plugin này thường được gọi vào lúc trang web khởi tạo xong.
Tuy nhiên, các plugin này không thể thực hiện trên các DOM được load về sau, ví dụ như các DOM được load bằng AJAX, sinh ra từ JS,..

Extension này giúp quản lý các thành phần jQuery Plugin, thực thi trên các vùng DOM, với các tùy chọn khác nhau.

```js
_.App.addDOMPlugin('test', function(holder, options) {
    $(holder).find('p').css('color', options.color);
}, {
    color: 'red'
});

_.App.applyDOMPlugin('body', ['test']);
_.App.applyDOMPlugin(['test']);
_.App.applyDOMPlugin(['test'], {test: {color: 'blue'}});
_.App.applyDOMPlugin({test: {color: 'green'}});
_.App.applyDOMPlugin();
```

# Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>addDOMPlugin</strong></div>
    <div class="panel-body">
        Thêm một DOM plugin
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td>Tên plugin</td>
                    <td></td>
                </tr><tr>
                    <td><code>callback</code></td>
                    <td>function</td>
                    <td></td>
                    <td>
                        Callback nhận 2 parameter:
                        <dl class="dl-horizontal">
                            <dt>selector</dt>
                            <dd>jQuery selected DOM</dd>
                            <dt>options</dt>
                            <dd>Custom options merged with default options</dd>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.App.addDOMPlugin('test', function(holder, options) {
  $(holder).find('p').css('color', options.color);
}, {
  color: 'red'
});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>hasDOMPlugin</strong></div>
    <div class="panel-body">
        Kiểm tra một DOM Plugin có tồn tại?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên DOM Plugin cần kiểm tra</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeDOMPlugin</strong></div>
    <div class="panel-body">
        Xóa một hay nhiều DOM Plugin
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>name</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Tên các DOM Plugin, không hạn chế số lượng arguments</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.App.removeDOMPlugin('test');
_.App.removeDOMPlugin('test', 'test2');
_.App.removeDOMPlugin(['test', 'test2', 'test3']);
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>applyDOMPlugin</strong></div>
    <div class="panel-body">
        Áp dụng các DOM Plugins vào một selector
    </div>
    <div class="list-group">
        <a href="#" class="list-group-item list-group-item-success">_.App.applyDOMPlugin([selector], [plugins], [options]);</a>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Parameters</h4>
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
                    <td><code>selector</code></td>
                    <td>string|jQuery selected DOM</td>
                    <td></td>
                    <td>Chuỗi selector hoặc các DOM đã được select bởi jQuery</td>
                </tr>
                <tr>
                    <td><code>plugins</code></td>
                    <td>string[]</td>
                    <td>Tất cả các plugin</td>
                    <td>Mảng các tên plugins cần apply</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Object với tên các plugin và các options tương ứng. Các options này sẽ được merge với option mặc đinh của plugin</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <strong>Apply not found DOM plugin: .....</strong>
            <p>Khi apply mà có plugin không tồn tại</p>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.App.applyDOMPlugin('body', ['test']);
_.App.applyDOMPlugin(['test']);
_.App.applyDOMPlugin(['test'], {test: {color: 'blue'}});
_.App.applyDOMPlugin({test: {color: 'green'}});
_.App.applyDOMPlugin();
</code></pre>
        </li>
    </ul>
</div>