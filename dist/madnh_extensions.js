;(function (_) {
    var _dom_plugins = {};

    /*
     |--------------------------------------------------------------------------
     | DOM Plugin
     |--------------------------------------------------------------------------
     */

    _.App.hasDOMPlugin = function (name) {
        return _dom_plugins.hasOwnProperty(name);
    };

    /**
     * Add jQuery Plugin callback
     * @param {string} name plugin name, default is unique id
     * @param {function} callback Callback, call arguments are: dom, options
     * @param {object} options Default options
     */
    _.App.addDOMPlugin = function (name, callback, options) {
        _dom_plugins[name] = {
            callback: callback,
            options: _.isObject(options) ? options : {}
        };
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    _.App.removeDOMPlugin = function (name) {

        name = _.flatten(_.toArray(arguments));

        _.each(name, function (tmp_name) {
            delete _dom_plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    _.App.applyDOMPlugin = function (selector_or_dom, plugins, options) {
        var parameters = _.M.optionalArgs(_.toArray(arguments), ['selector', 'plugins', 'options'], {
            selector: function (arg) {
                return _.isString(arg) || arg instanceof $;
            },
            plugins: 'Array',
            options: 'Object'
        });

        selector_or_dom = $(parameters.selector || 'body');
        plugins = parameters.plugins || Object.keys(_dom_plugins);
        options = parameters.options || {};

        var not_found = _.difference(plugins, Object.keys(_dom_plugins));
        if (!_.isEmpty(not_found)) {
            throw new Error(['Apply not found DOM plugin: ', not_found.join(', ')].join(''));
        }

        _.each(plugins, function (plugin) {
            var _options = _.has(options, plugin) ? options[plugin] : {};
            _dom_plugins[plugin].callback(selector_or_dom, _.extend({}, _dom_plugins[plugin].options, _options));
        });
    };
})(_);
;(function (_) {
    var version = '1.0.0';

    /**
     ==============================================================
     Template Constructor
     ==============================================================
     **/

    /**
     *
     * @param sections
     * @param layout
     * @constructor
     */
    function Template(sections, layout) {
        this.type_prefix = 'template';
        _.M.EventEmitter.call(this);

        this.dataSource = null;
        this.options = {};
        this._layout = '';
        this._sections = {};

        if (!_.isUndefined(layout)) {
            self.setLayout(layout);
        }

        if (_.isObject(sections)) {
            _.each(sections, function (section_name, cb) {
                self.setSection(section_name, cb);
            });
        }
    }

    Template.prototype = Object.create(_.M.EventEmitter.prototype);
    Template.prototype.constructor = Template;
    Object.defineProperty(Template, 'version', {
        value: version
    });

    /**
     *
     * @param {string|object} option
     * @param {*} [value]
     * @returns {Template}
     */
    Template.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    /**
     * Connect to data source
     * @param {(Object|_.M.EventEmitter)} data_source
     * @returns {Template}
     */
    Template.prototype.connect = function (data_source) {
        if (this.dataSource !== null) {
            this.disconnect();
        }
        this.dataSource = data_source;

        if (_.M.isEventEmitter(data_source)) {
            this.attachHardTo(data_source);
        }
        this.emitEvent('connected');

        return this;
    };

    /**
     * Disconnect from data source
     * @returns {boolean} Disconnect result
     */
    Template.prototype.disconnect = function () {
        if (this.dataSource !== null) {
            this.emitEvent('before_disconnect');
            if (_.M.isEventEmitter(this.dataSource)) {
                this.dataSource.removeListener(this.id);
                this.dataSource.detach(this);
            }
            this.dataSource = null;
            this.emitEvent('disconnected');

            return true;
        }

        return false;
    };

    /**
     * Get data source
     * @returns {Object|*|null}
     */
    Template.prototype.getDataSource = function () {
        return this.dataSource;
    };

    /**
     * Check if connected to data source
     * @returns {boolean}
     */
    Template.prototype.isConnected = function () {
        return this.dataSource !== null;
    };

    /**
     *
     * @param {string|function} layout If is function then this func will receive parameters: template instance, object to display, render data
     * @returns {Template}
     */
    Template.prototype.setLayout = function (layout) {
        this._layout = layout;

        return this;
    };

    Template.prototype.getLayout = function () {
        return this._layout;
    };

    /**
     *
     * @param {string|{}} name Section name or object with name and value of sections
     * @param {string|function} [content] Value of section, on case parameter name is string.
     * If is function then that function will receive parameters: template instance, object to display, render data
     * @returns {Template}
     */
    Template.prototype.setSection = function (name, content) {
        if (_.isObject(name)) {
            _.each(name, function (value, key) {
                this._sections[key.toUpperCase()] = value;
            }.bind(this));
        } else {
            this._sections[name.toUpperCase()] = content;
        }

        return this;
    };

    /**
     *
     * @returns {boolean|number}
     */
    Template.prototype.currentDraw = function () {
        return _.M.currentID(this.id + '_draw', false);
    };
    Template.prototype.getDOMID = function () {
        return this.id;
    };

    function getSubSections(str) {
        var re = new RegExp('@([A-Z0-9_\-]+)@', 'gi'),
            result = [], tmp_match;

        while ((tmp_match = re.exec(str)) !== null) {
            result.push(tmp_match[1]);
        }

        return result;
    }

    function renderContent(content, instance, sections, data) {
        var result = '', sub_sections = [];

        if (_.isFunction(content)) {
            result = content(instance, instance.dataSource, data);
        } else {
            result = content + '';
        }
        sub_sections = getSubSections(result);

        var missing_subsections = _.difference(sub_sections, Object.keys(sections));
        if (!_.isEmpty(missing_subsections)) {
            console.warn('Missing subsections:', missing_subsections);
            _.each(missing_subsections, function (missing_subsection) {
                sections[missing_subsection] = '';
                sub_sections[missing_subsection] = '';
            });
        }

        sub_sections = _.zipObject(sub_sections, _.fill(new Array(sub_sections.length), ''));
        if (!_.isEmpty(sub_sections)) {
            _.each(sub_sections, function (sub_section_value, sub_section_name) {
                sections[sub_section_name] = renderContent(sections[sub_section_name], instance, sections, data);
                sub_sections[sub_section_name] = sections[sub_section_name];
            });

            _.each(sub_sections, function (sub_section_value, sub_section_name) {
                result = result.replace(new RegExp('@' + sub_section_name.toUpperCase() + '@', 'gi'), sub_section_value);
            });
        }

        return result;
    }

    Template.prototype.prepareData = function () {
        return {};
    };

    /**
     * Render and return template
     * @param {Object} [data = {}] External data
     * @returns {string}
     */
    Template.prototype.render = function (data) {
        var self = this,
            _data = _.extend({}, {
                option: this.options,
                data_source: this.getDataSource()
            }),
            _sections = _.extend({}, this._sections),
            layout;

        _.M.nextID(this.id + '_draw');
        _data.draw = this.currentDraw();
        _data.dom_id = this.getDOMID();

        _.extend(_data, this.prepareData(_data), _.isObject(data) ? data : {});

        if (_.isFunction(this._layout)) {
            layout = this._layout(self, this.dataSource, _data);
        } else {
            layout = this._layout + '';
        }

        layout = renderContent(layout, this, _sections, _data);

        return _.template(layout)(_data);
    };
    Template.prototype.rendered = function () {
    };

    /**
     * Replace rendered DOM
     * Emit events:
     * - redraw
     * - drawn(new_content)
     *
     * @param {Object} [data] External data
     * @returns {boolean}
     */
    Template.prototype.reDraw = function (data) {
        var dom = this.getDOM();

        if (dom) {
            var new_content = this.render(data);

            this.emitEvent('re-draw');
            dom.first().replaceWith(new_content);
            this.emitEvent('drawn', new_content);
            this.rendered();

            return true;
        }

        return false;
    };

    Template.prototype.getDOM = function () {
        return $('#' + this.getDOMID());
    };


    /**
     ==============================================================
     STATIC METHODS
     ==============================================================
     **/

    var _templates = {
        compilers: {},
        types: {}
    };

    /**
     * Check if a compiler is exists
     * @param name
     */
    Template.hasCompiler = function (name) {
        return _.has(_templates.compilers, name);
    };

    /**
     * Add compiler
     * @param {string} name
     * @param {function} compiler
     * @returns {*}
     */
    Template.compiler = function (name, compiler) {
        _templates.compilers[name] = compiler;
    };
    /**
     * Get compilers name
     * @returns {Array}
     */
    Template.compilers = function () {
        return Object.keys(_templates.compilers);
    };
    /**
     * Render a compiler
     * @param {string} name
     * @param {*} data
     * @returns {(string|boolean)}
     */
    Template.render = function (name, data) {
        if (this.hasCompiler(name)) {
            if (arguments.length == 1) {
                data = {};
            }
            return _templates.compilers[name](data);
        }
        return false;
    };

    /**
     * Register Template constructor
     * @param {string} type
     * @param {string} name
     * @param {Template} constructor
     * @returns {boolean}
     */
    Template.register = function (type, name, constructor) {
        if (!_templates.types.hasOwnProperty(type)) {
            _templates.types[type] = {
                _default: null,
                constructors: {}
            };
        }

        if (!_templates.types[type].hasOwnProperty(name)) {
            _templates.types[type].constructors[name] = constructor;

            if (!_templates.types[type]._default) {
                _templates.types[type]._default = name;
            }

            return true;
        }

        return false;
    };

    /**
     * Return Template type list
     * @param {boolean} [detail]
     * @returns {Array}
     */
    Template.types = function (detail) {
        if(detail){
            return _.mapObject(_templates.types, function (type_detail) {
                return Object.keys(type_detail.constructors);
            });
        }

        return Object.keys(_templates.types);
    };

    /**
     * Check if Template type is exists
     * @param {string} type
     * @returns {boolean}
     */
    Template.hasType = function (type) {
        return _templates.types.hasOwnProperty(type);
    };

    /**
     * Return templates of type
     * @param {string} type
     * @param {boolean} [name_only=false] Return template name only
     * @returns {Array}
     */
    Template.templates = function (type, name_only) {
        if (name_only) {
            return Object.keys(_templates.types[type].constructors);
        }

        return _.clone(_templates.types[type].constructors);
    };

    /**
     * Check if template with name is exists
     * @param {string} type
     * @param {string} name
     * @returns {boolean}
     */
    Template.hasTemplate = function (type, name) {
        return _templates.types.hasOwnProperty(type) && _templates.types[type].constructors.hasOwnProperty(name);
    };

    /**
     * Set/Get default template name
     * @param {string} type
     * @param {string} [default_template] Name of default template. If missing then this func return default template of template type
     * @returns {string|boolean} False on fail
     */
    Template.defaultTemplate = function (type, default_template) {
        if (!_.isEmpty(_templates.types[type].constructors)) {
            if (default_template) {
                if (_templates.types[type].constructors.hasOwnProperty(default_template)) {
                    _templates.types[type]._default = default_template;

                    return true;
                } else {
                    throw new Error('Set default template with invalid template name');
                }
            }
            if (_templates.types[type]._default && this.hasTemplate(type, _templates.types[type]._default)) {

                return _templates.types[type]._default;
            }

            var name = Object.keys(_templates.types[type].constructors)[0];

            _templates.types[type]._default = name;

            return new _templates.types[type].constructors[name];
        }

        return false;
    };

    /**
     * Get template instance
     * @param {string} type
     * @param {string} [name] Name of template constructor, if missing then return first constructor of type's templates
     */
    Template.templateInstance = function (type, name) {
        if (arguments.length < 2) {
            var default_name = this.defaultTemplate(type);

            if (false !== default_name) {
                return new _templates.types[type].constructors[default_name];
            }
        } else if (this.hasTemplate(type, name)) {
            return new _templates.types[type].constructors[name];
        }

        throw new Error('Template with name isn\'t exists or invalid type');
    };

    _.M.isTemplateInstance = function (template) {
        return template instanceof Template;
    };
    _.M.Template = Template;
})(_);
;(function (_) {
    var version = '1.0.0';
    var jForm = {};

    function _is_checked_value(value) {
        return -1 !== [true, 'true', 'on', 1, '1'].indexOf(value);
    }


    Object.defineProperty(jForm, 'version', {
        value: version
    });

    jForm.disable = function (selector) {
        $(selector).attr('disabled', 'disabled').prop('disabled', true);
    };

    jForm.enable = function (selector) {
        $(selector).removeAttr('disabled').prop('disabled', false);
    };


    jForm.getSelectOptionTagByValue = function (name, values, container) {
        var queries = _.map(_.castArray(values), function (value) {
            return 'option[value="' + value + '"]';
        });

        return $(container || 'body').find('select[name="' + name + '"]').first().find(queries.join(', '));
    };

    jForm.setSelectTagValue = function (name, values, container) {
        $(container || 'body').find('select[name="' + name + '"]').val(_.castArray(values));
    };

    jForm.removeSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).remove();
    };

    jForm.disableSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).attr('disabled', 'disabled').prop('disabled', true);
    };
    jForm.enableSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).removeAttr('disabled', 'disabled').prop('disabled', false);
    };
    jForm.setRadioTagValue = function (name, value, container) {
        container = $(container || 'body');

        container.find("input:radio[name='" + name + "']:checked").prop('checked', false).removeAttr('checked');
        container.find("input:radio[name='" + name + "'][value=" + value + "]").prop('checked', true).attr('checked', 'checked');
    };

    jForm.getRadioTagValue = function (name, container) {
        return $(container || 'body').find("input:radio[name ='" + name + "']:checked").first().val();
    };


    jForm.setCheckBoxStatus = function (selector, is_checked) {
        var checkbox = $(selector);
        checkbox.prop('checked', is_checked);

        if (is_checked) {
            checkbox.attr('checked', 'checked');
        } else {
            checkbox.removeAttr('checked');
        }
    };

    jForm.getCheckboxTagsByValue = function (name, values, container) {
        var queries = _.map(_.castArray(values), function (value) {
            return 'input[type="checkbox"][name="' + name + '"][value="' + value + '"]';
        });

        return $(container || 'body').find(queries.join(', '));
    };

    jForm.setCheckBoxValue = function (name, values, container) {
        container = $(container || 'body');

        var checkboxes = container.find('input[type="checkbox"][name="' + name + '"]');


        if (checkboxes.length === 1 && (_.isString(values) || _.isNumber(values) || _.isBoolean(values))) {
            if (_is_checked_value(values)) {
                checkboxes.attr('checked', 'checked').prop('checked', true);
            } else {
                checkboxes.removeAttr('checked').prop('checked', false);
            }

            return;
        }

        checkboxes.removeAttr('checked').prop('checked', false);
        jForm.getCheckboxTagsByValue(name, values, container).attr('checked', 'checked').prop('checked', true);
    };
    function get_input_name_as_deep(name) {
        return name.replace(/]/g, '').replace(/\[/g, '.');
    }
    function parser_element_value(element, container, result) {
        if (!element.attr('name')) {
            return;
        }

        var name = element.attr('name');
        var name_as_deep = get_input_name_as_deep(name);
        var value = element.val();

        if (element.attr('type') === 'checkbox') {
            if(element.is(':checked')){
                var checkbox_value = value.length ? value : true;

                if (container.find('input[name="' + name + '"]').length > 1) {
                    if (element.is(':checked')) {
                        try{
                            _.M.appendDeep(result, name_as_deep, checkbox_value);
                        }catch (ex){
                            _.set(result, name_as_deep, [checkbox_value]);
                        }
                    }
                } else {
                    if(_.isBoolean(checkbox_value)){
                        _.set(result, name_as_deep, 'on');
                    } else {
                        _.set(result, name_as_deep + '.' + checkbox_value, 'on');
                    }
                }
            }
        } else {
            _.set(result, name_as_deep, value);
        }
    }

    /**
     *
     * @param {string} form
     * @returns {{}}
     */
    jForm.getFormValue = function (form) {
        var elements = $(form).find('input:not(input[type="radio"]), textarea, select, input[type="radio"]:checked');
        var result = {};

        elements.each(function () {
            parser_element_value($(this), form, result);
        });

        return result;
    };


    /**
     * Assign data to form
     * @param form
     * @param data
     * @param prefix
     * @returns {boolean}
     */
    jForm.assignFormValue = function (form, data, prefix) {
        form = $(form);

        if (!form.length) {
            return false;
        }

        if (!_.isString(prefix) || _.isEmpty(prefix)) {
            prefix = "";
        }
        _.each(data, function (value, key) {
            var key_with_prefix = prefix + key;
            var elements = form.find('*[name="' + key_with_prefix + '"]');

            if (elements.length) {
                var first_element = elements.first();

                if (first_element.is('input') || first_element.is('textarea')) {
                    if (first_element.is(':radio')) {
                        jForm.setRadioTagValue(key_with_prefix, value, form);
                    } else if (first_element.is(':checkbox')) {
                        jForm.setCheckBoxValue(key_with_prefix, value, form);
                    } else {
                        first_element.val(value);
                    }
                } else if (first_element.is('select')) {
                    jForm.setSelectTagValue(key_with_prefix, value, form);
                } else if (first_element.is('a, button')) {
                    first_element.html(value);
                }
            }
        });

        return true;
    };

    _.M.jForm = jForm;
})(_);
;(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        DIALOG_PRE_OPTIONS_NAME: '_.M.Dialog',
        DIALOG_TEMPLATE_TYPE: 'Dialog',
        DIALOG_STATUS_INITIAL: 'initial',
        DIALOG_STATUS_OPENED: 'opened',
        DIALOG_STATUS_HIDING: 'hiding',
        DIALOG_STATUS_CLOSED: 'removed',

        DIALOG_INFO: 'info',
        DIALOG_SUCCESS: 'success',
        DIALOG_PRIMARY: 'primary',
        DIALOG_WARNING: 'warning',
        DIALOG_DANGER: 'danger',

        DIALOG_SIZE_SMALL: 'small',
        DIALOG_SIZE_NORMAL: 'normal',
        DIALOG_SIZE_LARGE: 'large'
    });

    var _dialogs = {};

    function _default_closable_func(dialog_instance) {
        return dialog_instance.isEnable();
    }

    function _default_clickable_func(dialog_instance) {
        return dialog_instance.isEnable();
    }

    _.M.PreOptions.define(_.M.DIALOG_PRE_OPTIONS_NAME, {
        title: 'Dialog',
        type: _.M.DIALOG_INFO,
        content: '',
        content_handler: null,
        template_name: '',
        template: {},
        size: _.M.DIALOG_SIZE_NORMAL,
        closable: _default_closable_func,
        clickable: _default_clickable_func
    });

    function resetDialog(id) {
        var data = {
            status: _.M.DIALOG_STATUS_INITIAL,
            enabled: true,
            pending: false,
            loading: false,
            ajax_worker: null,
            template_instance: null
        };
        if (_dialogs.hasOwnProperty(id)) {
            data.template_instance = _dialogs[id].template_instance;
        }

        _dialogs[id] = data;
    }


    /**
     * Can add events to dialog by add events to option parameter field as 'events'
     * Add buttons via options parameter field as 'buttons'
     * @param {Object} [options] Dialog options
     * @constructor
     * @extend _.M.EventEmitter
     */
    function Dialog(options) {
        this.type_prefix = 'dialog';
        var self = this;
        _.M.EventEmitter.call(this);

        this.options = _.M.PreOptions.get(_.M.DIALOG_PRE_OPTIONS_NAME);

        this.closed_by = '';
        this.data = {};
        this.buttons = {};

        resetDialog(this.id);

        this.option(this.options);

        if (options) {
            if (options.hasOwnProperty('events') && options.events) {
                this.addListeners(options.events);
                delete options['events'];
            }

            if (options.hasOwnProperty('buttons') && options.buttons) {
                _.each(options.buttons, function (button) {
                    self.attachButton(button);
                });
                delete options['buttons'];
            }

            this.option(options);
        }
    }

    _.M.inherit(Dialog, _.M.EventEmitter);
    Object.defineProperty(Dialog, 'version', {
        value: version
    });

    /**
     * Setup default options
     * @param {{}} options
     */
    Dialog.globalOption = function (options) {
        _.M.PreOptions.update(_.M.DIALOG_PRE_OPTIONS_NAME, options);
    };

    function updateDialogContentCallback(content) {
        if (_.isFunction(this.options.content_handler)) {
            content = this.options.content_handler(content, this);
        }
        this.emitEvent('content_loaded', content);
        this.updateContent(content);
    }

    Dialog.prototype.getContent = function () {
        if (_.isFunction(this.options.content)) {
            this.emitEvent('load_content');
            this.options.content = this.options.content(updateDialogContentCallback.bind(this), this);
        }

        if (_.isFunction(this.options.content_handler)) {
            return this.options.content_handler(this.options.content, this);
        }

        return this.options.content;
    };

    Dialog.prototype.updateContent = function (new_content) {
        this.options.content = new_content;

        if (this.isOpened()) {
            this.emitEvent('update_content', new_content);
        }
    };

    Dialog.prototype.setTemplate = function (template_instance) {
        if (!this.isIniting()) {
            throw new Error('Dialog is opened');
        }
        if (!_.M.isTemplateInstance(template_instance)) {
            throw new Error('Invalid Template instance');
        }

        if (_dialogs[this.id].template_instance) {
            _dialogs[this.id].template_instance.disconnect();
            _dialogs[this.id].template_instance = null;
        }

        template_instance.option(this.options.template);
        _dialogs[this.id].template_instance = template_instance;
        template_instance.connect(this);
    };

    /**
     * Get template instance
     * @returns {null|_.M.Template}
     */
    Dialog.prototype.getTemplate = function () {
        if (!_dialogs[this.id].template_instance) {
            if (!this.options.template_name) {
                var default_options = _.M.PreOptions.get(_.M.DIALOG_PRE_OPTIONS_NAME);

                if (default_options.template_name && _.M.Template.hasTemplate(_.M.DIALOG_TEMPLATE_TYPE, default_options.template_name)) {
                    this.options.template_name = default_options.template_name;
                } else {
                    var default_template = _.M.Template.defaultTemplate(_.M.DIALOG_TEMPLATE_TYPE);

                    if (false !== default_template) {
                        this.options.template_name = default_template;
                        _.M.PreOptions.update(_.M.DIALOG_PRE_OPTIONS_NAME, {
                            template_name: default_template
                        });
                    } else {
                        throw new Error('Dialog default template not found');
                    }
                }
            }


            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_TEMPLATE_TYPE, this.options.template_name));
        }

        return _dialogs[this.id].template_instance;
    };

    Dialog.prototype.option = function (name, value) {
        var option = _.M.beObject.apply(_.M, _.toArray(arguments));

        if (option.template_name) {
            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_TEMPLATE_TYPE, option.template_name));
        }
        if (option.template) {
            this.getTemplate().option(option.template);
        }

        _.extend(this.options, option);

        return this;
    };

    /**
     * Get dialog status
     * @returns {string|boolean}
     */
    Dialog.prototype.status = function () {
        if (_dialogs.hasOwnProperty(this.id)) {
            return _dialogs[this.id].status;
        }

        return false;
    };

    Dialog.prototype.isIniting = function () {
        return this.status() === _.M.DIALOG_STATUS_INITIAL;
    };

    /**
     * Check if dialog status is: opened, showing or hiding
     * @returns {boolean}
     */
    Dialog.prototype.isOpened = function () {
        return -1 !== [_.M.DIALOG_STATUS_OPENED, _.M.DIALOG_STATUS_HIDING].indexOf(this.status());
    };

    /**
     * Check if dialog is showing
     * @returns {boolean}
     */
    Dialog.prototype.isVisibling = function () {
        return this.status() === _.M.DIALOG_STATUS_OPENED;
    };

    /**
     * Check if dialog is hiding
     * @returns {boolean}
     */
    Dialog.prototype.isHiding = function () {
        return this.status() === _.M.DIALOG_STATUS_HIDING;
    };

    /**
     * Check if dialog is closed
     * @returns {boolean}
     */
    Dialog.prototype.isClosed = function () {
        return this.status() === _.M.DIALOG_STATUS_CLOSED;
    };

    /**
     * Check if dialog is enabled
     * @returns {boolean}
     */
    Dialog.prototype.isEnable = function () {
        return Boolean(_dialogs[this.id].enabled);
    };

    /**
     * Check if dialog is pending
     * @returns {boolean}
     */
    Dialog.prototype.isPending = function () {
        return Boolean(_dialogs[this.id].pending);
    };

    /**
     * Enable dialog when it is disabled
     * Emit events when enabled success:
     * - enabled:
     * - toggle_enable:
     *   + 0: true if change event is enable
     *
     * @returns {boolean} True on enable success, otherwise.
     */
    Dialog.prototype.enable = function () {
        if (!this.isEnable()) {
            _dialogs[this.id].enabled = true;
            this.emitEvent('enabled');
            this.emitEvent('toggle_enable', true);
            return true;
        }
        return false;
    };

    /**
     * Disable dialog when it is enabling
     * Emit events when disable success:
     * - disabled:
     * - toggle_enable:
     *   + 0: false if change event is disable
     *
     * @returns {boolean} True on disable success, otherwise.
     */
    Dialog.prototype.disable = function () {
        if (this.isEnable()) {
            _dialogs[this.id].enabled = false;
            this.emitEvent('disabled');
            this.emitEvent('toggle_enable', false);
            return true;
        }
        return false;
    };
    /**
     * Set pending status is pending
     * Emit events when change success:
     * - pending:
     * - toggle_pending:
     *   + 0: true if change to pending
     *
     * @returns {boolean} True on change success, otherwise.
     */
    Dialog.prototype.pending = function () {
        if (!this.isPending()) {
            _dialogs[this.id].pending = true;
            this.emitEvent('pending');
            this.emitEvent('toggle_pending', true);
            return true;
        }
        return false;
    };

    /**
     * Set pending status is resolved
     * Emit events when change success:
     * - resolved:
     * - toggle_pending:
     *   + 0: false if change to resolved
     *
     * @returns {boolean} True on change success, otherwise.
     */
    Dialog.prototype.resolved = function () {
        if (this.isPending()) {
            _dialogs[this.id].pending = false;
            this.emitEvent('resolved');
            this.emitEvent('toggle_pending', false);
            return true;
        }
        return false;
    };

    /**
     *
     * @param {_.M.DialogButton|object} button DialogButton instance or button options
     */
    Dialog.prototype.attachButton = function (button) {
        if (!_.M.isDialogButton(button)) {
            if (_.isObject(button)) {
                button = new _.M.DialogButton(button);
            } else if ((_.isString(button) || _.isNumber(button)) && _.M.DialogButton.has(button)) {
                button = _.M.DialogButton.factory(button);
            } else {
                throw new Error('Invalid button');
            }
        }

        this.buttons[button.options.name] = button;
        this.attachHard(button);

        return button;
    };

    Dialog.prototype.attachMultiButtons = function (buttons) {
        var self = this;

        _.each(buttons, function (button) {
            self.attachButton(button);
        });
    };

    /**
     * Check if button exists
     * @param {string} name
     * @returns {boolean}
     */
    Dialog.prototype.hasButton = function (name) {
        return this.buttons.hasOwnProperty(name);
    };

    /**
     * Get button instance
     * @param {string} name Button name
     * @returns {_.M.DialogButton}
     * @throw Get unattached button
     */
    Dialog.prototype.getButton = function (name) {
        if (!this.hasButton(name)) {
            throw new Error('Get unattached button');
        }

        return this.buttons[name];
    };

    Dialog.prototype.removeButton = function (name) {
        if (!this.hasButton(name)) {
            throw new Error('Remove unattached button');
        }
        this.detach(this.buttons[name]);
        delete this.buttons[name];
    };

    /**
     * Check if dialog is clickable
     * @returns {boolean}
     */
    Dialog.prototype.isClickable = function () {
        if (this.options.clickable) {
            if (_.isFunction(this.options.clickable)) {
                return this.options.clickable(this);
            }
            return Boolean(this.options.clickable);
        }

        return true;
    };

    Dialog.prototype.click = function (button_name) {
        if (this.isClickable() && this.hasButton(button_name)) {
            var button = this.getButton(button_name);

            button.click();
            this.emitEvent('clicked', button_name);
        }
        return false;
    };

    /**
     * Check if dialog is closeable
     * @returns {boolean}
     */
    Dialog.prototype.isCloseable = function () {
        if (this.isOpened()) {
            if (this.options.closable) {
                if (_.isFunction(this.options.closable)) {
                    return this.options.closable(this);
                }

                return Boolean(this.options.closable);
            }

            return true;
        }

        return false;
    };

    Dialog.prototype.open = function () {
        if (this.status() === _.M.DIALOG_STATUS_INITIAL) {
            if (!_dialogs[this.id].template_instance) {
                this.getTemplate();
            }

            this.closed_by = '';
            _dialogs[this.id].status = _.M.DIALOG_STATUS_OPENED;
            this.emitEvent('open');

            return true;
        }

        return false;
    };

    /**
     * Hide dialog
     * @returns {boolean}
     */
    Dialog.prototype.hide = function () {
        if (this.isVisibling()) {
            this.emitEvent('hide');
            _dialogs[this.id].status = _.M.DIALOG_STATUS_HIDING;

            return true;
        }

        return false;
    };

    /**
     * Show dialog
     * @returns {boolean}
     */
    Dialog.prototype.show = function () {
        if (this.isHiding()) {
            this.emitEvent('show');
            _dialogs[this.id].status = _.M.DIALOG_STATUS_OPENED;

            return true;
        }

        return false;
    };


    /**
     * Close dialog
     * Emit event:
     * - close
     * @param {boolean} force Force close dialog
     * @param {string} by close caller
     */
    Dialog.prototype.close = function (force, by) {
        if (!this.isClosed() && (force || this.isCloseable())) {
            by = by || '';
            this.emitEvent('close', [force, by]);
            resetDialog(this.id);
            _dialogs[this.id].status = _.M.DIALOG_STATUS_CLOSED;
            this.closed_by = by;
            this.emitEvent('closed', [force, by]);
            this.resetEvents();

            return true;
        }

        return false;
    };

    /**
     * Update closed by value
     * @param {string|_.M.DialogButton} button
     * @returns {boolean}
     */
    Dialog.prototype.setClosedBy = function (button) {
        if (this.isClosed()) {
            if (!button) {
                button = '';
            }

            if (_.M.isDialogButton(button)) {
                button = button.getCloseKey();
            }

            if (!_.isString(button)) {
                button += '';
            }

            this.closed_by = button;

            return true;
        }

        return false;
    };

    /**
     * Check if a button was close dialog
     * @param {string|_.M.DialogButton} button
     * @returns {boolean}
     */
    Dialog.prototype.isClosedBy = function (button) {
        if (this.isClosed()) {
            if (!button) {
                button = '';
            }

            if (_.M.isDialogButton(button)) {
                button = button.getCloseKey();
            }

            if (!_.isString(button)) {
                button += '';
            }

            return this.closed_by === button;
        }

        return false;
    };


    Dialog.prototype.getDOM = function () {
        if (_dialogs[this.id].template_instance && _.M.isTemplateInstance(_dialogs[this.id].template_instance)) {
            return _dialogs[this.id].template_instance.getDOM();
        }

        return false;
    };

    _.M.Dialog = Dialog;

    /**
     * Check if object is Dialog instance
     * @param dialog
     * @returns {boolean}
     */
    _.M.isDialog = function (dialog) {
        return dialog instanceof Dialog;
    };
})(_);
;(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        DIALOG_BUTTON_PRE_OPTIONS_NAME: '_.M.DialogButton',
        DIALOG_BUTTON_TEMPLATE_TYPE: 'DialogButton',
        BUTTON_INFO: 'info',
        BUTTON_PRIMARY: 'primary',
        BUTTON_SUCCESS: 'success',
        BUTTON_WARNING: 'warning',
        BUTTON_DANGER: 'danger'
    });
    _.M.defineConstant({
        BUTTON_OK: 'ok',
        BUTTON_CANCEL: 'cancel',
        BUTTON_YES: 'yes',
        BUTTON_NO: 'no',
        BUTTON_RETRY: 'retry',

        DIALOG_BUTTON_OK_ONLY: ['ok'],
        DIALOG_BUTTON_OK_CANCEL: ['ok', 'cancel'],
        DIALOG_BUTTON_YES_NO: ['yes', 'no'],
        DIALOG_BUTTON_YES_NO_CANCEL: ['yes', 'no', 'cancel'],
        DIALOG_BUTTON_RETRY_CANCEL: ['retry', 'cancel']
    });


    var _buttons = {};

    _.M.PreOptions.define(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
        label: 'Untitled',
        icon: '',
        type: _.M.BUTTON_INFO,
        size: 1,
        handler: null,
        disable_on_pending: true,
        clickable: _default_clickable_cb,
        template_name: '',
        template: {}
    });
    function _default_clickable_cb(button) {
        return button.isVisible() && button.isEnable() && button.getDialog().isClickable();
    }

    function DialogButton(option) {
        this.type_prefix = 'dialog_button';
        _.M.EventEmitter.call(this);

        this.options = _.M.PreOptions.get(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
            name: this.id
        });

        _buttons[this.id] = {
            dialog: null,
            enabled: true,
            visible: true,
            template_instance: null
        };

        this.option(this.options);

        if (option) {
            if (option.hasOwnProperty('events')) {
                this.addListeners(option.events);
                delete option['events'];
            }

            this.option(option);
        }

        _init_btn(this);
    }

    function _init_btn(instance) {
        instance.on('attached', _btn_event_attached);
        instance.on('detached', _btn_event_detached);
        instance.on('dialog.toggle_enable', _btn_event_dialog_toggle_enable);
        instance.on('dialog.toggle_pending', _btn_event_dialog_toggle_pending);
    }

    function _btn_event_attached(dialog) {
        if (dialog instanceof _.M.Dialog) {
            _buttons[this.id].dialog = dialog;
        }
    }

    function _btn_event_detached(dialog) {
        if (dialog instanceof _.M.Dialog) {
            _buttons[this.id].dialog = null;
        }
    }

    function _btn_event_dialog_toggle_enable(notice_data) {
        this.toggleEnable(notice_data.data);
    }

    function _btn_event_dialog_toggle_pending(notice_data) {
        if (notice_data.data) {
            if (this.options.disable_on_pending) {
                this.toggleEnable(false);
            }
        } else {
            this.toggleEnable(true);
        }

    }

    _.M.inherit(DialogButton, _.M.EventEmitter);
    Object.defineProperty(DialogButton, 'version', {
        value: version
    });

    /**
     *
     * @param {{}} options
     */
    DialogButton.globalOption = function (options) {
        _.M.PreOptions.update(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, options);
    };

    DialogButton.prototype.setTemplate = function (template_instance) {
        if (!_.M.isTemplateInstance(template_instance)) {
            throw new Error('Invalid Template instance');
        }

        if (_buttons[this.id].template_instance) {
            _buttons[this.id].template_instance.disconnect();
            _buttons[this.id].template_instance = null;
        }
        template_instance.option(this.options.template);
        _buttons[this.id].template_instance = template_instance;
        template_instance.connect(this);
    };

    /**
     * Get template instance
     * @returns {null|*}
     */
    DialogButton.prototype.getTemplate = function () {
        if (!_buttons[this.id].template_instance) {
            if (!this.options.template_name) {
                var default_options = _.M.PreOptions.get(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME);

                if (default_options.template_name && _.M.Template.hasTemplate(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, default_options.template_name)) {
                    this.options.template_name = default_options.template_name;
                } else {
                    var default_template = _.M.Template.defaultTemplate(_.M.DIALOG_BUTTON_TEMPLATE_TYPE);

                    if (false !== default_template) {
                        this.options.template_name = default_template;
                        _.M.PreOptions.update(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
                            template_name: default_template
                        });
                    } else {
                        throw new Error('Dialog button default template not found');
                    }
                }
            }


            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, this.options.template_name));
        }

        return _buttons[this.id].template_instance;
    };

    DialogButton.prototype.option = function (name, value) {
        var option = _.M.beObject.apply(_.M, _.toArray(arguments));

        if (option.template_name) {
            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, option.template_name));
        }
        if (option.template) {
            this.getTemplate().option(option.template);
        }

        _.extend(this.options, _.omit(option, ['template_name']));

        return this;
    };

    DialogButton.prototype.setHandler = function (callback) {
        this.option('handler', callback);
    };

    /**
     * Get dialog instance
     * @returns {(_.M.Dialog|boolean)} False if not attach to dialog yet
     */
    DialogButton.prototype.getDialog = function () {
        if (_buttons[this.id].dialog) {
            return _buttons[this.id].dialog;
        }

        return false;
    };

    DialogButton.prototype.isClickable = function () {
        if (_.isFunction(this.options.clickable)) {
            return this.options.clickable.call(this, this);
        }

        return Boolean(this.options.clickable);
    };

    DialogButton.prototype.isVisible = function () {
        return Boolean(_buttons[this.id].visible);
    };
    DialogButton.prototype.isEnable = function () {
        return Boolean(_buttons[this.id].enabled);
    };

    /**
     * Click button
     * Emit events:
     * - click: run before button handler run
     * - clicked: rung after button handler run
     *
     * @returns {boolean}
     */
    DialogButton.prototype.click = function () {
        if (this.isClickable()) {
            this.emitEvent('click');
            if (this.options.handler) {
                _.M.callFunc(this.options.handler, this, this);
            }
            this.emitEvent('clicked');

            return true;
        }

        return false;
    };

    /**
     * Show or hide button
     * Emit events:
     * - show/hide
     * - toggle: [is show?]
     * @param {boolean} show True or missing: show, False: hide
     */
    DialogButton.prototype.toggle = function (show) {
        if (_.isUndefined(show)) {
            show = !_buttons[this.id].visible;
        }

        if (_buttons[this.id].visible != show) {
            _buttons[this.id].visible = show;
            if (show) {
                this.emitEvent('show');
            } else {
                this.emitEvent('hide');
            }

            this.emitEvent('toggle', show);
        }
    };
    DialogButton.prototype.show = function () {
        this.toggle(true);
    };
    DialogButton.prototype.hide = function () {
        this.toggle(false);
    };

    /**
     * Toggle enabled status
     * Emit events:
     * - enabled/disabled
     * - toggle_enabled: [is enabled?]
     * @param is_enable
     */
    DialogButton.prototype.toggleEnable = function (is_enable) {
        if (_.isUndefined(is_enable)) {
            is_enable = !_buttons[this.id].enabled;
        }

        if (_buttons[this.id].enabled !== is_enable) {
            _buttons[this.id].enabled = is_enable;
            this.emitEvent(is_enable ? 'enabled' : 'disabled');
            this.emitEvent('toggle_enable', is_enable);
        }
    };

    DialogButton.prototype.disable = function () {
        this.toggleEnable(false);
    };
    DialogButton.prototype.enable = function () {
        this.toggleEnable(true);
    };


    DialogButton.prototype.render = function () {
        return this.getTemplate().render();
    };

    /**
     * Refresh button DOM
     * @returns {boolean}
     */
    DialogButton.prototype.reDraw = function () {
        if (_buttons[this.id].template_instance) {
            return _buttons[this.id].template_instance.reDraw();
        }

        return false;
    };

    /**
     *
     * @returns {boolean}
     */
    DialogButton.prototype.getDOM = function () {
        if (_buttons[this.id].template_instance && _.M.isTemplateInstance(_buttons[this.id].template_instance)) {
            return _buttons[this.id].template_instance.getDOM();
        }

        return false;
    };

    /**
     *
     * @param name
     * @returns {_.M.DialogButton|null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    DialogButton.prototype.getOtherButton = function (name) {
        return this.getDialog().getButton(name);
    };

    /**
     * Dialog close "by" key
     * @returns {string}
     */
    DialogButton.prototype.getCloseKey = function () {
        return this.options.name;
    };

    /**
     * Close dialog
     * @param force
     * @returns {boolean}
     */
    DialogButton.prototype.closeDialog = function (force) {
        var dialog = this.getDialog();

        if (dialog) {
            dialog.close(force, this.getCloseKey());
            return true;
        }

        return false;
    };

    /**
     * Check if dialog closed by this button
     * @returns {boolean}
     */
    DialogButton.prototype.wasCloseDialog = function () {
        var dialog = this.getDialog();

        if (dialog) {
            return dialog.setClosedBy(this);
        }

        return false;
    };


    /*
     |--------------------------------------------------------------------------
     | Static methods
     |--------------------------------------------------------------------------
     |
     |
     |
     |
     */

    var button_pre_options = {};

    DialogButton.isDefined = function (name) {
        return button_pre_options.hasOwnProperty(name);
    };

    DialogButton.define = function (name, options, freeze_options) {
        button_pre_options[name] = {
            options: _.isObject(options) ? options : {},
            freeze_options: _.isObject(freeze_options) ? freeze_options : {}
        };
        button_pre_options[name].freeze_options.name = name;
    };

    DialogButton.updateOptions = function (name, options) {
        if (DialogButton.isDefined(name)) {
            _.extend(button_pre_options[name].options, options);
            return true;
        }

        return false;
    };

    DialogButton.factory = function (types, all_button_options, button_options) {
        if (!_.isObject(all_button_options)) {
            all_button_options = {};
        }
        if (!_.isObject(button_options)) {
            button_options = {};
        }

        var buttons = _.castArray(types).map(function (type) {
            var options, type_options;

            if (!DialogButton.isDefined(type)) {
                throw new Error('Dialog Button type is unregistered');
            }

            type_options = button_pre_options[type];
            options = _.extend({},
                type_options.options,
                _.clone(all_button_options),
                button_options.hasOwnProperty(type) ? button_options[type] : {},
                type_options.freeze_options);

            return new DialogButton(options);
        });

        if (buttons.length == 1) {
            return buttons.shift();
        }

        return buttons;
    };

    DialogButton.defaultClickable = _default_clickable_cb;

    _.M.DialogButton = DialogButton;

    /**
     * Check if object is DialogButton instance
     * @param button
     * @returns {boolean}
     */
    _.M.isDialogButton = function (button) {
        return button instanceof DialogButton;
    };

    /*
     |--------------------------------------------------------------------------
     | Predefine button types
     |--------------------------------------------------------------------------
     |
     |
     |
     |
     */

    _.each(['Ok', 'Yes', 'No', 'Retry', 'Ignore'], function (label) {
        DialogButton.define(label.toLowerCase(), {
            label: label
        });
    });

    DialogButton.define('cancel', {
        label: 'Cancel',
        disable_on_pending: false
    });


    (function (_) {
        _.M.defineConstant({
            BUTTON_CLOSE: 'close'
        });

        function _close_dialog_handler(button) {
            var dialog = button.getDialog();

            if (dialog) {
                button.closeDialog(Boolean(button.options.force));
            }
        }

        DialogButton.define(_.M.BUTTON_CLOSE, {
            label: 'Close',
            type: _.M.BUTTON_INFO,
            force: false
        }, {
            handler: _close_dialog_handler
        });
    })(_);
})(_);
/*
 |--------------------------------------------------------------------------
 | Dynamic content
 |--------------------------------------------------------------------------
 |
 |
 |
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME: '_.M.Dialog.DynamicContent'
    });
    _.M.PreOptions.define(_.M.DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME, {
        loading: 'Loading content...'
    });

    /**
     * Return content as function which provide dynamic content via AJAX.
     * Change dialog's pending status on start complete request
     * Dialog will emit events:
     * - load_content: AJAX begin request
     * - load_content_failed: AJAX error
     * - load_content_complete: AJAX complete
     *
     * @param {Object} options _.M.AJAX options. Default options:
     * - error_content: default error content if AJAX error. 'Get dynamic content failed'
     * - loading: default loading content. 'Loading content...'.
     *
     * @returns {Function}
     */
    _.M.Dialog.dynamicContent = function (options) {
        var content = null;

        options = _.M.PreOptions.get(_.M.DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME, options);

        return function (update_content_cb, dialog) {
            if (!_.isNull(content)) {
                return content;
            }
            var aw = new _.M.AJAX(_.omit(options, 'loading'));

            aw.done(function (response) {
                content = response + '';
                update_content_cb(content);
            });

            aw.fail(function () {
                dialog.emitEvent('load_content_failed');
                update_content_cb(options.error_content || 'Get dynamic content failed');
            });

            aw.option('before_send', function () {
                dialog.emitEvent('load_content');
                dialog.pending();

                return true;
            });

            aw.always(function () {
                dialog.emitEvent('load_content_complete');
                dialog.resolved();
            });

            aw.request();

            return options.loading;
        }
    };
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Alert
 |--------------------------------------------------------------------------
 |
 | 
 | 
 | 
 */

