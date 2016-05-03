## _.M.Task class
### Constructor
Contructor nhận vào duy nhất một parameter (không bắt buộc) là handler cho task. Parameter này sẽ được gán cho property `handler`

### Property
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
        <td><code>type_prefix</code></td>
        <td>string</td>
        <td>'task'</td>
        <td></td>
    </tr>
    <tr>
        <td><code>name</code></td>
        <td>string</td>
        <td>''</td>
        <td>Tên Task</td>
    </tr>
    <tr>
        <td><code>options</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Các options của task</td>
    </tr>
    <tr>
        <td><code>handler</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>string/string[]</dt>
                <dd>Tên (các) task khác đã được đăng ký</dd>
                <dt>function/function[]</dt>
                <dd>(Các) callback</dd>
                <dt>{}</dt>
                <dd>Object với tên các tasks và các options tương ứng</dd>
            </dl>
            Nếu là <code>function</code> thì cần có các parameters sau
            <dl class="dl-horizontal">
                <dt>data</dt>
                <dd>Dữ liệu cần xử lý</dd>
                <dt>success callback</dt>
                <dd>Callback nhận kết quả xử lý của task. Thực chất là hàm <code>setProcessResult</code></dd>
                <dt>error callback</dt>
                <dd>Callback nhận thông tin và mã của lỗi. Thực chất là hàm <code>setProcessError</code></dd>
            </dl>
        </td>
        <td></td>
        <td></td>
    </tr>
    </tbody>
</table>

### Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>option</strong></div>
    <div class="panel-body">
        Cài đặt task
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
                    <td>string/{}</td>
                    <td></td>
                    <td>Tên option hoặc object chứa các options</td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td>null</td>
                    <td>Giá trị của option, nếu parameter <code>name</code> là object thì parameter này bị bỏ qua</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>instance</code>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setProcessResult</strong></div>
    <div class="panel-body">
        Lưu result của quá trình xử lý
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
                    <td><code>result</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Kết quả xử lý</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setProcessError</strong></div>
    <div class="panel-body">
        Lưu thông tin lỗi
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
                    <td><code>message</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Thông tin lỗi</td>
                </tr>
                <tr>
                    <td><code>code</code></td>
                    <td>string|number</td>
                    <td>0</td>
                    <td>Mã lỗi</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>process</strong></div>
    <div class="panel-body">
        Thực hiện task
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
                    <td><code>data</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Dữ liệu cần xử lý</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean - quá trình xử lý thành công (TRUE) hay không (FALSE)
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isError</strong></div>
    <div class="panel-body">
        Quá trình xử lý có phải là đã có lỗi?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getResult</strong></div>
    <div class="panel-body">
        Trả về kết quả xử lý
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            Kết quả xử lý
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getError</strong></div>
    <div class="panel-body">
        Trả về thông tin lỗi
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            object với cấu trúc sau:
            <dl class="dl-horizontal">
                <dt>message</dt>
                <dd>Thông tin lỗi</dd>
                <dt>code</dt>
                <dd>Mã lỗi</dd>
            </dl>
        </li>
    </ul>
</div>

### Ví dụ
```js
var t1 = new _.M.Task();

t1.handler = function(data, success_cb, error_cb){
    if(_.isString(data)){
        success_cb(data + '_t1');
    }else{
        error_cb('Data must be a string');
    }
}
t1.process('123');
if(t1.isError()){
    alert('Error:' + t1.getError().message);
} else {
    alert('Result: ' + t1.getResult());
}
```

## Global methods
_.M.Task có các method được định nghĩa sẵn để làm việc với task mà không cần phải khởi tạo instance của class _.M.Task.

<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.Task.register</strong></div>
    <div class="panel-body">
        Đăng ký một task vào bộ lưu chung
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
                    <td>Tên task</td>
                </tr>
                <tr>
                    <td><code>handler</code></td>
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string|string[]</dt>
                            <dd>Tên (các) task khác</dd>
                            <dt>function|function[]</dt>
                            <dd>(Các) Callback xử lý data của task</dd>
                            <dt>object</dt>
                            <dd>Object chứa tên các task khác và option của các task đó</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
            Khai báo task instance rồi đăng ký
<pre><code class="javascript">var t1 = new _.M.Task();
    //...
    //Các định nghĩa, khai báo của task t1
    //...
    _.M.Task.register(t1);
</code></pre>
            Đăng ký Task bằng name và handler
<pre><code class="javascript">_.M.Task.register('t2', function(data){
    if(_.isString(data)){
        this.setProcessResult(data + '_t2');
    }else{
        this.setProcessError('Data must be a string');
    }
});
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.Task.has</strong></div>
    <div class="panel-body">
        Kiểm tra một task đã được khai báo hay chưa
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
                    <td>Tên task cần kiểm tra</td>
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
    <div class="panel-heading"><strong>_.M.Task.factory</strong></div>
    <div class="panel-body">
        Tạo Task instance từ tên của task đã được đăng ký
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
                    <td>Tên task đã đăng ký</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Sau khi tạo instance, các object này sẽ được dùng cho instance đó, bằng method
                        <code>option</code></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Task instance
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            Khi task chưa được đăng ký
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var task = _.M.Task.factory('test');
var task2 = _.M.Task.factory('test', {name: 'M'});
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.Task.apply</strong></div>
    <div class="panel-body">
        Xử lý một data bằng các task
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
                    <td><code>data</code></td>
                    <td>*</td>
                    <td></td>
                    <td>Data cần xử lý</td>
                </tr>
                <tr>
                    <td><code>tasks</code></td>
                    <td>object|string[]</td>
                    <td></td>
                    <td>Object chứa tên các task và options tương ứng, hoặc là mảng tên các task</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Kết quả xử lý data của các task
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            Có thể phát sinh lỗi khi sử dụng task chưa được khai báo
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">alert(_.M.Task.apply('123', ['t1', 't2']));
//123_t1_t2
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.Task.list</strong></div>
    <div class="panel-body">
        Trả về danh sách tên các task đã được đăng ký
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            string[]
        </li>
    </ul>
</div>