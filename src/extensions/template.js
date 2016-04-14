(function (_) {
    var version = '1.0.0';

    var _templates = {
        compilers: {},
        rendered: {},
        types: {}
    };

    /**
     ==============================================================
     Template Constructor
     ==============================================================
     **/


    function getHookContent(template, contents) {
        var result = [];

        _.each(contents, function (content) {
            if (_.isFunction(content)) {
                result.push(content.call(template));
            } else {
                result.push(content.toString());
            }
        });

        return result.join('');
    }

    /**
     *
     * @param sections
     * @param layout
     * @constructor
     */
    function Template(sections, layout) {
        _.M.EventEmitter.call(this);

        this.dataSource = null;

        this._layout = '';
        this._sections = {};

        if (!_.isUndefined(layout)) {
            self.setLayout(layout);
        }

        if (_.isObject(sections)) {
            _.each(sections, function (section_name, cb) {
                self.section(section_name, cb);
            })
        }
    }

    Template.prototype = Object.create(_.M.EventEmitter.prototype);
    Template.prototype.constructor = Template;
    Object.defineProperty(Template, 'version', {
        value: version
    });


    /**
     * Connect to data source
     * @param {(Object|_.M.EventEmitter)} dataSource
     * @returns {Template}
     */
    Template.prototype.connect = function (dataSource) {
        if (this.dataSource !== null) {
            this.disconnect();
        }
        this.dataSource = dataSource;

        if (_.M.isEventEmitter(dataSource)) {
            this.attachHardTo(dataSource);
        }
        this.emitEvent('connected');

        return this;
    };

    /**
     * Dis connect from data source
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

    Template.prototype.setLayout = function (layout) {
        this._layout = layout;
    };

    Template.prototype.getLayout = function () {
        return this._layout;
    };

    Template.prototype.section = function (name, handler) {
        this._sections[name] = handler;
    };

    Template.prototype.currentDraw = function () {
        return _.M.currentID(this.id + '_draw', false);
    };
    Template.prototype.getDOMID = function () {
        return _.M.currentID(this.id + '_draw');
    };
    /**
     * Render and return template
     * @param {Object} data External data
     * @param {Object} sections External sections value
     * @returns {string}
     */
    Template.prototype.render = function (data, sections) {
        var self = this;
        var _data = {};

        _.M.nextID(this.id + '_draw');
        _data.draw = this.currentDraw();
        _data.dom_id = this.getDOMID();


        if (_.isObject(data)) {
            _.extend(_data, data);
        }
        if (!_.isObject(sections)) {
            sections = {};
        }
        _.each(this._sections, function (section_cb, section_name) {
            if (!sections.hasOwnProperty(section_name)) {
                if (_.isFunction(section_cb)) {
                    _data[section_name] = section_cb(self, self.dataSource, _data);
                } else {
                    _data[section_name] = section_cb;
                }
            }
        });

        _.extend(_data, sections);

        var layout = '';
        if (_.isFunction(this._layout)) {
            layout = this._layout(self, this.dataSource, _data);
        } else {
            layout = this._layout.toString();
        }


        return _.template(layout)(_data);
    };

    /**
     * Replace rendered DOM
     * Emit events:
     * - redraw
     * - drawn(new_content)
     *
     * @param {Object} data External data
     * @param {Object} sections External sections value
     * @returns {boolean}
     */
    Template.prototype.reDraw = function (data, sections) {
        var dom = this.getDOM();

        if (dom) {
            var new_content = this.render(data, sections);

            this.emitEvent('redraw');
            dom.first().replaceWith(new_content);
            this.emitEvent('drawn', new_content);

            return true;
        }

        return false;
    };

    Template.prototype.getDOM = function () {
        return $('#' + this.getDOMID());
    };

    /**
     * Return new Template instance with this layout, sections
     * @returns {Template|*}
     */
    Template.prototype.extend = function () {
        var target = new this.constructor;

        target.setLayout(this._layout);
        _.each(this._sections, function (section_cb, section) {
            target.section(section, section_cb);
        });

        return target;
    };


    /**
     ==============================================================
     STATIC METHODS
     ==============================================================
     **/


    /**
     * Check if a compiler is exists
     * @param name
     */
    Template.hasCompiler = function (name) {
        return _.has(_templates.compilers, name);
    };

    /**
     * Get compiler list | Get compiler by name | add compiler
     * @param {string} name
     * @param {function} compiler
     * @returns {*}
     */
    Template.compiler = function (name, compiler) {
        if (arguments.length == 0) {
            return Object.keys(_templates.compilers);
        }
        if (_.isUndefined(compiler)) {
            return this.hasCompiler(name) ? _templates.compilers[name] : null;
        }
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
            return _.M.callFunc(_templates.compilers[name], [data], this);
        }
        return false;
    };

    /**
     * Check if rendered content is exists
     * @param {string} name
     */
    Template.hasRendered = function (name) {
        return _.has(_templates.rendered, name);
    };

    /**
     * Add rendered content | Get list of rendered contents | Get rendered content
     * @param {string} name
     * @param {string} [content]
     * @returns {(String[]|string)}
     */
    Template.rendered = function (name, content) {
        if (arguments.length == 0) {
            return Object.keys(_templates.rendered);
        }
        if (_.isUndefined(content)) {
            return this.hasRendered(name) ? _templates.rendered[name] : null;
        }
        _templates.rendered[name] = content;
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
     * @returns {Array}
     */
    Template.types = function () {
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
     * Get default template name
     * @param {string} type
     * @returns {string|boolean} False on fail
     */
    Template.defaultTemplate = function (type) {
        if (!_.isEmpty(_templates.types[type].constructors)) {
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


    /**
     * Extend a template constructor
     * @param {string} type
     * @param {string} name Name of template constructor, if missing then return first constructor of type's templates
     * @returns {Template|*|void|*}
     */
    Template.extend = function (type, name) {
        var instance = this.templateInstance.apply(this, _.toArray(arguments));

        return instance.extend();
    };


    _.M.isTemplateInstance = function (template) {
        return template instanceof Template;
    };
    _.M.Template = Template;
})(_);