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