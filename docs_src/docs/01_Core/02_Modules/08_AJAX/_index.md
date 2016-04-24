Các hàm hỗ trợ khi làm việc với AJAX

<ul class="list-unstyled">
    <li><i class="glyphicon glyphicon-check text-info"></i> Biến đổi data trước khi request</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Xử lý response, xác định response là success hay error</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> AJAX class với nhiều tiện ích khi làm việc với AJAX</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Định dạng AJAX error về dạng object, bao gồm message và
            error code
    </li>
</ul>

### Request path
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

### Biến đổi dữ liệu trước khi gửi đi
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

### Biến đổi dữ liệu nhận được
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


### Định dạng error
<pre><code class="javascript">$.ajax({
    url: 'http:/not_found_url.ohoho',
    error: function(jqXHR, textStatus, errorThrown){
    console.log('AJAX ERROR', _.M.AJAX.beautifyError(arguments));
    }
});
//=> AJAX ERROR Object {code: 404, message: "The server has not found anything matching the URI given"}</code></pre>

### Error codes
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

