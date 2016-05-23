Các hàm làm việc với form bằng jQuery

<div class="alert alert-danger">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <strong>Chú ý!</strong> Một số method của jForm có sử dụng các một số parameter (thường có tên là
    <strong>container</strong>) với ý nghĩa là chuỗi selector của DOM hoặc là kết quả tìm kiếm của jQuery, cách sử dụng
    nào cũng hợp lệ. Ví dụ: <code>#loginForm</code> hay <code>$('#loginForm')</code> đều như nhau.
    <br>
    <p>Các parameter này sẽ được khai báo kiểu dữ liệu là <strong><code>selector</code></strong></p>
</div>

# Properties

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
        <td><code>version</code></td>
        <td>string</td>
        <td></td>
        <td>Phiên bản</td>
    </tr>
    </tbody>
</table>

# Methods

<div class="panel panel-info">
    <div class="panel-heading"><strong>disable</strong></div>
    <div class="panel-body">
        Disable element
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
                    <td>selector</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
            <p>Chuỗi selector</p>
<pre><code class="javascript">_.M.jForm.disable('#email');</code></pre>
            <p>jQuery selected DOM</p>
<pre><code class="javascript">_.M.jForm.enable($('#password'))</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getSelectOptionTagByValue</strong></div>
    <div class="panel-body">
        Trả về các tag <code>option</code> của một tag <code>select</code> bằng cách kiểm tra giá trị
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
                    <td>Tên của tag select</td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa tag <code>select</code></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            jQuery selected DOM các tag <code>option</code> của tag <code>select</code>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
            Tìm các tag option có value là <strong>a</strong> hoặc <strong>c</strong>, của tag select có tên là <strong>groups</strong>
<pre><code class="javascript">_.M.jForm.getSelectOptionTagByValue('groups', ['a', 'c']);</code></pre>
            Tương tự ví dụ trên nhưng tìm trong container là <strong>loginForm</strong>
<pre><code class="javascript">_.M.jForm.getSelectOptionTagByValue('groups', ['a', 'c'], '#loginForm');</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setSelectTagValue</strong></div>
    <div class="panel-body">
        Đặt giá trị cho tag <code>select</code>
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
                    <td>Tên tag select</td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của tag select</td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa của tag cần tìm</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.setSelectTagValue('groups', ['admin', 'superman']);
