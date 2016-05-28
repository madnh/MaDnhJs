<script src="/test_files/template/button_bootstrap.js"></script>
![dialog_template_bootstrap.png](/imgs/dialog_template_bootstrap.png)

## Default options
** Pre Options constant:** `_.M.DIALOG_BUTTON_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME`

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
        <td><code>icon_class</code></td>
        <td>string</td>
        <td>dialog_button_icon</td>
        <td>Tên class chứa icon</td>
    </tr>
    <tr>
        <td><code>label_class</code></td>
        <td>string</td>
        <td>dialog_button_label</td>
        <td>Tên class chứa label của button</td>
    </tr>
    </tbody>
</table>

## Sections
- ICON
- LABEL

## Methods
<div class="panel panel-info">
    <div class="panel-heading"><strong>getButton</strong></div>
    <div class="panel-body">
        Trả về button mà template đang thể hiện
    </div>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>updateLabel</strong></div>
    <div class="panel-body">
        Cập nhật label
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
                    <td><code>label</code></td>
                    <td>string</td>
                    <td></td>
                    <td>Label mới</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>

<div class="panel panel-info">
    <div class="panel-heading"><strong>updateIcon</strong></div>
    <div class="panel-body">
        <p>Cập nhật icon</p>
        <div class="alert alert-warning">
        	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        	<strong>Chú ý!</strong> Method này không re-draw template mà chỉ thay thế icon đã có, vì vậy nếu trước đó button không có option về icon thì method này sẽ không thể thay icon mới dc
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
                    <td><code>icon</code></td>
                    <td>string</td>
                    <td></td>
                    <td>classes thể hiện icon, vd: "fa fa-check", "glyphicon glyphicon-ok"</td>
                </tr>
                </tbody>
            </table>
        </li>
    </ul>
</div>

## Examples
Change button's icon and label on click
```js
var dialog = new _.M.Dialog({
    content: 'Click button to see magic!'
});

var button = new _.M.DialogButton({
    icon: 'fa fa-check',
    label: 'Click me!'
});

button.setHandler(function () {
    var template = this.getTemplate();

    template.updateIcon(_.sample(['glyphicon glyphicon-ok', 'glyphicon glyphicon-music', 'glyphicon glyphicon-map-marker', 'glyphicon glyphicon-bell', 'glyphicon glyphicon-globe']));
});

dialog.attachButton(button);
dialog.open();
```
<div class="well">
    <a href="javascript: changeButtonIconAndLabel()" class="btn btn-info">Test</a>
</div>