<script src="/test_files/button.js"></script>
<p><code>_.M.DialogButton</code> có ngoài là class thể hiện các button của dialog còn có các static method khác, các
    method này giúp định nghĩa, khai báo, và tạo ra các button được định nghĩa trước.</p>

<p>Mỗi button type sau khi định nghĩa có thể được tạo ra, kèm theo các option phù hợp với yêu cầu. Mỗi button khi được
    định nghĩa sẽ có 2 loại options:</p>
<dl class="dl-horizontal">
    <dt>options</dt>
    <dd>Các options mặc định, có thể override theo yêu cầu</dd>
    <dt>freeze_options</dt>
    <dd>Các options mặc định, không thể override</dd>
</dl>

## Một số button đã được định nghĩa
<table class="table table-striped">
    <thead>
    <tr>
        <th>Tên</th>
        <th>Constant</th>
        <th>Options mặc định</th>
        <th>Options mặc định, không thể override</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>ok</code><br></td>
        <td><code>_.M.BUTTON_OK</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Ok'
}</code></pre>
        </td>
        <td>
<pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>yes</code><br></td>
        <td><code>_.M.BUTTON_YES</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Yes'
}</code></pre>
        </td>
        <td>
            <pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>no</code><br></td>
        <td><code>_.M.BUTTON_NO</code></td>
        <td>
<pre><code class="javascript">{
    label: 'No'
}</code></pre>
        </td>
        <td>
            <pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>retry</code><br></td>
        <td><code>_.M.BUTTON_RETRY</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Retry'
}</code></pre>
        </td>
        <td>
            <pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>ignore</code><br></td>
        <td><code>_.M.BUTTON_IGNORE</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Ignore'
}</code></pre>
        </td>
        <td>
            <pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>cancel</code><br></td>
        <td><code>_.M.BUTTON_CANCEL</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Cancel',
    disable_on_pending: false
}</code></pre>
        </td>
        <td>
            <pre><code class="javascript">{}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>close</code><br></td>
        <td><code>_.M.BUTTON_CLOSE</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Close',
    type: _.M.BUTTON_INFO,
    force: false //force to close dialog
}</code></pre>
        </td>
        <td>
<pre><code class="javascript">{
    handler: function (button) {
            var dialog = button.getDialog();
            if (dialog) {
                button.closeDialog(Boolean(button.options.force));
            }
        }
}</code></pre>
        </td>
    </tr>
    <tr>
        <td><code>submit</code><br></td>
        <td><code>_.M.BUTTON_SUBMIT</code></td>
        <td>
<pre><code class="javascript">{
    label: 'Submit'
}</code></pre>
        </td>
        <td>
<pre><code class="javascript">{}</code></pre>
        </td>
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
        <td><code>defaultClickable</code></td>
        <td>function</td>
        <td>Button visible + is enable + dialog clickable</td>
        <td>Callback check button có thể được click hay không</td>
    </tr>
    </tbody>
</table>

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.isDialogButton</strong></div>
    <div class="panel-body">
        Kiểm tra một object có phải là instance của <code>_.M.DialogButton</code>
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
                    <td><code>button</code></td>
                    <td>*</td>
                    <td></td>
                    <td></td>
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
    <div class="panel-heading"><strong>_.M.DialogButton.define</strong></div>
    <div class="panel-body">
        Định nghĩa một loại button. Nếu loại button cần định nghĩa đã có thì button đó sẽ bị ghi đè
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
                    <td>Tên button</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Các option của button, có thể được override</td>
                </tr>
                <tr>
                    <td><code>freeze_options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Các option không bị override của button</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.DialogButton.define('test', {
    label: 'Test button',
    type: _.M.BUTTON_DANGER
}, {
    icon: 'glyphicon glyphicon-leaf'
});
var dialog = new _.M.Dialog({
    content: 'Test define button'
});
dialog.attachButton(_.M.DialogButton.factory('test', {type: _.M.BUTTON_SUCCESS, icon: 'glyphicon glyphicon-tags'}));
dialog.open();
</code></pre>
            <div class="well">
                <a href="javascript: testButtonGlobalMethodDefine()" class="btn btn-info">Test</a>
            </div>
            <p>Ở ví dụ trên ta định nghĩa một button, có các options về type và icon, khi tạo button có sử dụng một số options khác như button type và icon. Kết quả, chỉ có option về type là thay đổi.</p>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>_.M.DialogButton.isDefined</strong></div>
    <div class="panel-body">
        Kiểm tra một button type đã được định nghĩa hay chưa
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
                    <td>Tên button type cần kiểm tra</td>
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
    <div class="panel-heading"><strong>_.M.DialogButton.updateOptions</strong></div>
    <div class="panel-body">
        Cập nhật các option có thể thay đổi của loại button đã được định nghĩa
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
                    <td>Tên button type cần update</td>
                </tr>
                <tr>
                    <td><code>options</code></td>
                    <td>{}</td>
                    <td></td>
                    <td>Options cần update</td>
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
    <div class="panel-heading"><strong>_.M.DialogButton.factory</strong></div>
    <div class="panel-body">
        Tạo một button từ button type đã được định nghĩa
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
                    <td><code>types</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Tên các button type đã được định nghĩa</td>
                </tr>
                <tr>
                    <td><code>all_button_options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Options chung của các button sẽ được tạo ra</td>
                </tr>
                <tr>
                    <td><code>button_options</code></td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>Các options dành riêng cho từng button. Key là tên button, value là các options cho button đó
                    </td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Mảng các button đã tạo, nếu chỉ tạo 1 button thì trả về button đó (không phải mảng các button)
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <p>
                <strong>Dialog Button type is unregistered</strong><br>
                Button cần tạo chưa được định nghĩa
            </p>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">var dialog = new _.M.Dialog({
    content: 'Test factory button'
});
dialog.attachMultiButtons(_.M.DialogButton.factory(_.M.DIALOG_BUTTON_YES_NO_CANCEL));
dialog.open();</code></pre>
            <div class="well">
                <a href="javascript: testButtonGlobalMethodFactory()" class="btn btn-info">Test</a>
            </div>
        </li>
    </ul>
</div>