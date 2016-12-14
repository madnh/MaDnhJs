var d = new M.Dialog();
var btn1 = new M.DialogButton({
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



M.Dialog.confirm('Bạn có chắc muốn xóa các tập tin này??', null, {
    title: 'Xóa tập tin',
    type: M.DIALOG_DANGER
});