var hideable_dialog;

function testDialog1() {
    var dialog = new _.M.Dialog();

    dialog.option({
        title: 'Dialog title',
        content: '<p>Dialog content</p><p>with <strong>HTML</strong></p>'
    });

    dialog.open();
}

function testDialog2() {
    var dialog = new _.M.Dialog({
        content: 'Click button to change dialog content'
    });
    var button = new _.M.DialogButton({
        label: 'Click me',
        handler: function () {
            this.getDialog().updateContent((new Date()).toString());
        }
    });


    dialog.attachButton(button);
    dialog.open();
}

function openHideableDialog() {
    if (hideable_dialog) {
        return;
    }

    hideable_dialog = new _.M.Dialog({
        content: 'Click button to hide this dialog'
    });

    hideable_dialog.attachButton(new _.M.DialogButton({
        label: 'Hide',
        handler: function () {
            this.getDialog().hide();
        }
    }));
    hideable_dialog.open();
}
function showHideableDialog() {
    hideable_dialog && hideable_dialog.isHiding() && hideable_dialog.show();
}

function closeableDialog() {
    var dialog = new _.M.Dialog({
        content: 'Click button to close this dialog'
    });

    dialog.attachButton(new _.M.DialogButton({
        name: 'ok',
        label: 'OK',
        type: _.M.BUTTON_PRIMARY,
        handler: function () {
            this.getDialog().close(false, this.getCloseKey());
        }
    }));

    dialog.attachButton(new _.M.DialogButton({
        name: 'close',
        label: 'Close',
        handler: function () {
            this.closeDialog();
        }
    }));

    dialog.on('close', function (force, by) {
        alert('Ready to close by button ' + by);
    });
    dialog.on('closed', function (force, by) {
        alert('Dialog closed by button ' + by);
    });

    dialog.open();
}

function testToggleEnableDialog() {
    var dialog = new _.M.Dialog({content: 'Ohoho'}),
        time_interval;

    dialog.attachButton(new _.M.DialogButton({label: 'Button'}));
    dialog.on('toggle_enable', function (is_enabled) {
        this.updateContent('Dialog is ' + (is_enabled ? 'enabling' : 'disabled'));
    });
    dialog.on('close', function () {
        clearInterval(time_interval);
    });

    dialog.open();

    setTimeout(function () {
        time_interval = setInterval(function () {
            dialog.isEnable() ? dialog.disable() : dialog.enable();
        }, 1000);
    }, 1000);
}


function testTogglePendingDialog() {
    var dialog = new _.M.Dialog({content: 'Ohoho'});

    var pending_btn = new _.M.DialogButton({
        name: 'pending',
        label: 'Pending',
        handler: function () {
            this.getDialog().pending();
            this.hide();
            this.getOtherButton('resolved').show();
        }
    });

    var resolved_btn = new _.M.DialogButton({
        name: 'resolved',
        label: 'Resolved',
        disable_on_pending: false,
        handler: function () {
            this.getDialog().resolved();
            this.hide();
            this.getOtherButton('pending').show();
        }
    });

    var close_btn = new _.M.DialogButton({
        label: 'Close',
        handler: function () {
            this.closeDialog();
        }
    });

    dialog.attachButton(pending_btn);
    dialog.attachButton(resolved_btn);
    dialog.attachButton(close_btn);

    dialog.on('toggle_pending', function (is_pending) {
        this.updateContent('Dialog is ' + (is_pending ? 'pending' : 'resolved'));
    });

    dialog.open();
}

function testDialogDynamicContent() {
    var dialog = new _.M.Dialog();

    dialog.option('content', _.M.Dialog.dynamicContent({
        url: '/examples/ajax.php',
        method: 'POST',
        data: {
            name: 'Manh',
            sleep: 2
        }
    }));

    dialog.open();
}

function testDialogHelperAlert() {
    _.M.Dialog.alert('Xin chào :)');
}
function testDialogHelperAlertCustomTitle() {
    _.M.Dialog.alert('Xin chào :)', 'Ahihi');
}

function testDialogHelperConfirm() {
    _.M.Dialog.confirm('Bạn có chắc muốn xóa các file này?', function (button_name) {
        alert('Bạn chọn: ' + button_name);
    });
}

function testDialogIFrame() {
    _.M.Dialog.iFrame('https://www.youtube.com/embed/oofSnsGkops');
}

function testDialogIFrameWithAttributes() {
    _.M.Dialog.iFrame('https://www.youtube.com/embed/oofSnsGkops?autoplay=1', {
        attributes: {
            allowfullscreen: true
        }
    });
}

function testDialogHelperForm() {
    var template = '<div class="form-group"><label for="inputEmail3" class="col-sm-2 control-label">Email</label><div class="col-sm-10"><input type="email" name="email" class="form-control" id="inputEmail3" placeholder="Email"></div></div><div class="form-group"><label for="inputPassword3" class="col-sm-2 control-label">Password</label><div class="col-sm-10"><input type="password" name="password" class="form-control" id="inputPassword3" placeholder="Password"></div></div><div class="form-group"><label class="col-sm-2 control-label">Groups</label><div class="col-sm-10"><select  name="groups" id="groups" class="form-control" multiple><option value="a">A</option><option value="b">B</option><option value="c">C</option></select></div></div><div class="form-group"><label class="col-sm-2 control-label">Permissions</label><div class="col-sm-10"><label><input type="checkbox" name="permissions" value="admin"> Admin</label><label><input type="checkbox" name="permissions" value="superman"> Superman</label><label><input type="checkbox" name="permissions" value="gay"> Gay</label></div></div>';

    function callback(button_name, form) {
        console.log(_.M.jForm.getFormValue(form));
    }

    _.M.Dialog.form(template, callback, {
        title: 'Re-login',
        type: _.M.DIALOG_SUCCESS
    });
}

function testDialogHelperPrompt() {
    _.M.Dialog.prompt('Tên của bạn là gì?', function (name) {
        if (false === name) {
            alert('Xin chào ai đó');
        } else {
            alert('Xin chào ' + name);
        }
    }, {
        default_value: 'Mạnh'
    });
}