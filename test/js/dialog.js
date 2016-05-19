var d = new _.M.Dialog();
var btn1 = new _.M.DialogButton({
    name: 'btn1',
    type: 'success'
});

d.option({
    content: 'ahihi',
    title: 'ohoho'
});

btn1.option({
    handler: function () {
        this.getDialog().close();
    }
});
d.attachButton(btn1);

d.open();



_.M.Dialog.confirm('Bạn có chắc muốn xóa các tập tin này??', null, {
    title: 'Xóa tập tin',
    type: _.M.DIALOG_DANGER
});