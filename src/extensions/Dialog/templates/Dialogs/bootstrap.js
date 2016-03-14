(function (_) {
    var version = '1.0.0';
    var default_options = {
        has_header: true,
        has_footer: true,
        close_manual: true,
        padding: true,
        overflow: 'hidden',
        buttons_align: 'right',
        pending_info: ''
    };

    var dialog_opening = 0;

    function getDialogOption(dialog) {
        var options = _.extend({}, default_options, dialog.options);

        options.buttons_align = _.M.oneOf(['right', 'left', 'center'], options.buttons_align);

        return options;
    }

    function _section_header(self, dialog, render_data) {
        var options = getDialogOption(dialog);
        var header_color = options.type ? 'bg-' + options.type : '';

        return '<div class="modal-header ' + header_color + '">' +
            '<button type="button" class="close" onclick="' + render_data.close_func + '()"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title">' + options.title + '</h4>' +
            '</div>';
    }

    function _section_body(self, dialog, render_data) {
        var options = getDialogOption(dialog);
        var content = dialog.getContent();
        var body_styles = [];

        if (!options.padding) {
            body_styles.push('padding: 0px;');
        }
        body_styles.push('overflow: ' + options.overflow + ';');

        return '<div class="modal-body" style="' + body_styles.join(' ') + '">' +
            content +
            '</div>';
    }

    function _section_footer(self, dialog, render_data) {
        var options = getDialogOption(dialog);

        var buttons = [];
        var template = '<div class="modal-footer" style="text-align: ' + options.buttons_align + ';">';
        var pending_info = '<span class="dialog-pending-info text-muted pull-' + (options.buttons_align == 'left' ? 'right' : 'left') + '">' + options.pending_info + '</span>&nbsp;&nbsp;';

        _.each(dialog.buttons, function (button) {
            buttons.push(button.render());
        });

        template += buttons.join("\n") + pending_info;
        template += '</div>';

        return template;
    }

    function _layout(self, dialog, render_data) {
        var option = getDialogOption(dialog);
        var size_class_map = {large: 'lg', small: 'sm'};
        var size = '';
        var layout = '<div class="modal fade" tabindex="-1" role="dialog" id="<%= dom_id %>" data-dialog-id="' + dialog.id + '" data-draw="<%- draw %>" data-template-id="' + self.id + '">';


        if (size_class_map.hasOwnProperty(option.size)) {
            size = 'modal-' + size_class_map[option.size];
        }

        layout += '<div class="modal-dialog ' + size + '">' +
            '<div class="modal-content">';

        if (option.has_header) {
            layout += '<%= header %>';
        }

        layout += '<%= body %>';

        if (option.has_footer) {
            layout += '<%= footer %>';
        }

        layout += '</div></div></div>';

        return layout;
    }

    function getModalOption(close_manual) {
        return {
            backdrop: close_manual ? 'static' : true,
            keyboard: !close_manual
        }
    }

    function _open_dialog() {

        var options = getDialogOption(this.getDialog());

        var modal_options = getModalOption(options.close_manual);
        var dialog = this.getDialog();

        var data = {};


        data['close_func'] = _.M.WAITER.createFunc(function () {
            this.getDialog().close();
        }.bind(this), false, 'Modal: ' + dialog.id + ' >>> Header close button');
        this.waiter_keys.push(data['close_func']);

        var template = this.render(data);

        $('body').append(template);
        console.log('Template dialog open');
        this.getDOM().modal(modal_options);

        this.getDOM().on('hidden.bs.modal', function () {
            this.getDialog().close();
        }.bind(this));
    }

    function update_dialog_close_status() {
        var closeable = this.getDialog().isCloseable();
        var modal_dom = this.getDOM();

        modal_dom.find('.modal-header .close').toggleClass('hide', !closeable);

    }

    function Bootstrap() {
        this.type_prefix = 'template_dialog_bootstrap';
        _.M.Template.call(this);

        this.waiter_keys = [];

        this.section('header', _section_header);
        this.section('body', _section_body);
        this.section('footer', _section_footer);

        this.setLayout(_layout);

        this.on('Dialog.open', _open_dialog.bind(this));
        this.on('Dialog.toggle_enable', update_dialog_close_status.bind(this));


        this.on('Dialog.close', function () {

            _.M.WAITER.remove(this.waiter_keys);
            this.waiter_keys = [];
            this.getDOM().modal('hide');
            this.getDOM().remove();

            //Fix modal-open class on body
            dialog_opening = Math.max(0, dialog_opening--);
            $('body').toggleClass('modal-open', dialog_opening > 0);
            if (dialog_opening == 0) {
                $('body .modal-backdrop').remove();
            }
        });
        this.on('Dialog.hide', function () {
            this.getDOM().hide();
            $('body .modal-backdrop').hide();
        });
        this.on('Dialog.show', function () {
            this.getDOM().show();
            $('body .modal-backdrop').show();
        });
        this.on('Dialog.update_content', function (new_content) {
            if (this.getDialog().isOpened()) {
                this.updateContent(new_content);
            }
        });

    }

    Bootstrap.prototype = Object.create(_.M.Template.prototype);
    Bootstrap.prototype.constructor = Bootstrap;
    Object.defineProperty(Bootstrap, 'version', {
        value: version
    });

    /**
     *
     * @returns {null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    Bootstrap.prototype.getDialog = function () {
        return this.dataSource;
    };

    Bootstrap.prototype.updateContent = function (new_content) {
        var options = getDialogOption(this.getDialog());

        if (!new_content) {
            new_content = options.content;
        }

        this.getDOM().find('.modal-body').html(new_content);
    };

    Bootstrap.prototype.updatePendingInfo = function (info) {
        this.getDOM().find('.dialog-pending-info').html(info);
    };


    _.M.Template.register(_.M.DIALOG_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);