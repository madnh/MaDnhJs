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

