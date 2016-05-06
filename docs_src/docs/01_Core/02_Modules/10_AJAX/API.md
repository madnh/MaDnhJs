# Các mã lỗi
Các mã lỗi này trả về khi sử dụng class Wrapper của jQuery AJAX hoặc hàm `_.M.AJAX.beautifyError`
- 204: Server has received the request but there is no information to send back
- 400: The request had bad syntax or was inherently impossible to be satisfied
- 401: The parameter to this message gives a specification of authorization schemes which are acceptable
- 403: The request is for something forbidden
- 404: The server has not found anything matching the URI given
- 405: Method not allowed
- 406: Not acceptable
- 408: Request timeout
- 413: Payload too large
- 414: URI too long
- 429: Too many requests
- 431: Request header fields too large
- 500: The server encountered an unexpected condition which prevented it from fulfilling the request
- 501: The server does not support the facility required
- 'parser_error': Parse response failed
- 'aborted': Manual abort request

# _.M.AJAX Class
`_.M.AJAX` là class wrapper của jQuery AJAX. Kế thừa class `_.M.EventEmitter`.

## Global options
`_.M.AJAX` sử dụng `_.M.PreOptions` để lưu trữ options mặc định cho các instance.
Có thể truy vấn vào PreOptions này bằng cách dùng key được lưu ở constant `_.M.AJAX_PRE_OPTIONS_NAME`.

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
        <td><code>response_tasks</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>string|string[]</dt>
                <dd>Tên các task</dd>
                <dt>{}</dt>
                <dd>Tên các task và options tương ứng với task đó</dd>
            </dl>
        </td>
        <td>{}</td>
        <td>Các task dùng xử lý response</td>
    </tr>
    <tr>
        <td><code>data_tasks</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>string|string[]</dt>
                <dd>Tên các task</dd>
                <dt>{}</dt>
                <dd>Tên các task và options tương ứng với task đó</dd>
            </dl>
        </td>
        <td>{}</td>
        <td>Các task dùng xử lý data trước khi gửi đi</td>
    </tr>
    <tr>
        <td><code>auto_abort</code></td>
        <td>boolean</td>
        <td>true</td>
        <td>Khi thực hiện một request, nếu instance hiện đang thực hiện một request thì request đó sẽ bị abort</td>
    </tr>
    <tr>
        <td><code>retry</code></td>
        <td>number</td>
        <td>0</td>
        <td>Số lần retry khi request bị error</td>
    </tr>
    <tr>
        <td><code>retry_delay</code></td>
        <td>number</td>
        <td>0</td>
        <td>Số milisecond delay mỗi lần retry request</td>
    </tr>
    <tr>
        <td><code>is_continue</code></td>
        <td>boolean|function</td>
        <td>true</td>
        <td>Biến|callback kiểm tra có tiếp tục retry request khi đã thực hiện các retry mà vẫn fail</td>
    </tr>
    </tbody>
</table>

## Constructor
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
        <td><code>options</code></td>
        <td>{}</td>
        <td>{}</td>
        <td>Options của instance</td>
    </tr>
    </tbody>
</table>

## Properties
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
        <td><code>options</code></td>
        <td>{}</td>
        <td>PreOption của `_.M.AJAX`</td>
        <td>Các options của instance</td>
    </tr>
    <tr>
        <td><code>jqXHR</code></td>
        <td>jQuery XHR object</td>
        <td>null</td>
        <td>Biến jQuery XHR object của jQuery AJAX</td>
    </tr>
    <tr>
        <td><code>requested</code></td>
        <td>number</td>
        <td>0</td>
        <td>Số lần đã request, tự động tăng lên ở mỗi lần request (bao gồm retry request)</td>
    </tr>
    <tr>
        <td><code>retry_time</code></td>
        <td>number</td>
        <td>0</td>
        <td>Số lần retry request. Reset mỗi khi thực hiện một request từ phía client</td>
    </tr>
    <tr>
        <td><code>response</code></td>
        <td>*</td>
        <td>null</td>
        <td>Response của request, đã được xử lý qua các task xử lý response</td>
    </tr>
    <tr>
        <td><code>error</code></td>
        <td>
            <dl class="dl-horizontal">
                <dt>null</dt>
                <dd>Không có lỗi, hoặc chưa request</dd>
                <dt>object</dt>
                <dd>
                    Object chứa thông tin lỗi:
                    <dl class="dl-horizontal">
                        <dt>message</dt>
                        <dd>Thông tin lỗi</dd>
                        <dt>code</dt>
                        <dd>Mã lỗi</dd>
                    </dl>
                </dd>
            </dl>
        </td>
        <td>null</td>
        <td>Thông tin về lỗi của request</td>
    </tr>
    </tbody>
</table>

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>option</strong></div>
    <div class="panel-body">
        Cài đặt instance
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
                            <dd>Tên option</dd>
                            <dt>object</dt>
                            <dd>Object với tên và value của các option. Dùng khi cần đặt nhiều option cùng lúc</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td>null</td>
                    <td>Giá trị của option. Chỉ dùng khi parameter <code>option</code> là <strong>string</strong></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX();
