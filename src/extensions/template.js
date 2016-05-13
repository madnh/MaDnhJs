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

    Template.prototype.setSection = function (name, content) {
        this._sections[name.toUpperCase()] = content;
    };

    Template.prototype.setSections = function (sections) {
        _.each(sections, function (content, name) {
            this.setSection(name, content);
        }.bind(this));
    };

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

        sub_sections = _.object(sub_sections, _.M.repeat('', sub_sections.length, true));
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
            _data = _.extend({}, _.isObject(data) ? data : {}, {
                option: this.options,
                datasource: this.getDataSource()
            }),
            _sections = _.extend({}, this._sections),
            layout;

        _.M.nextID(this.id + '_draw');
        _data.draw = this.currentDraw();
        _data.dom_id = this.getDOMID();

        _.extend(_data, this.prepareData(_data));

        if (_.isFunction(this._layout)) {
            layout = this._layout(self, this.dataSource, _data);
        } else {
            layout = this._layout + '';
        }

        layout = renderContent(layout, this, _sections, _data);

        return _.template(layout)(_data);
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

    _.M.isTemplateInstance = function (template) {
        return template instanceof Template;
    };
    _.M.Template = Template;
})(_);