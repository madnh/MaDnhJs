function testDialogButton(step) {
    var dialog = new _.M.Dialog({content: 'Demo buttons'});

    var steps = [
        {name: 'btn1', label: 'Button 1'},
        {name: 'btn2', type: _.M.BUTTON_SUCCESS, label: 'Button 2'},
        {name: 'btn3', label: 'Button 3', icon: 'glyphicon glyphicon-ok'},
        {name: 'btn4', label: 'Button 4', size: 10}
    ];

    if(!step){
        step = 1;
    }

    _.each(steps.slice(0, step), function (options) {
        dialog.attachButton(new _.M.DialogButton(options));
    });

    dialog.open();
}

function testButtonCallback() {
    var dialog = new _.M.Dialog({content: 'Demo button with callback'});

    var button_5 = new _.M.DialogButton({name: 'btn5', label: 'Click me'});

    button_5.setHandler(function() {
        alert('Clicked');
    });

    dialog.attachButton(button_5);
    dialog.open();
}

function testButtonCallbackCloseDialog() {
    var dialog = new _.M.Dialog({
        content: 'Press button to close this dialog'
    });
    dialog.attachButton(_.M.DialogButton.factory('close'));
    dialog.open();
}

function testButtonGlobalMethodDefine() {
    _.M.DialogButton.define('test', {
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
}
function testButtonGlobalMethodFactory() {
    var dialog = new _.M.Dialog({
        content: 'Test factory button'
    });
    dialog.attachMultiButtons(_.M.DialogButton.factory(_.M.DIALOG_BUTTON_YES_NO_CANCEL));
    dialog.open();
}