;(function (_) {
    _.M.defineConstant({
        DIALOG_ALERT_PRE_OPTIONS_NAME: '_.M.Dialog.Alert'
    });
    _.M.PreOptions.define(_.M.DIALOG_ALERT_PRE_OPTIONS_NAME, {
        title: 'Alert',
        close_button_options: {}
    });

    /**
     *
     * @param {string} message
     * @param {string|object} options String: title, object: options
     * @returns {*|Dialog}
     */
    _.M.Dialog.alert = function (message, options) {
        if (!_.isObject(options)) {
            options = {
                title: options + ''
            }
        }

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_ALERT_PRE_OPTIONS_NAME, options), {
            content: message
        });

        var dialog = new _.M.Dialog(_.omit(options, 'close_button_options'));

        dialog.attachButton(_.M.DialogButton.factory('close', options.close_button_options));

        dialog.open();

        return dialog;
    };
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Confirm
 |--------------------------------------------------------------------------
 |
 |
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_CONFIRM_PRE_OPTIONS_NAME: '_.M.Dialog.Confirm'
    });
    _.M.PreOptions.define(_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME, {
        title: 'Confirm',
        default_button: null,
        buttons: []
    });
    /**
     *
     * @param message
     * @param callback
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.confirm = function (message, callback, options) {
        var dialog;

        if (!_.isObject(options)) {
            options = {
                title: options + ''
            }
        }
        if (!_.isFunction(callback)) {
            callback = _.noop;
        }

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME, options), {
            content: message
        });

        if (_.isEmpty(options.buttons)) {
            options.buttons = _.M.DialogButton.factory(_.M.DIALOG_BUTTON_YES_NO);
        }

        dialog = new _.M.Dialog(_.omit(options, 'default_button'));

        _.each(dialog.buttons, function (button) {
            button.setHandler(function () {
                this.closeDialog();
                callback(this.options.name);
            });
        });

        if (!options.default_button) {
            options.default_button = _.last(Object.keys(dialog.buttons));
        }

        //Default button
        dialog.on('closed', function () {
            if (!this.closed_by) {
                _.M.callFunc(callback, options.default_button, null);
            }
        }, {
            key: 'default_button'
        });

        dialog.open();

        return dialog;
    };
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog iFrame
 |--------------------------------------------------------------------------
 |
 |
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_IFRAME_PRE_OPTIONS_NAME: '_.M.Dialog.iFrame'
    });
    _.M.PreOptions.define(_.M.DIALOG_IFRAME_PRE_OPTIONS_NAME, {
        title: 'iFrame',
        attributes: {}
    });
    /**
     *
     * @param url
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.iFrame = function (url, options) {
        var dialog,
            attrs = [],
            template = [];

        if (!_.isObject(options)) {
            options = {
                title: options + ''
            }
        }

        options = _.M.PreOptions.get(_.M.DIALOG_IFRAME_PRE_OPTIONS_NAME, options);

        _.each(options.attributes, function (val, key) {
            if (_.isBoolean(val)) {
                if (val) {
                    attrs.push(key + '="' + key + '"');
                }
            } else {
                attrs.push(key + '="' + val + '"');
            }
        });

        template.push('<div class="embed-responsive embed-responsive-16by9">');
        template.push('<iframe class="embed-responsive-item" src="' + url + '" ' + attrs.join(' ') + '></iframe>');
        template.push('</div>');

        options.content = template.join("\n");
        dialog = new _.M.Dialog(options);

        dialog.open();

        return dialog;
    };

})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Form
 |--------------------------------------------------------------------------
 | - Buttons: submit, close
 | - Options:
 |  + form_classes: form classes, string or array of string
 |  + message_classes: form message div classes, string or array of string. Default is "dialog_form_message"
 |  + buttons: add other buttons
 |  + buttons_option: object with button's name and button options
 |  + submit_button: default submit button name. Dialog will trigger callback with this button when the form is submit without button click
 |  + close_button: default close button name. Dialog will trigger callback with dialog close without button click
 |  + validator: form validator callback. Return true on valid or string for errors. If return string then dialog will show error on message div.
 |      Arguments:
 |      - form DOM
 |      - button instance
 |      - dialog instance
 |
 |
 |- Dialog data:
 |  + form_selector: form selector
 |  + form_message_selector: form message div selector
 |  + update_message: update form message. Arguments: message. If arg message fail then hide message
 |  + btn_handler: default button click handler, that valid form, show message on error and call callback.
 |      If button is close button then close dialog before call callback. Useful for custom button
 |      Arguments:
 |      - btn: button instance
 |
 |- Form callback:
 |      Arguments:
 |      - button name:
 |      - form DOM:
 |      - button instance:
 |      - dialog instance:
 |
 |
 |
 |
 |
 */