ajax.option('url', 'yahoo.php');
ajax.option({url: 'yahoo.php', method: 'POST'});</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>data</strong></div>
    <div class="panel-body">
        Đặt data cho request
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
                    <td>string|object</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>addData</strong></div>
    <div class="panel-body">
        Thêm data
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
                    <td>
                        <dl class="dl-horizontal">
                            <dt>string</dt>
                            <dd>Tên data</dd>
                            <dt>object</dt>
                            <dd>Object chứa các data, sẽ merge vào request data</dd>
                        </dl>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>value</code></td>
                    <td>*</td>
                    <td>null</td>
                    <td>Giá trị của data, chỉ dùng khi parameter <code>name</code> là string</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>done</strong></div>
    <div class="panel-body">
        Thêm callback khi ajax kết thúc và thành công (sau khi đã xử lý response). Nếu ajax đã kết thúc trước khi thêm
        callback thì callback sẽ được gọi ngay.
        Mỗi callback sẽ được gọi với thuộc tính <code>this</code> là ajax instance, với parameter là response.
        Số lượng done callback của một ajax instance là không hạn chế.
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
                    <td>Callback sẽ được gọi khi ajax request kết thúc và thành công</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX({url: '/examples/ajax_get_json.php'});
ajax.done(function(response){
    console.log('AJAX DONE!');
    console.log(response);
})</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>fail</strong></div>
    <div class="panel-body">
        Thêm callback khi ajax có lỗi, bao gồm các lỗi do jQuery AJAX xử lý và lỗi khi xử lý response.
        Nếu ajax đã bị lỗi trước khi thêm callback thì callback sẽ được gọi ngay.
        Mỗi callback sẽ được gọi với thuộc tính <code>this</code> là ajax instance, với parameters bao gồm:
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Tên</th>
                <th>Kiểu dữ liệu</th>
                <th>Mô tả</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><code>message</code></td>
                <td>string</td>
                <td>Thông tin lỗi</td>
            </tr>
            <tr>
                <td><code>code</code></td>
                <td>string|number</td>
                <td>Mã lỗi</td>
            </tr>
            </tbody>
        </table>
        Số lượng fail callback của một ajax instance là không hạn chế.
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
                    <td>Callback sẽ được gọi khi ajax request phát sinh lỗi</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX({url: 'not_found_path.html'});
ajax.fail(function(message, code){
    console.log('AJAX Error!');
    console.log('Message: ', message);
    console.log('Code: ', code);
})</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>always</strong></div>
    <div class="panel-body">
        Thêm callback khi ajax kết thúc, bất kể thành công hay có lỗi. Gọi sau khi các event <code>done</code> và <code>faild</code>
        đã được phát sinh
        Nếu ajax đã bị kết thúc trước khi thêm callback thì callback sẽ được gọi ngay.
        Mỗi callback sẽ được gọi với thuộc tính <code>this</code> là ajax instance, với parameters bao gồm:
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Tên</th>
                <th>Kiểu dữ liệu</th>
                <th>Mô tả</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><code>error</code></td>
                <td>object</td>
                <td>Object chứa thông tin lỗi, bao gồm các field: <i>message</i> - thông tin lỗi, <i>code</i> - mã lỗi.
                    Nếu request không có lỗi thì biến này có giá trị là <code>null</code></td>
            </tr>
            <tr>
                <td><code>response</code></td>
                <td>*</td>
                <td>Kết quả truy vấn sau khi đã thực hiện các xử lý response từ server trả về. Nếu ajax có lỗi thì biến
                    này có giá trị là <code>null</code></td>
            </tr>
            </tbody>
        </table>
        Số lượng always callback của một ajax instance là không hạn chế.
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
                    <td>Callback sẽ được gọi khi ajax kết thúc</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX({url: 'not_found_path.html'});
