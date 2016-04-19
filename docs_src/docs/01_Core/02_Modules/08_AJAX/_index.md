Các hàm hỗ trợ khi làm việc với AJAX

<ul class="list-unstyled">
    <li><i class="glyphicon glyphicon-check text-info"></i> Định dạng AJAX error về dạng object, bao gồm message và
        error code
    </li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Biến đổi data trước khi request</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> Xử lý response, xác định response là success hay error</li>
    <li><i class="glyphicon glyphicon-check text-info"></i> AJAX class với nhiều tiện ích khi làm việc với AJAX</li>
</ul>

### Định dạng error
<pre><code class="javascript">$.ajax({
    url: 'http:/not_found_url.ohoho',
    error: function(jqXHR, textStatus, errorThrown){
    console.log('AJAX ERROR', _.M.AJAX.beautifyError(arguments));
    }
});
//=> AJAX ERROR Object {code: 404, message: "The server has not found anything matching the URI given"}</code></pre>