;(function (_) {
    _.M.DialogButton.define('submit', {
        label: 'Submit'
    });

    _.M.defineConstant({
        BUTTON_SUBMIT: 'submit',
        DIALOG_BUTTON_SUBMIT_CANCEL: ['submit', 'cancel']
    });

    _.M.defineConstant({
        DIALOG_FORM_PRE_OPTIONS_NAME: '_.M.Dialog.Form'
    });
    _.M.PreOptions.define(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, {
        title: 'Form',
        form_classes: '',
        message_classes: 'dialog_form_message',
        validator: null,
        auto_focus: true,
        submit_button_name: 'submit',
        cancel_button_name: 'cancel',
        buttons: [],
        buttons_extend_options: {}
    });

    /**
     *
     * @param {(string|function)} content
     * @param {function} callback Callback arguments: button name, form DOM, button instance, dialog instance
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.form = function (content, callback, options) {
        var dialog = new _.M.Dialog();

        if (!_.isFunction(callback)) {
            callback = _.noop;
        }
        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, options), {
            content: content,
            content_handler: dialogFormContentHandler
        });

        if (_.isEmpty(options.buttons)) {
            options.buttons = _.M.DialogButton.factory(_.M.DIALOG_BUTTON_SUBMIT_CANCEL, {}, {
                cancel: {
                    handler: createCancelButtonHandler(callback)
                },
                submit: {
                    handler: createButtonsHandler(callback, options)
                }
            });
        }

        dialog.option(
            _.omit(options, ['form_classes', 'message_classes', 'validator', 'submit_button_name',
                'cancel_button_name', 'buttons', 'buttons_extend_options'])
        );

        _.each(options.buttons, function (button) {
            var attached_button = dialog.attachButton(button);

            if (options.buttons_extend_options.hasOwnProperty(attached_button.options.name)) {
                attached_button.option(_.clone(options.buttons_extend_options[attached_button.options.name]));
            }
        });

        addDialogData(dialog, options);
        addDialogMethods(dialog, options);
        addDialogEvents(dialog, options);

        dialog.open();

        if (options.auto_focus) {
            setTimeout(function () {
                dialog.getDOM().find('input:visible, textarea:visible').first().focus();
            }, 500);
        }

        return dialog;
    };

    function createCancelButtonHandler(callback) {
        return function (button) {
            var dialog = button.getDialog();

            button.closeDialog(true);
            _.M.callFunc(callback, [button.options.name, null, button, dialog], dialog);
        }
    }

    function createButtonsHandler(callback, options) {
        return function (button) {
            var dialog_instance = this.getDialog(),
                form = $(dialog_instance.data['form_selector']),
                validate_result = true;

            updateFormMessage(dialog_instance, false);

            if (options.validator) {
                validate_result = options.validator(form, dialog_instance);
            }
            if (true !== validate_result) {
                updateFormMessage(dialog_instance, validate_result);

                return;
            }

            _.M.callFunc(callback, [button.options.name, form, button, dialog_instance], dialog_instance);
        }
    }

    function dialogFormContentHandler(content) {
        return ['<form><div class="dialog_form_message"></div>', content, '<input type="submit" style="display: none;"/></form>'].join('');
    }

    function classesToSelector(classes) {
        if (!_.isArray(classes)) {
            (classes + '').split(' ');
        }
        classes = _.flatten(_.castArray(classes));

        if (!_.isEmpty(classes)) {
            return _.map(classes, function (class_name) {
                return class_name.trim() ? '.' + class_name : '';
            }).join('');
        }

        return '';
    }

    function updateFormMessage(dialog, message) {
        var message_dom = $(dialog.data['form_selector'] + ' ' + dialog.data['form_message_selector']);

        if (message_dom.length) {
            if (message) {
                message_dom.html(message).show();
            } else {
                message_dom.html('').hide();
            }
        }
    }

    function addDialogData(dialog, options) {
        var dialog_dom_id = '#' + dialog.getTemplate().getDOMID();
        var form_selector = dialog_dom_id + ' form' + classesToSelector(options.form_classes);
        var form_message_selector = form_selector + ' ' + options.message_classes ? classesToSelector(options.message_classes) : '.dialog_form_message';

        dialog.data['form_selector'] = form_selector;
        dialog.data['form_message_selector'] = form_message_selector;
    }

    function addDialogMethods(dialog) {
        dialog.getFormDOM = function () {
            return $(dialog.data['form_selector']);
        };

        dialog.updateFormMessage = function (message) {
            updateFormMessage(dialog, message);
        };

        dialog.clearFormMessage = function () {
            updateFormMessage(dialog, false);
        };
        dialog.getFormData = function () {
            if (!_.M.jForm) {
                console.warn('Method getFormData require module jForm');
                return {};
            }

            return _.M.jForm.getFormData(this.getFormDOM());
        }
    }

    function addDialogEvents(dialog, options) {
        function form_submit_event_listener(event) {
            event.preventDefault();

            if (options.submit_button_name) {
                dialog.click(options.submit_button_name);
            }

            return false;
        }

        dialog.on('open', function () {
            $('body').on('submit', this.data['form_selector'], form_submit_event_listener);
        });

        dialog.on('closed', function () {
            if (!this.closed_by && options.cancel_button_name) {
                if (!this.hasButton(options.cancel_button_name)) {
                    throw new Error('Invalid default button');
                }

                this.buttons[options.cancel_button_name].click();
            }
        }, {
            key: 'default_close_button'
        });

        dialog.on('closed', function () {
            $('body').off('submit', this.data['form_selector'], form_submit_event_listener);
        });
    }
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Prompt
 |--------------------------------------------------------------------------
 | - options:
 |      + value: current value
 |      + input_type: text, password,...
 |      + input_classes: class of input
 |
 | - callback: callback have 1 argument is value of prompt
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_PROMPT_PRE_OPTIONS_NAME: '_.M.Dialog.prompt'
    });
    _.M.PreOptions.define(_.M.DIALOG_PROMPT_PRE_OPTIONS_NAME, {
        title: 'Prompt',
        default_value: '',
        placeholder: '',
        input_type: 'text',
        input_classes: 'form-control',
        buttons_extend_options: {
            submit: {
                label: 'Ok'
            }
        }
    });

    _.M.Dialog.prompt = function (message, callback, options) {
        var content = [],
            dialog;

        if (!_.isObject(options)) {
            options = {
                title: options + ''
            };
        }
        if (!_.isFunction(callback)) {
            callback = _.noop;
        }

        options = _.M.PreOptions.get(_.M.DIALOG_PROMPT_PRE_OPTIONS_NAME, options);

        content.push('<p>', message, '</p>');
        content.push('<input name="prompt_data" type="', options.input_type + '" ',
            'class="', options.input_classes + '" ',
            'value="', options.default_value + '"',
            'placeholder="', options.placeholder + '"',
            '/>');

        function prompt_cb(btn_name, form, btn) {
            if (!form) {
                callback(false);
                return;
            }

            var value = options.default_value;

            if ('submit' === btn_name) {
                value = form.find('input[name="prompt_data"]').val();
                btn.closeDialog();
            }

            callback(value);
        }

        dialog = _.M.Dialog.form(content.join(''), prompt_cb, _.omit(options, 'default_value', 'placeholder', 'input_type', 'input_classes'));

        return dialog;
    }
})(_);
;(function (_) {
    var version = '1.0.0';
    _.M.defineConstant({
        DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME: '_.M.Dialog.Template.Bootstrap'
    });
    _.M.PreOptions.define(_.M.DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME, {
        has_header: true,
        has_footer: true,
        close_manual: true,
        padding: true,
        overflow: 'hidden',
        buttons_align: 'right',
        pending_info: ''
    });

    var dialog_opening = 0;


    function _section_header(self, dialog, render_data) {
        var header_color = dialog.options.type ? 'bg-' + dialog.options.type : '';

        return '<div class="modal-header ' + header_color + '">' +
            '<button type="button" class="close" onclick="' + render_data.close_func + '()"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title">' + dialog.options.title + '</h4>' +
            '</div>';
    }

    function _section_body(self, dialog, render_data) {
        var content = dialog.getContent();
        var body_styles = [];

        if (!this.options.padding) {
            body_styles.push('padding: 0px;');
        }
        body_styles.push('overflow: ' + this.options.overflow + ';');

        return ['<div class="modal-body" style="', body_styles.join(' '), '">', content, '</div>'].join('');
    }

    function _section_footer(self, dialog, render_data) {
        var buttons = [];
        var template = '<div class="modal-footer" style="text-align: ' + this.options.buttons_align + ';">';
        var pending_info = '<span class="dialog-pending-info text-muted pull-' + (this.options.buttons_align === 'left' ? 'right' : 'left') + '">' + this.options.pending_info + '</span>&nbsp;&nbsp;';

        _.each(dialog.buttons, function (button) {
            buttons.push(button.render());
        });

        template += buttons.join("\n") + pending_info;
        template += '</div>';

        return template;
    }

    function _layout(self, dialog, render_data) {
        var size_class_map = {large: 'lg', small: 'sm'};
        var size = '';
        var layout = ['<div class="modal fade" tabindex="-1" role="dialog" id="<%= dom_id %>" data-dialog-id="', dialog.id, '" data-draw="<%- draw %>">'];


        if (size_class_map.hasOwnProperty(this.options.size)) {
            size = 'modal-' + size_class_map[this.options.size];
        }

        layout.push('<div class="modal-dialog ', size, '">', '<div class="modal-content">');

        if (this.options.has_header) {
            layout.push('@HEADER@');
        }

        layout.push('@BODY@');

        if (this.options.has_footer) {
            layout.push('@FOOTER@');
        }

        layout.push('</div></div></div>');

        return layout.join('');
    }

    function getModalOption(close_manual) {
        return {
            backdrop: close_manual ? 'static' : true,
            keyboard: !close_manual
        }
    }

    function _open_dialog() {
        var modal_options = getModalOption(this.options.close_manual),
            dialog = this.getDialog(),
            data = {},
            template;

        data['close_func'] = _.M.WAITER.createFunc(function () {
            this.getDialog().close();
        }.bind(this), true, 'Modal: ' + dialog.id + ' >>> Header close button');

        this.waiter_keys.push(data['close_func']);

        template = this.render(data);

        $('body').append(template);
        _setDialogDOMEvents(this);
        this.getDOM().modal(modal_options);
    }

    function _setDialogDOMEvents(instance) {
        var dom = instance.getDOM();

        dom.on('show.bs.modal', function (event) {
            if ($(event.target).is(dom)) {
                dialog_opening++;
                instance.emitEvent('show');
            }
        });

        dom.on('shown.bs.modal', function (event) {
            if ($(event.target).is(dom)) {
                $('body .modal-backdrop').last().attr('id', 'modal-backdrop_' + instance.id);
                instance.emitEvent('shown');
            }
        });

        dom.on('hide.bs.modal', function (event) {
            if ($(event.target).is(dom)) {
                instance.emitEvent('hide');
            }
        });

        dom.on('hidden.bs.modal', function (event) {
            if ($(event.target).is(dom)) {
                instance.emitEvent('hidden');
                instance.getDialog().close();
            }
        });
    }

    function update_dialog_close_status() {
        var closeable = this.getDialog().isCloseable();
        var modal_dom = this.getDOM();

        modal_dom.find('.modal-header .close').toggleClass('hide', !closeable);

    }

    function Bootstrap() {
        if (!$.fn.modal) {
            throw new Error('Dialog Bootstrap template require Bootstrap Modal to work');
        }

        this.type_prefix = 'template_dialog_bootstrap';
        _.M.Template.call(this);
        this.options = _.M.PreOptions.get(_.M.DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME);

        this.waiter_keys = [];
        this.setLayout(_layout);
        this.setSection('HEADER', _section_header.bind(this));
        this.setSection('BODY', _section_body.bind(this));
        this.setSection('FOOTER', _section_footer.bind(this));

        this.mimic('open', 'toggle_enable', 'close', 'hide', 'show', 'update_content');

        this.on('open', _open_dialog.bind(this));
        this.on('toggle_enable', update_dialog_close_status.bind(this));
        this.on('close', function () {
            _.M.WAITER.remove(this.waiter_keys);
            this.waiter_keys = [];
            this.getDOM().modal('hide');
            this.getDOM().remove();

            //Fix modal-open class on body
            dialog_opening = Math.max(0, --dialog_opening);
            $('body').toggleClass('modal-open', dialog_opening > 0);

            if (!dialog_opening) {
                $('body .modal-backdrop').remove();
            }
            $('#modal-backdrop_' + this.id).remove();
        });
        this.on('hide', function () {
            this.getDOM().hide();
            $('#modal-backdrop_' + this.id).hide();
        });
        this.on('show', function () {
            this.getDOM().show();
            $('#modal-backdrop_' + this.id).show();
        });
        this.on('update_content', function (new_content) {
            if (this.getDialog().isOpened()) {
                this.updateContent(new_content);
            }
        });

    }

    _.M.inherit(Bootstrap, _.M.Template);
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
        if (!new_content) {
            new_content = this.getDialog().options.content;
        }

        this.getDOM().find('.modal-body').html(new_content);
    };

    Bootstrap.prototype.updatePendingInfo = function (info) {
        this.getDOM().find('.dialog-pending-info').html(info);
    };


    _.M.Template.register(_.M.DIALOG_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);
;(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        DIALOG_BUTTON_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME: '_.M.DialogButton.Template.Bootstrap'
    });

    _.M.PreOptions.define(_.M.DIALOG_BUTTON_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME, {
        icon_class: 'dialog_button_icon',
        label_class: 'dialog_button_label'
    });

    function _section_icon(instance, data_source, data) {
        if (data_source.options.icon) {
            return '<span class="<%= option.icon_class %>"><i class="<%= data_source.options.icon %>"></i></span>&nbsp;&nbsp;';
        }
        return '';
    }

    function _layout(instance, data_source, data) {
        var size = _.clamp(data_source.options.size - 1, 0, 4),
            padding_space = _.repeat('&nbsp;&nbsp;', size * 3),
            template = '',
            style = [];

        if (!data_source.isVisible()) {
            style.push('display: none');
        }

        template += '<button type="button" id="<%= dom_id %>" data-button-id="<%= data_source.id %>"';
        template += 'data-draw="<%- draw %>" style="' + style.join('; ') + '"';
        template += 'class="btn btn-<%= data_source.options.type %>" data-name="<%= data_source.options.name %>" ';
        template += 'onclick="' + instance.click_key + '()"';

        if (!data_source.isEnable()) {
            template += ' disabled="disabled"';
        }

        template += '>';
        template += padding_space + '@ICON@@LABEL@' + padding_space + '</button>';

        return template;
    }


    function Bootstrap() {
        this.type_prefix = 'template_dialog_button_bootstrap';
        _.M.Template.call(this);

        var self = this;

        this.options = _.M.PreOptions.get(_.M.DIALOG_BUTTON_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME);

        this.setLayout(_layout);
        this.setSection('ICON', _section_icon.bind(this));
        this.setSection('LABEL', '<span class="<%= option.label_class %>"><%= data_source.options.label %></span>');

        this.click_key = _.M.WAITER.createFunc(function () {
            self.getButton().click();
        });

        this.mimic('toggle', 'toggle_enable');

        this.on('toggle', function (noticed_data) {
            this.getDOM().toggle(noticed_data.data);
        });
        this.on('toggle_enable', function (noticed_data) {
            if (noticed_data) {
                this.getDOM().removeAttr('disabled');
            } else {
                this.getDOM().attr('disabled', 'disabled');
            }

            this.getDOM().prop('disabled', !noticed_data);
        });

    }

    _.M.inherit(Bootstrap, _.M.Template);

    Object.defineProperty(Bootstrap, 'version', {
        value: version
    });

    /**
     *
     * @returns {null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    Bootstrap.prototype.getButton = function () {
        return this.dataSource;
    };

    Bootstrap.prototype.updateLabel = function (label) {
        this.getDOM().find('.' + this.options.label_class).html(label);
    };

    Bootstrap.prototype.updateIcon = function (icon) {

        this.getDOM().find('.' + this.options.icon_class).html('<i class="' + icon + '"></i>');
    };


    _.M.Template.register(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);