ajax.always(function(error, response){
    if(error){
        console.log('AJAX Error!');
        console.log('Message: ', error.message);
        console.log('Code: ', error.code);
    } else {
        console.log('AJAX DONE!');
        console.log(response);
    }
})</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>status</strong></div>
    <div class="panel-body">
        Tình trạng sẵn sàng của ajax
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            <dl class="dl-horizontal">
                <dt>false</dt>
                <dd>Ajax chưa được khởi tạo</dd>
                <dt>number</dt>
                <dd>Trạng thái của ajax</dd>
            </dl>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isReady</strong></div>
    <div class="panel-body">
        Kiểm tra instance có sẵn sàng request hay không.
        P/s: Chả dùng bao giờ, thêm vào cho đủ bộ =))
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isRequesting</strong></div>
    <div class="panel-body">
        Kiểm tra instance có đang thực hiện request hay không
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isRetrying</strong></div>
    <div class="panel-body">
        Kiểm tra instance có đang trong quá trình retry request hay không. Bao gồm cả đang trong quá trình delay giữa
        các lần retry.
        Hàm này khác với hàm <code>isRequesting</code> là hàm <strong>isRequesting</strong> kiểm tra có đang trong quá
        trình request - bất cứ 1 request nào, không quan tâm có phải là retry hay không.
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isDone</strong></div>
    <div class="panel-body">
        Kiểm tra instance đã thực hiện xong request, bao gồm cả các retry request nếu có.
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isFailed</strong></div>
    <div class="panel-body">
        Kiểm tra xem instance đã thực hiện xong truy vấn (bao gồm các retry request) và có lỗi?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isResponseMeaningFailed</strong></div>
    <div class="panel-body">
        Kiểm tra request bị failed có phải do kiểm tra ngữ nghĩa của response hay là do các lỗi được xác định từ jQuery?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isSuccess</strong></div>
    <div class="panel-body">
        Kiểm tra instance có phải đã thực hiện xong các request (bao gồm cả các retry request) và không có lỗi?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isAborted</strong></div>
    <div class="panel-body">
        Kiểm tra instance có phải là đã bị chủ động hủy bỏ?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isLastRetryTime</strong></div>
    <div class="panel-body">
        Kiểm tra có phải reqest hiện tại là lần retry cuối cùng?
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>isRetryable</strong></div>
    <div class="panel-body">
        Kiểm tra request có thể retry lại hay không.
        Một request có thể retry phải thỏa mãn các điều kiện sau:
        <ul>
            <li>Nếu request gần nhất (bao gồm cả lần retry gần nhất) bị lỗi - bao gồm lỗi do jQuery AJAX phát sinh và
                lỗi khi xử lý response
            </li>
            <li>Không phải là bị abort</li>
            <li>options cho phép retry</li>
            <li>Chưa hết số lần retry</li>
        </ul>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>request</strong></div>
    <div class="panel-body">
        Thực hiện một request với options tùy chọn.
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Các options tùy chọn này chỉ có giá trị cho lần request này, không lưu vào instance.
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
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Object chứa các options cho lần request này</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX({url: '/examples/ajax.php'});
ajax.done(function(response){
    console.log('AJAX DONE!');
    console.log(response);
});
ajax.request({data: {name: 'M'}});
//Next request
ajax.request();
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>abort</strong></div>
    <div class="panel-body">
        Hủy bỏ request hiện tại.
        <div class="alert alert-info">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <strong>Chú ý!</strong> Nếu instance hiện đang trong quá trình delay retry thì sẽ phát sinh event <code>aborted</code>,
            event này không có parameter.
        </div>
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>query</strong></div>
    <div class="panel-body">
        Thực hiện một request GET
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
                    <td>string|object</td>
                    <td>parameter không bắt buộc, chỉ sử dụng khi có khai báo</td>
                    <td>Data cần send</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var ajax = new _.M.AJAX();
ajax.option({
    url: '/examples/ajax.php'
});
ajax.always(function(){
    console.log('AJAX Complete', arguments);
});
ajax.query({name: 'Manh'});
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>send</strong></div>
    <div class="panel-body">
        Tương tự như method <code>query</code> nhưng là truy vấn POST
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>get</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.get</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>post</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>put</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code> nhưng method là PUT
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>delete</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.put</code> nhưng method là DELETE
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>getJSON</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.getJSON</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>postJSON</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code> nhưng dataType là JSON
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
# Global methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.use</strong></div>
    <div class="panel-body">
        Tạo _.M.AJAX instance với một options đã được khai báo ở _.M.PreOptions
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
                    <td><code>pre_options_name</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Tên của PreOptions</td>
                </tr>
                <tr>
                    <td><code>custom_options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Custom options</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            <code>_.M.AJAX instance</code>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.PreOptions.define('ajax_test', {url: '/examples/ajax.php'});
    var ajax = _.M.AJAX.use('ajax_test', {method:'POST'});
    ajax.request();
    //hoặc
    _.M.AJAX.use('ajax_test', {method:'POST'}).request();
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.get</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.get</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.post</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.put</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code> nhưng method là PUT
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.delete</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.put</code> nhưng method là DELETE
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.getJSON</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.getJSON</code>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.postJSON</strong></div>
    <div class="panel-body">
        Tương tự như <code>$.post</code> nhưng dataType là JSON
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.AJAX.load</strong></div>
    <div class="panel-body">
        Load content và gán vào DOM
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
                    <td><code>url</code></td>
                    <td>string</td>
                    <td></td>
                    <td>URL cần truy vấn</td>
                </tr>
                <tr>
                    <td><code>target</code></td>
                    <td>string|jQuery DOM</td>
                    <td></td>
                    <td>selector hoặc jQuery DOM (thằng nào rồi cũng thành jQuery DOM hết)</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>
                        Object với cấu trúc như sau:
                        <dl class="dl-horizontal">
                            <dt>error_content</dt>
                            <dd>Content trong trường hợp request error</dd>
                            <dt>apply_type</dt>
                            <dd>Kiểu apply content vào DOM, bao gồm: <strong>replace</strong> (mặc định),
                                <strong>append</strong>, <strong>prepend</strong></dd>
                        </dl>
                    </td>
                    <td>Các cài đặt cho request</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            instance
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.AJAX.load('/examples/ajax.php', $('body'), {
method: 'POST',
data: {
        name: 'Manh'
    }
});</code></pre>
        </li>
    </ul>
</div>