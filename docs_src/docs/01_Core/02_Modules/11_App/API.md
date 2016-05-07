## Methods
Ngoài các method mà một instance của `_.M.EventEmitter` sẽ có, `_.App` còn có một số method khác

<div class="panel panel-info">
    <div class="panel-heading"><strong>option</strong></div>
    <div class="panel-body">
        Cài đặt các value cho <code>_.App</code>
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
                    <td><code>option</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên biến hoặc đường dẫn tới giá trị cần đặt</dd>
                            <dt>object</dt>
                            <dd>Object với tên các tên biến và giá trị tương ứng</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td>Bỏ qua khi parameter <code>option</code> là object</td>
                    <td>Giá trị của biến / đường dẫn</td>
                </tr>
                <tr>
                    <td><code>separator</code></td>
                    <td>string</td>
                    <td>dấu chấm <code>.</code>. Bỏ qua khi parameter <code>option</code> là object</td>
                    <td>Ký tự dùng để tách chuỗi đường dẫn khi parameter <code>option</code> là string</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>_.App</code>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.App.option({a: 1, b: 2});
    _.App.option('c', 3);
    _.App.option('d.e', 4);</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>onInit</strong></div>
    <div class="panel-body">
        Thêm callback khi page load xong
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Thực chất hàm này thêm các callback vào một event có tên là <code>init</code>. Có thể dùng các method khác của <code>_.M.EventEmitter</code> để thêm callback vào event này.
        </div>
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
                    <td><code>callback</code></td>
                    <td>function</td>
                    <td></td>
                    <td>Callback sẽ gọi</td>
                </tr>
                <tr>
                    <td><code>once</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Callback chỉ chạy một lần?</td>
                </tr>
                <tr>
                    <td><code>priority</code></td>
                    <td>number</td>
                    <td>Constant <code>_.M.PRIORITY_DEFAULT</code></td>
                    <td>Độ ưu tiên của callback</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>_.App</code>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.App.onInit(function() {
    alert('Page loaded');
});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>init</strong></div>
    <div class="panel-body">
        Gọi các callback khi page khởi tạo xong.
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Thực chất hàm này phát sinh event có tên là <code>init</code>. Có thể dùng các method khác của <code>_.M.EventEmitter</code> để phát sinh sự kiện này.
        </div>
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
                    <td><code>reset</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Reset tất cả các init callback sau khi khởi tạo xong</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">//Thêm callback chỉ chạy một lần
_.App.onInit(function() {
    alert('Page loaded');
});
//Thêm callback chạy nhiều lần
_.App.onInit(function() {
    alert('Page loaded 2');
}, false);
_.App.init();//Alert 2 lần
_.App.init(true);//Chỉ alert 1 lần - alert của callback thứ 2
_.App.init();//Không còn callback nào nữa
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>resetInitCallbacks</strong></div>
    <div class="panel-body">
        Reset các init callback
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">//Thêm callback chỉ chạy một lần
_.App.onInit(function() {
    alert('Page loaded');
});
//Thêm callback chạy nhiều lần
_.App.onInit(function() {
    alert('Page loaded 2');
}, false);
_.App.init();//Alert 2 lần
_.App.init();//Chỉ alert 1 lần - alert của callback thứ 2
_.App.init();//Vẫn chỉ alert 1 lần - alert của callback thứ 2
_.App.resetInitCallbacks();
_.App.init();//Không còn callback nào nữa</code></pre>
        </li>
    </ul>
</div>