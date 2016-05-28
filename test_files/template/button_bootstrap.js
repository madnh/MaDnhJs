function changeButtonIconAndLabel() {
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
}