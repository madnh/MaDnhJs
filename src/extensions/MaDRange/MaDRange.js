/**
 * MaDRange v1.0
 * author: Do Danh Manh
 * email: dodanhmanh@gmail.com
 */
(function () {
    var root = this;
    root.MaDRangeDriver = {
        drivers: {
            'default': {
                option:{
                    natural: false,
                    step: 1
                },
                add: function (base, value) {
                    return base+value;
                },
                sub: function (base, value) {
                    return base - value;
                },
                nextValue: function (value) {
                    return this.add(value, this.option.step);
                },
                prevValue: function (value) {
                    return this.sub(value, this.option.step);
                },
                nextStart: function (base) {
                    if(this.option.natural){
                        return base.end;
                    }
                    return this.nextValue(base.end);
                },
                prevEnd: function (base) {
                    if(this.option.natural){
                        return base.start;
                    }
                    return this.prevValue(base.start);
                },
                getEnd: function (start, length) {
                    if(this.option.natural){
                        return start + length;
                    }
                    return start + length - 1;
                },
                getStart: function (end, length) {
                    if(this.option.natural){
                        return end - length;
                    }
                    return end - length + 1;
                },
                getLength: function (base) {
                    if(this.option.natural){
                        return base.end - base.start;
                    }
                    return base.end - base.start + 1;
                },
                getItems: function (base) {
                    var result = [];
                    if(this.option.natural){
                        for (var i = base.start; i < base.end; i++) {
                            result.push(i);
                        }
                    }else{
                        for (var j = base.start; i <= base.end; i++) {
                            result.push(i);
                        }
                    }
                    return result;
                },
                isValidRange: function (check) {
                    if(this.option.natural){
                        return check.start < check.end;
                    }
                    return check.start <= check.end;
                },
                isInRange: function (base, check) {
                    if(this.option.natural){
                        return (check >= base.start) && (check < base.end);
                    }
                    return (check >= base.start) && (check <= base.end);
                },
                isNextIntersect: function (base, check) {
                    return this.isValidRange(base)
                        && this.isValidRange(check)
                        && this.isInRange(base, check.start)
                        && !this.isInRange(base, check.end);
                },
                isPrevIntersect: function (base, check) {
                    if(this.isValidRange(base) && this.isValidRange(check)){
                        if(!this.isInRange(base, check.start)){
                            return this.isInRange(base, check.end) && !this.isNext(check, base);
                        }
                    }
                    return false;
                },
                isIntersect: function (base, check) {
                    return this.isNextIntersect(base, check) || this.isPrevIntersect(base, check);
                },
                isContain: function (base, check) {
                    return this.isValidRange(base)
                        && this.isValidRange(check)
                        && this.isInRange(base, check.start)
                        && (this.isInRange(base, check.end) || this.nextStart(base) == this.nextStart(check));
                },
                isNext: function (base, check) {
                    return this.nextStart(base) === check.start;
                },
                isPrev: function (base, check) {
                    return this.prevEnd(base) === check.end;
                },
                isSibling: function (base, check) {
                    return this.isNext(base, check) || this.isPrev(base, check);
                }
            }
        },
        mergeObject: function () {
            var result = {};
            for (var i in arguments) {
                for (var j in arguments[i]) {
                    result[j] = arguments[i][j];
                }
            }
            return result;
        },
        hasDriver: function (name) {
            return typeof this.drivers[name] != 'undefined';
        },
        getDriver: function (name, option, funcs) {
            if (typeof name == "undefined") {
                name = 'default';
            }
            if(this.hasDriver(name)){
                var result = this.mergeObject(this.drivers[name]);
                if(typeof option != 'undefined'){
                    result.option = this.mergeObject(result.option, option);
                }
                if(typeof funcs != 'undefined'){
                    result = this.mergeObject(result, funcs);
                }
                return result;
            }
            return false;
        },
        addDriver: function (name, funcs, from, option) {
            if(typeof from == 'undefined'){
                from = 'default';
            }
            if(!this.hasDriver(from)){
                throw 'Extend not found driver: '+from;
            }
            this.drivers[name] = this.mergeObject(this.drivers[from], funcs);
            if(typeof option != 'undefined'){
                this.drivers[name]['option'] = this.mergeObject(this.drivers[name]['option'], option);
            }
        },
        driverMethods: function () {
            return Object.keys(this.drivers['default']);
        },
        hasDriverMethod: function (name, exactly) {
            for (var i in this.driverMethods()) {
                if (name == i && (!exactly || name === i)) {
                    return true;
                }
            }
            return false;
        }
    };
    /**
     * Add Driver
     */
    MaDRangeDriver.addDriver('time', {
        getHours: function (value) {
            return Math.floor(value);
        },
        getMinutes: function (value) {
            return Math.floor(value * 100 - this.getHours(value) * 100);
        },
        strip_value: function (value, length) {
            value += '';
            return value.substr(0, length);
        },
        span: function (value, length, span, before) {
            if (typeof before == 'undefined') {
                before = true;
            }
            value += '';
            var span_value = '';
            var value_length = value.length;
            if (value.length < length) {
                for (var i = 0; i < (length - value_length); i++) {
                    span_value += span;
                }
                value = before ? (span_value + '' + value) : (value + '' + span_value);
            }
            return value;
        },
        fix60Time: function (value) {
            var date = new Date();
            date.setHours(this.getHours(value));
            date.setMinutes(this.getMinutes(value));
            return parseFloat(date.getHours() + '.' + this.span(date.getMinutes(), 2, '0'));
        },
        add: function (base, value) {
            var hours = this.getHours(base);
            var minutes = parseFloat(this.getMinutes(base)) + parseFloat(value);

            return this.fix60Time(hours + '.' + this.span(minutes, 2, '0'));
        },
        sub: function (base, value) {
            base = this.fix60Time(base);
            var hours = this.getHours(base);
            var minutes = this.getMinutes(base);

            minutes -= value;
            if (minutes < 0) {
                minutes += 60;
                hours -= 1;
            }

            return parseFloat(hours+'.'+minutes);
        }
    }, undefined, {
        natural: true
    });
    root.MaDRange = function (driver_name, option, funcs) {
        this.driver = false;

        this.cloneObject = function (object) {
            return this.mergeObject(object);
        };
        this.cloneArray = function (array) {
            return array.slice(0);
        };


        this.getDriver = function (name, option, funcs) {
            var result;
            if (typeof name == 'undefined') {
                if (this.driver === false) {
                    this.driver = root.MaDRangeDriver.getDriver(undefined, option, funcs);
                }
                if (this.driver === false) {
                    throw 'Driver not found!';
                }
                result = this.cloneObject(this.driver);
            } else {
                result = root.MaDRangeDriver.getDriver(name, option, funcs);
                if (result === false) {
                    throw 'Driver not found: ' + name;
                }
                if (this.driver === false) {
                    this.driver = this.cloneObject(result);
                }
            }
            return result;
        };
        this.option = function (option) {
            if(this.driver !== false){
                this.driver.option = this.mergeObject(this.driver.option, option);
            }
        };
        this.mergeObject = function () {
            var result = {};
            for (var i in arguments) {
                for (var j in arguments[i]) {
                    result[j] = arguments[i][j];
                }
            }
            return result;
        };
        this.filter = function (ranges, func) {
            var result = [];
            for (var i in ranges) {
                var tmp = this.mergeObject(ranges[i]);
                if (func(tmp, i, this.mergeObject(ranges))) {
                    result.push(tmp);
                }
            }
            return result;
        };
        this.has = function (ranges, func) {
            for (var i in ranges) {
                if (func(this.mergeObject(ranges[i]), i, this.mergeObject(ranges))) {
                    return true;
                }
            }
            return false;
        };

        this.getInRange = function (check, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (base) {
                return driver.isInRange(base, check);
            });
        };
        this.getNextIntersects = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isNextIntersect(base, check);
            });
        };
        this.getPrevIntersects = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isPrevIntersect(base, check);
            });
        };
        this.getIntersects = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isIntersect(base, check);
            });
        };
        /**
         * filter ranges to get range which contain other
         * @param base
         * @param ranges
         * @param from_it if true will check base range contain other.
         * @returns {*}
         */
        this.getContains = function (base, ranges, from_it) {
            var driver = this.getDriver();
            if (from_it) {
                return this.filter(ranges, function (check) {
                    return driver.isContain(base, check);
                });
            } else {
                return this.filter(ranges, function (check) {
                    return driver.isContain(check, base);
                });
            }
        };
        this.getNexts = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isNext(base, check);
            });
        };
        this.getPrevs = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isPrev(base, check);
            });
        };
        this.getSiblings = function (base, ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isSibling(base, check);
            });
        };

        this.getValidRanges = function (ranges) {
            var driver = this.getDriver();
            return this.filter(ranges, function (check) {
                return driver.isValidRange(check);
            });
        };

        this.hasInRange = function (check, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (base) {
                return driver.isInRange(base, check);
            });
        };
        this.hasNextIntersect = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isNextIntersect(base, check);
            });
        };
        this.hasPrevIntersect = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isPrevIntersect(base, check);
            });
        };
        this.hasIntersect = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isIntersect(base, check);
            });
        };
        this.hasContain = function (base, ranges, from_it) {
            var driver = this.getDriver();
            if (from_it) {
                return this.has(ranges, function (check) {
                    return driver.isContain(base, check);
                });
            }
            return this.has(ranges, function (check) {
                return driver.isContain(check, base);
            });

        };
        this.hasNext = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isNext(base, check);
            });
        };
        this.hasPrev = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isPrev(base, check);
            });
        };
        this.hasSibling = function (base, ranges) {
            var driver = this.getDriver();
            return this.has(ranges, function (check) {
                return driver.isSibling(base, check);
            });
        };

        this.init = function (driver_name, option) {
            if(typeof driver_name != 'string'){
                option = driver_name;
                driver_name = undefined;
            }
            this.getDriver(driver_name, option);

        };
        this.merge = function (ranges, option) {
            var result = [];
            var rg;
            var tmpRanges = this.cloneArray(ranges);
            option = this.mergeObject({
                sibling: true,
                intersect: true,
                contain: true
            }, option);
            this.getDriver();
            while (rg = tmpRanges.shift()) {
                var add = true;

                if (rg === true) {
                    continue;
                }
                if (!tmpRanges.length) {
                    result.push(rg);
                    break;
                }
                for (var i in tmpRanges) {
                    if (tmpRanges[i] === true || (typeof tmpRanges[i] == 'undefined')) {
                        continue;
                    }

                    var del = false;
                    if ((rg.start === tmpRanges[i].start) && (rg.end === tmpRanges[i].end)) {
                        del = true;
                    } else {
                        if (option.contain) {
                            if (this.driver.isContain(rg, tmpRanges[i])) {
                                del = true;
                            } else if (this.driver.isContain(tmpRanges[i], rg)) {
                                add = false;
                                break;
                            }
                        }
                        if (option.intersect) {
                            if (this.driver.isIntersect(rg, tmpRanges[i])) {
                                if (this.driver.isInRange(tmpRanges[i], rg.start)) {
                                    tmpRanges[i].end = rg.end;
                                } else {
                                    tmpRanges[i].start = rg.start;
                                }
                                add = false;
                                break;
                            }
                        }
                        if (option.sibling) {
                            if (this.driver.isNext(rg, tmpRanges[i])) {
                                tmpRanges[i].start = rg.start;
                                add = false;
                                break;
                            } else if (this.driver.isPrev(rg, tmpRanges[i])) {
                                tmpRanges[i].end = rg.end;
                                add = false;
                                break;
                            }
                        }
                    }
                    if (del) {
                        tmpRanges[i] = true;
                    }
                }
                if (add) {
                    result.push(rg);
                }
            }
            return result;
        };
        this.exclude = function (ranges, excepts) {
            var result = [];
            var tmpExcepts = this.cloneArray(excepts);
            var tmpRanges = this.cloneArray(ranges);
            var rg;

            if (!tmpExcepts.length) {
                return tmpRanges;
            }
            this.getDriver();
            while (rg = tmpRanges.shift()) {
                var add = true;
                for (var ex_key in tmpExcepts) {
                    var ex = tmpExcepts[ex_key];
                    if (ex.start > rg.end || ex.end < rg.start) {
                        continue;
                    }
                    if (ex.start > rg.start) {
                        if (ex.end < rg.end) {
                            tmpRanges.push({
                                start: this.driver.nextStart(ex),
                                end: rg.end
                            });
                        }
                        rg.end = this.driver.prevEnd(ex);
                    } else {
                        if (ex.end < rg.end) {
                            rg.start = this.driver.nextStart(ex);
                        } else {
                            add = false;
                            break;
                        }
                    }
                }
                if (add) {
                    result.push(rg);
                }
            }
            return this.getValidRanges(result);
        };

        this.init(driver_name, option);
    };
}).call(this);