/***************************************************************************
 *   TAG extension for MaDnhJS                                              *
 *   @version 1.0.0                                                         *
 *   @author Do Danh Manh                                                   *
 *   @email dodanhmanh@gmail.com                                            *
 *   @licence MIT                                                           *
 ***************************************************************************/

;(function (_) {
    var version = '1.0.0';
    var thisModule = {};

    Object.defineProperty(thisModule, 'VERSION', {
        value: version
    });


    function TAG() {
        this.name = 'div';
        this._attr = {};
        this._data = {};
        this.content = '';
        this.isEmpty = false
    }

    Object.defineProperty(TAG, 'version', {
        value: version
    });

    /**
     * Clone this tag, remove id in cloned tag
     * @return TAG
     */
    TAG.prototype.clone = function () {
        var obj = new this.constructor();
        obj.name = this.name;
        obj._attr = _.clone(this._attr);
        obj._data = _.clone(this._data);
        obj.content = _.clone(this.content);
        obj.isEmpty = Boolean(this.isEmpty);
        obj.id('');

        return obj;
    };
    TAG.prototype.valueOf = function () {
        return this.toString();
    };
    TAG.prototype.toString = function () {
        var tag_arr = ['<' + this.name],
            attributes = {},
            old_style,
            old_class;


        if (this.hasAttr('class')) {
            old_class = _.clone(this._attr['class']);
            this._attr['class'] = _.uniq(this._attr['class']).join(' ');
        }

        if (this.hasAttr('style')) {
            old_style = _.clone(this._attr['style']);
            this._attr['style'] = _.map(this._attr['style'], function (style_value, style_name) {
                return style_name + ' : ' + style_value;
            }).join('; ');
        }

        _.each(this._attr, function (attr_value, attr_name) {
            attributes[attr_name] = attr_name + '="' + attr_value.toString().replace('&', '&amp;').replace('"', '&quote;') + '"';
        });
        _.each(this._data, function (data_value, data_name) {
            attributes['data-' + data_name] = 'data-' + data_name + '="' + data_value.toString().replace('&', '&amp;').replace('"', '&quote;') + '"';
        });

        if (!_.isEmpty(attributes)) {
            tag_arr.push(' ' + _.values(attributes).join(' '));
        }

        if (this.isEmpty) {
            tag_arr.push('/>');
        } else {
            tag_arr.push('>');

            _.each(_.M.beArray(this.content), function (tmp_children) {
                tag_arr.push(tmp_children + '');
            });

            tag_arr.push('</' + this.name + '>');
        }

        if (old_class) {
            this._attr['class'] = old_class;
        }
        if (old_style) {
            this._attr['style'] = old_style;
        }

        return tag_arr.join('');
    };
    TAG.prototype.toElement = function () {
        var element = document.createElement(this.name),
            old_class,
            old_style;

        if (this.hasAttr('class')) {
            old_class = _.clone(this._attr['class']);
            this._attr['class'] = _.uniq(this._attr['class']).join(' ');
        }

        if (this.hasAttr('style')) {
            old_style = _.clone(this._attr['style']);
            this._attr['style'] = _.map(this._attr['style'], function (style_value, style_name) {
                return style_name + ' : ' + style_value;
            }).join('; ');
        }

        _.each(this._attr, function (attr_value, attr_name) {
            element.setAttribute(attr_name, _.clone(attr_value));
        });
        _.each(this._data, function (data_value, data_name) {
            element.setAttribute('data-' + data_name, _.clone(data_value));
        });
        _.each(_.M.beArray(this.content), function (tmp_children) {
            element.appendChild(document.createTextNode(tmp_children.toString()));
        });

        if (old_class) {
            this._attr['class'] = old_class;
        }

        if (old_style) {
            this._attr['style'] = old_style;
        }

        return element;
    };

    /**
     * Get/Set attribute value(s)
     * Base on argument length:
     * - 0 : get all attributes value
     * - 1 : get attribute which name
     * - 2 : Set attribute with name (first argument) and value (second argument)
     * - > 2: Set attribute that named by first argument and value as array of residual arguments
     *
     * @param name
     * @param value
     * @returns {*}
     */
    TAG.prototype.attr = function (name, value) {
        switch (arguments.length) {
            case 0:
                return _.clone(this._attr);
            case 1:
                if (_.isObject(name)) {
                    var prefix = '';
                    var self = this;
                    if (_.isArray(name)) {
                        prefix = 'attr-';
                    }
                    _.each(name, function (attr_value, attr_name) {
                        self._attr[prefix + attr_name] = attr_value;
                    });

                    return this;
                } else if (_.has(this._attr, name)) {
                    return this._attr[name];
                }
                return undefined;

            case 2:
                this._attr[name] = value;
                return this;
            default:
                this._attr[name] = Array.prototype.slice.call(arguments, 1);

                return this;
        }
    };

    /**
     * Check if a attribute is exists
     * @param name
     * @return bool
     */
    TAG.prototype.hasAttr = function (name) {
        return _.has(this._attr, name);
    };

    /**
     * Remove one or more attributes
     * @returns {TAG}
     */
    TAG.prototype.removeAttr = function () {
        var self = this;
        _.each(arguments, function (name) {
            delete self._attr[name + ''];
        });

        return this;
    };

    /**
     * Get/Set tag data
     * Base on argument length:
     * - 0 : get all data value
     * - 1 : get data which name
     * - 2 : Set data with name (first argument) and value (second argument)
     * - > 2: Set data that named by first argument and value as array of residual arguments
     *
     * @param name
     * @param value
     * @returns {*}
     */
    TAG.prototype.data = function (name, value) {
        switch (arguments.length) {
            case 0:
                return _.clone(this._data);

            case 1:
                if (_.isObject(name)) {
                    var prefix = '';
                    var self = this;
                    if (_.isArray(name)) {
                        prefix = 'data-';
                    }
                    _.each(name, function (data_value, data_name) {
                        self._data[prefix + data_name] = data_value;
                    });

                    return this;
                } else if (_.has(this._data, name)) {
                    return this._data[name];
                }
                return undefined;

            case 2:
                this._data[name] = value;

                return this;
            default:
                this._data[name] = Array.prototype.slice.call(arguments, 1);

                return this;
        }
    };

    /**
     * Check if a data is exists
     * @param name
     * @return bool
     */
    TAG.prototype.hasData = function (name) {
        return _.has(this._data, name);
    };

    /**
     * Remove one or more data
     * @returns {TAG}
     */
    TAG.prototype.removeData = function () {
        var self = this;
        _.each(arguments, function (name) {
            delete self._data[name + ''];
        });

        return this;
    };

    /**
     * Append tag's content
     * @returns {TAG}
     */
    TAG.prototype.append = function () {
        var content = '';

        _.each(arguments, function (value) {
            content += value.toString();
        });
        this.content += content;

        return this;
    };

    /**
     * Prepend tag's content
     * @returns {TAG}
     */
    TAG.prototype.prepend = function () {
        var content = '';

        _.each(arguments, function (value) {
            content += value.toString();
        });
        this.content = content + this.content;
        return this;
    };

    /**
     * Get(Set) content as raw as it
     * @returns {*}
     */
    TAG.prototype.html = function () {
        var content = '';

        if (arguments.length == 0) {
            _.each(_.M.beArray(this.content), function (tmp_children) {
                content += tmp_children.toString();
            });
            return content;
        }

        _.each(arguments, function (value) {
            content += value.toString();
        });
        this.content = content;
        return this;
    };

    /**
     * Get(Set) escaped content
     * @returns {TAG}
     */
    TAG.prototype.text = function () {
        if (arguments.length == 0) {
            return _.M.escapeHTML(this.html());
        }
        var content = [];
        _.each(arguments, function (value) {
            content += value.toString();
        });

        this.content = _.M.escapeHTML(content);
        return this;
    };

    /**
     * Get/Set tag's id attribute
     * If first argument is true then set id which random string
     * @returns {*}
     */
    TAG.prototype.id = function () {
        if (arguments.length == 0) {
            return this.attr('id');
        }
        if (arguments[0] === true) {
            arguments[0] = 'tag_' + _.M.randomString(10);
        }
        if (_.M.isLikeString(arguments[0])) {
            this.attr('id', arguments[0].toString());
            return this;
        }

        throw new Error('Invalid ID type');
    };

    /**
     * Add classes name
     * @returns {TAG}
     */
    TAG.prototype.addClass = function () {
        if (!this.hasAttr('class')) {
            this._attr['class'] = [];
        }
        this._attr['class'] = _.uniq(this._attr['class'].concat(Array.prototype.slice.call(arguments, 0)));
        return this;
    };

    /**
     * Remove classes name
     * @returns {TAG}
     */
    TAG.prototype.removeClass = function () {
        if (this.hasAttr('class') && _.isArray(this._attr['class'])) {
            this._attr['class'] = _.difference(this._attr['class'], arguments);
        }
        return this;
    };

    /**
     * Get classes name
     * @returns {*}
     */
    TAG.prototype.class = function () {
        if (this.hasAttr('class') && _.isArray(this._attr['class'])) {
            return this._attr['class'];
        }
        return [];
    };

    /**
     * Toggle classes
     * @param classes
     * @param status If this param is boolean then add/remove when it is true/false. By default it is undefined - add
     *     if none exists, remove if existed
     * @returns {TAG}
     */
    TAG.prototype.toggleClass = function (classes, status) {
        var curr_classes = this.class();

        classes = _.uniq(_.M.beArray(classes));
        if (_.isUndefined(status)) {
            var exclude = _.intersection(curr_classes, classes);
            var include = _.difference(classes, curr_classes);

            curr_classes = _.union(_.difference(curr_classes, exclude), include);
        } else {
            if (status) {
                curr_classes = _.union(curr_classes, classes);
            } else {
                curr_classes = _.difference(curr_classes, classes);
            }
        }
        this._attr['class'] = curr_classes;
        return this;
    };

    /**
     * Get/Set rule of style base on arguments length
     * - 0: get style detail
     * - 1: get rule
     * - 2: set rule which value
     *
     * Type of rule name and value must be is string or numeric
     *
     * @param name
     * @param value
     * @returns {*}
     */
    TAG.prototype.style = function (name, value) {
        //Return current style
        if (arguments.length == 0) {
            if (this.hasAttr('style') && _.isObject(this._attr['style'])) {
                return _.clone(this._attr['style']);
            }
            return {};
        }
        if (!this.hasAttr('style') || !_.isObject(this._attr['style'])) {
            this._attr['style'] = {};
        }

        if (arguments.length == 1) {
            if (_.isObject(arguments[0])) {
                //Create new styles by object
                _.extend(this._attr['style'], arguments[0]);
                return this;
            } else {
                //Get style detail by name
                if (_.has(this._attr['style'], arguments[0])) {
                    return this._attr['style'][arguments[0]];
                }
                return undefined;
            }
        } else if (_.M.isLikeString(arguments[0]) && _.M.isLikeString(arguments[1])) {
            this._attr['style'][arguments[0]] = arguments[1];
            return this;
        }

        if (_.isEmpty(this._attr['style'])) {
            delete this._attr['style'];
        }
        return false;
    };

    /**
     * Remove one or more styles
     * @param all
     * @returns {TAG}
     */
    TAG.prototype.removeStyle = function (all) {
        if (_.isUndefined(all)) {
            all = false;
        }

        if (_.has(this._attr, 'style') && !_.isEmpty(this._attr['style'])) {
            if (all) {
                this._attr['style'] = {};
            } else {
                this._attr['style'] = _.pick(this._attr['style'], _.difference(Object.keys(this._attr['style']), arguments));
            }

        }

        return this;
    };


    thisModule.TAG = TAG;

    /**
     * Create tag instance by option
     * @param option
     * @returns {TAG}
     * @private
     */
    function _createTag(option) {
        var tag = new TAG();
        var tag_option = {
            name: '',
            attr: {},
            data: {},
            content: '',
            isEmpty: false
        };

        if (_.isString(option)) {
            tag_option.name = option;
        }
        if (_.isObject(option)) {
            _.extend(tag_option, option);
        }
        if (tag_option.name.length == 0) {
            throw new Error('Invalid TAG name');
        }
        tag.name = tag_option.name;
        _.each(tag_option.attr, function (attr_value, attr_name) {
            tag.attr(attr_name, attr_value);
        });
        _.each(tag_option.data, function (data_value, data_name) {
            tag.data(data_name, data_value);
        });
        tag.content = tag_option.content;
        tag.isEmpty = Boolean(tag_option.isEmpty);


        return tag;
    }

    thisModule.createTag = function (option) {
        return _createTag(option);
    };
    thisModule.defineTag = function (name, attributes, data, content, isEmptyTag) {
        if (!_.isObject(attributes)) {
            if (_.isString(attributes)) {
                var old_attr = attributes;
                attributes = {};
                attributes[old_attr] = true;
            }
        }

        if (!_.isObject(data)) {
            data = {};
        }

        if (_.isUndefined(content) || _.isNull(content)) {
            content = '';
        }

        isEmptyTag = Boolean(isEmptyTag);

        Object.defineProperty(thisModule, name, {
            value: function (option, children) {
                option = _.extend({
                    name: name,
                    _attr: attributes,
                    _data: data,
                    content: content,
                    isEmpty: isEmptyTag
                }, option);

                var tag = _createTag(option);

                if (!(_.isUndefined(children) || _.isNull(children))) {
                    tag.append(children);
                }

                return tag;
            }
        });
    };


    /**
     -------------------------------------------
     Add HTML tags
     -------------------------------------------
     **/

    var tags = {},
        empty_tags = ['frame', 'base', 'link', 'track', 'param', 'area', 'command', 'col', 'meta', 'source', 'img',
            'keygen', 'wbr', 'colgroup', 'input', 'br', 'hr', 'embed'],
        normal_tag = ['html', 'head', 'style', 'title', 'address', 'article', 'footer', 'header',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'nav', 'section', 'dd', 'div', 'dl', 'dt', 'figcaption',
            'figure', 'li', 'main', 'ol', 'p', 'pre', 'ul', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn',
            'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong',
            'sub', 'sup', 'time', 'u', 'audio', 'map', 'video', 'object', 'canvas', 'noscript', 'del', 'ins', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
            'button', 'datalist', 'fieldset', 'option', 'form', 'label', 'legend', 'meter', 'optgroup', 'output', 'progress', 'frameset', 'iframe'];

    _.each(empty_tags, function (tag) {
        tags[tag] = {
            name: tag,
            isEmpty: true
        }
    });

    _.each(normal_tag, function (tag) {
        tags[tag] = {
            name: tag,
            isEmpty: false
        }
    });
    _.each(tags, function (tag_option, tag_name) {
        thisModule.defineTag(tag_name, {}, {}, '', tag_option.isEmpty);
    });


    _.module('TAG', thisModule);
})(_);