_.M.jForm.setSelectTagValue('groups', ['admin', 'superman'], '#loginForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>removeSelectOptionTags</strong></div>
    <div class="panel-body">
        Xóa các tag <code>option</code> của một tag <code>select</code>
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa tag <code>select</code></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.removeSelectOptionTags('groups', 'superman');
_.M.jForm.removeSelectOptionTags('groups', 'superman', '#loginForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>disableSelectOptionTags</strong></div>
    <div class="panel-body">
        Disable các tag <code>option</code> của một tag <code>select</code>
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa tag <code>select</code></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.disableSelectOptionTags('groups', 'superman');
_.M.jForm.disableSelectOptionTags('groups', 'superman', '#loginForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>enableSelectOptionTags</strong></div>
    <div class="panel-body">
        Enable các tag <code>option</code> của một tag <code>select</code>
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa tag <code>select</code></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.enableSelectOptionTags('groups', 'superman');
_.M.jForm.enableSelectOptionTags('groups', 'superman', '#loginForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setRadioTagValue</strong></div>
    <div class="panel-body">
        Đặt giá trị cho các tag input radio
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.setRadioTagValue('permissions', ['delete_groups', 'add_users']);
_.M.jForm.setRadioTagValue('permissions', ['delete_groups', 'add_users'], '#userForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getRadioTagValue</strong></div>
    <div class="panel-body">
        Lấy giá trị của các tag input radio
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Return</h4>
            string
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.getRadioTagValue('permissions');
_.M.jForm.setRadioTagValue('permissions', '#userForm');
</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setCheckBoxStatus</strong></div>
    <div class="panel-body">
        Check/uncheck checkbox
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
                    <td>selector</td>
                    <td></td>
                    <td>Selector của checkbox</td>
                </tr>
                <tr>
                    <td><code>is_checked</code></td>
                    <td>boolean</td>
                    <td></td>
                    <td>Tình trạng check/uncheck</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.setCheckBoxStatus('#loginForm input[name="remember_me"]', true);</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getCheckboxTagsByValue</strong></div>
    <div class="panel-body">
        Filter các checkbox bằng giá trị của nó
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
                    <td>Tên của tag <code>select</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>string|string[]</td>
                    <td></td>
                    <td>Các giá trị của các tag <code>option</code></td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Checkbox tags
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.getCheckboxTagsByValue('permissions', ['superman', 'admin']);
_.M.jForm.getCheckboxTagsByValue('permissions', ['superman', 'admin'], '#loginForm');</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>setCheckBoxValue</strong></div>
    <div class="panel-body">
        Đặt giá trị cho checkbox
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
                    <td>Tên của tag <code>checkbox</code></td>
                </tr>
                <tr>
                    <td><code>values</code></td>
                    <td>
                        <ul>
                            <li>string|string[]</li>
                            <li>boolean</li>
                        </ul>
                    </td>
                    <td></td>
                    <td>Các giá trị</td>
                </tr>
                <tr>
                    <td><code>container</code></td>
                    <td>selector</td>
                    <td>'body'</td>
                    <td>Vùng chứa</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.setCheckBoxValue('permissions', ['superman', 'admin']);
_.M.jForm.getCheckboxTagsByValue('remember_me', true, '#loginForm');</code></pre>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>getFormValue</strong></div>
    <div class="panel-body">
        Trả về giá trị của form
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
                    <td><code>form</code></td>
                    <td>selector</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            Object
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
            <div class="well">
                <form class="form-horizontal" id="user_form">
                    <div class="form-group"><label for="inputEmail3" class="col-sm-2 control-label">Email</label>
                        <div class="col-sm-10"><input type="email" name="email" class="form-control" id="inputEmail3"
                                                      placeholder="Email"></div>
                    </div>
                    <div class="form-group"><label for="inputPassword3" class="col-sm-2 control-label">Password</label>
                        <div class="col-sm-10"><input type="password" name="password" class="form-control" id="inputPassword3"
                                                      placeholder="Password"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Groups</label>
                        <div class="col-sm-10">
                            <select name="groups" id="groups" class="form-control" multiple>
                                <option value="a">A</option>
                                <option value="b">B</option>
                                <option value="c">C</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Permissions</label>
                        <div class="col-sm-10">
                            <label><input type="checkbox" name="permissions" value="admin"> Admin</label>
                            <label><input type="checkbox" name="permissions" value="superman"> Superman</label>
                            <label><input type="checkbox" name="permissions" value="gay"> Gay</label>
                        </div>
                    </div>
                </form>
                <hr>
                <a href="javascript: getFormValue()" class="btn btn-info">Get form value</a> <--- view on console
                <script>
                    function getFormValue() {
                        console.log(_.M.jForm.getFormValue('#user_form'));
                    }
                </script>
            </div>
        </li>
    </ul>
</div>
<div class="panel panel-info">
    <div class="panel-heading"><strong>assignFormData</strong></div>
    <div class="panel-body">
        Đặt giá trị cho form
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
                    <td><code>form</code></td>
                    <td>selector</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><code>data</code></td>
                    <td>object</td>
                    <td></td>
                    <td>Các giá trị của form</td>
                </tr>
                <tr>
                    <td><code>prefix</code></td>
                    <td>string</td>
                    <td>''</td>
                    <td>Prefix dùng của các tên field</td>
                </tr>
                </tbody>
            </table>
        </li>
        <li class="list-group-item">
            <h4>Returns</h4>
            boolean
        </li>
        <li class="list-group-item">
            <h4>Throws</h4>
            <dl class="dl-horizontal">
                <dt>true</dt>
                <dd>form tồn tại, gán dữ liệu thành công</dd>
                <dt>false</dt>
                <dd>form không tồn tại</dd>
            </dl>
        </li>
        <li class="list-group-item">
            <h4>Examples</h4>
<pre><code class="javascript">_.M.jForm.assignFormValue('#user_form_2', {
    email: _.M.randomString(10) + '@yahoo.com',
    password: _.M.randomString(_.M.randomInteger(5, 15)),
    groups: _.sample(['a', 'b', 'c'], _.M.randomInteger(1, 3)),
    permissions: _.sample(['admin', 'superman', 'gay'], _.M.randomInteger(1, 3))
});</code></pre>
            <div class="well">
                <form class="form-horizontal" id="user_form_2">
                    <div class="form-group"><label for="inputEmail3" class="col-sm-2 control-label">Email</label>
                        <div class="col-sm-10"><input type="email" name="email" class="form-control" id="inputEmail3"
                                                      placeholder="Email"></div>
                    </div>
                    <div class="form-group"><label for="inputPassword3" class="col-sm-2 control-label">Password</label>
                        <div class="col-sm-10"><input type="password" name="password" class="form-control" id="inputPassword3"
                                                      placeholder="Password"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Groups</label>
                        <div class="col-sm-10">
                            <select name="groups" id="groups" class="form-control" multiple>
                                <option value="a">A</option>
                                <option value="b">B</option>
                                <option value="c">C</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Permissions</label>
                        <div class="col-sm-10">
                            <label><input type="checkbox" name="permissions" value="admin"> Admin</label>
                            <label><input type="checkbox" name="permissions" value="superman"> Superman</label>
                            <label><input type="checkbox" name="permissions" value="gay"> Gay</label>
                        </div>
                    </div>
                </form>
                <hr>
                <a href="javascript: assignFormValue()" class="btn btn-info">Assign form value</a>
                <script>
                    function assignFormValue() {
                        _.M.jForm.assignFormValue('#user_form_2', {
                            email: _.M.randomString(10) + '@yahoo.com',
                            password: _.M.randomString(_.M.randomInteger(5, 15)),
                            groups: _.sample(['a', 'b', 'c'], _.M.randomInteger(1, 3)),
                            permissions: _.sample(['admin', 'superman', 'gay'], _.M.randomInteger(1, 3))
                        });
                    }
                </script>
            </div>
        </li>
    </ul>
</div>










