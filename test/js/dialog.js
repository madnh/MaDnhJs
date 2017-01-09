var d = new Dialog();
var btn1 = new DialogButton({
    name: 'btn1',
    type: 'success',
    label: 'Ok'
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


Dialog.confirm('Bạn có chắc muốn xóa các tập tin này??', null, {
    title: 'Xóa tập tin',
    type: Dialog.TYPE_DANGER
});