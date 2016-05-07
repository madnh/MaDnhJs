Các hàm hỗ trợ khi làm việc với AJAX

<ul class="list-unstyled">
    <li><i class="glyphicon glyphicon-check text-info"></i> Biến đổi data trước khi request</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Xử lý response, xác định response là success hay error</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Định dạng AJAX error về dạng object, bao gồm message và
            error code
    </li>
    <li><i class="glyphicon glyphicon-check text-info"></i> AJAX class với nhiều tiện ích khi làm việc với AJAX</li>
</ul>

<div class="alert alert-success">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Chú ý!</strong> Khi <code>_.M.AJAX</code> instance request xong sẽ phát sinh sự kiện
    <strong>ajax_complete</strong> của object <code>_.App</code>. Sự kiện này có một parameter là _.M.AJAX instance đã
    thự hiện request đó
</div>

## Request path
Các tập tin sau đây sẽ được dùng như là request path ở các ví dụ

<div class="panel panel-info">
	<div class="panel-body">
<pre><code class="php">$name = 'Client';
if (!empty($_POST['name'])) {
  $name = $_POST['name'];
}
echo 'Hello, ' . $name;
</code></pre>
	</div>
</div>

## Xác định truy vấn lỗi hay thành công?
<code>_.M.AJAX</code> không chỉ xác định lỗi dựa trên các lỗi do jQuery trả về như bình thường, mà còn xác định dựa trên kết quả trả về từ server - hợp lệ đối với jQuery.
Ví dụ: server trả về response như sau (JSON):
<pre><code class="javascript">{
    error: {
        message: 'Co loi roi',
        code: 1234
    }
}</code></pre>
Với response như vậy, jQuery có thể trả về là thành công nhưng với <code>_.M.AJAX</code> lại là fail, vì nó hỗ trợ kiểm tra thành công\fail dựa trên ngữ nghĩa của response, quá trình kiểm tra này do client tự quyết định.

## Biến đổi dữ liệu trước khi gửi đi
Thêm DataAdapter
<pre><code class="javascript">_.M.AJAX.registerDataAdapter('append_dien', function (request_data) {
  request_data['name'] += ' điên';
  return request_data;
});</code></pre>
<pre><code class="javascript">_.M.AJAX.registerDataAdapter('append_khong', function (request_data) {
  request_data['name'] += ' không';
  return request_data;
});</code></pre>

Thực hiện AJAX
<pre><code class="javascript">var data = {
  name: 'Manh'
};
$.ajax({
  url: '/examples/ajax.php',
  method: 'POST',
  data: _.M.AJAX.applyDataAdapters(data, ['append_khong', 'append_dien']),
  success: function (response) {
      console.log('Response: ', response);
  }
});
//=> Response:  Hello, Manh không điên</code></pre>

## Biến đổi dữ liệu nhận được
Thêm Response Adapter
<pre><code class="javascript">_.M.AJAX.registerResponseAdapter('prepend', function (response) {
  this.response = '[response]' + response;
});</code></pre>

Thực hiện AJAX
<pre><code class="javascript">$.ajax({
    url: '/examples/ajax.php',
    method: 'POST',
    data: { name: 'Manh' },
    success: function (response) {
        console.log('Response: ', response);
        response = _.M.AJAX.applyResponseAdapters(response, 'prepend');
        console.log('New response: ', response.response);
    }
});
//=> Response:  Hello, Manh
//=> New response:  [response]Hello, Manh</code></pre>


## Định dạng error
<pre><code class="javascript">$.ajax({
    url: 'http:/not_found_url.ohoho',
    error: function(jqXHR, textStatus, errorThrown){
    console.log('AJAX ERROR', _.M.AJAX.beautifyError(arguments));
    }
});
//=> AJAX ERROR Object {code: 404, message: "The server has not found anything matching the URI given"}</code></pre>


