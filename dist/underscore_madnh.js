//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiler source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

/**
 *
 * @namespace _.M
 */
;(function (_) {
    /*
     |--------------------------------------------------------------------------
     | Type Definitions
     |--------------------------------------------------------------------------
     */
    /**
     * Loop callback. Useful in _.each, _.map, _.omit,...
     * @callback loopCallback
     * @param value Item value
     * @param key Item name/index
     * @param object object of items
     *
     * @see http://underscorejs.org/#each
     * @see http://underscorejs.org/#map
     * @see http://underscorejs.org/#omit
     *
     * @example <caption>Alerts each number value in turn...</caption>
     * _.each([1, 2, 3], alert);
     * _.each({one: 1, two: 2, three: 3}, alert);
     * @example <caption>Log to console each number value in turn...</caption>
     * var logger = function(item, key, object){
     *  console.log(key, '=>', item, '<------ Object', object);
     * };
     * _.each([1, 2, 3], logger);
     * _.each({one: 1, two: 2, three: 3}, logger);
     *
     */

    /*
     |--------------------------------------------------------------------------
     | Core
     |--------------------------------------------------------------------------
     */

    /**
     * MaDnhJS version
     * @constant {string} VERSION
     * @default
     */
    var version = '1.2.8';

    var M = {};
    Object.defineProperty(M, 'VERSION', {
        value: version
    });

    var slice = Array.prototype.slice;


    /** Mixin method "module" to UnderscoreJS
     * This method help us to structure UnderscoreJS extensions as module
     */
    _.mixin({
        /**
         * @memberOf _
         * @param name Name of module, UPPER CASE
         * @param exports Module export object
         */
        module: function (name, exports) {
            Object.defineProperty(_, name.toString(), {
                value: exports
            });
        }
    });
    _.module('M', M);

    /**
     * Slice arguments of a function as array
     * @param args
     * @param {Number} [start]
     * @param {Number} [end]
     * @return {*}
     */
    M.sliceArguments = function (args, start, end) {
        return slice.apply(args, slice.call(arguments, 1));
    };

    M.beNumber = function (value, default_value) {
        value = parseFloat(value);

        if (M.isNumeric(value)) {
            return value;
        }
        if (_.isUndefined(default_value)) {
            return 0;
        }

        return M.isNumeric(default_value) ? parseFloat(default_value) : M.beNumber(default_value, 0);
    };
    /**
     * Make sure function parameter is array
     * @param {*} value
     * @returns {Array}
     * @example
     * _.M.beArray([123]) => [123]
     * _.M.beArray(123) => [123]
     */
    M.beArray = function (value) {
        if (_.isArray(value)) {
            return value;
        }
        return [value];
    };

    /**
     * Make sure first argument is object or arguments are name and value of object
     * @param {*} [name]
     * @param {*} [value]
     * @returns {*}
     * @example
     * _.M.beObject(); //{}
     * _.M.beObject(['foo', 'bar', 123]); //{0: "a", 1: 'bar', 2: 123}
     * _.M.beObject('yahoo'); //{0: "yahoo"}
     * _.M.beObject(235); //{0: 235}
     * _.M.beObject('yahoo', 123); //{yahoo: 123}
     * _.M.beObject({yahoo: 123, goooo:'ASDWd'}); //{yahoo: 123, goooo:'ASDWd'}
     *
     */
    M.beObject = function (name, value) {
        switch (true) {
            case arguments.length == 1:
                if (_.isObject(name)) {
                    return name;
                } else if (_.isArray(name) || _.isArguments(name)) {
                    return _.object(Object.keys(name), name);
                }

                return {0: name};
                break;

            case arguments.length >= 2:
                if (_.isObject(name)) {
                    return name;
                }
                var obj = {};

                obj[name] = value;

                return obj;
        }

        return {};
    };

    var cast_types = {};

    cast_types['string'] = function (value) {
        return value + '';
    };
    cast_types['boolean'] = function (value) {
        return Boolean(value);
    };

    cast_types['number'] = function (value) {
        return M.beNumber(value);
    };
    cast_types['integer'] = function (value) {
        return Math.floor(M.beNumber(value));
    };
    cast_types['array'] = M.beArray;
    cast_types['object'] = function (value) {
        return M.beObject(value);
    };

    /**
     * Convert array|object item to other type. Support types:
     * - string
     * - boolean
     * - number
     * - integer
     * - array
     * - object
     *
     * @param object
     * @param type
     * @return {Array|object}
     * @throws Error when cast type is unsupported
     */
    M.castItemsType = function (object, type) {
        if (!cast_types.hasOwnProperty(type)) {
            throw new Error('Invalid cast type. Available types are: string, number, integer, array and object');
        }
        if (_.isArray(object)) {
            return _.map(_.clone(object), cast_types[type]);
        }

        return _.mapObject(_.clone(object), cast_types[type]);
    };

    /**
     * Loop over array or object like _.each but breakable
     * @param {object|array} obj Loop object
     * @param {loopCallback} callback callback apply on every item, return break value to break the loop
     * @param {string} [break_on=break] Value of callback result that break the loop, default is 'break'
     * @returns {*}
     * @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'break';
     *  }
     * });
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *  @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'yahoo';
     *  }
     * }, 'yahoo');
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *
     */
    M.loop = function (obj, callback, break_on) {
        var i, length;
        if (_.isUndefined(break_on)) {
            break_on = 'break';
        }
        if (_.isArray(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (callback(obj[i], i, obj) === break_on) {
                    break;
                }
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (callback(obj[keys[i]], keys[i], obj) === break_on) {
                    break;
                }
            }
        }
        return obj;
    };

    /**
     * Remove object keys
     * @param {object} obj Object
     * @param {string[]|loopCallback} args Array of item name or callback. If use callback then callback must return
     *     true/false to remove/keep item
     */
    M.removeKeys = function (obj, args) {
        var keys = _.flatten(slice.call(arguments, 1));
        var removed = [], old_items;

        if (keys.length == 1 && _.isFunction(keys[0])) {
            old_items = Object.keys(obj);
            obj = _.omit(obj, keys[0]);
            removed = _.difference(old_items, Object.keys(obj));
        } else {
            _.each(keys, function (key) {
                if (_.has(obj, key)) {
                    removed.push(key);
                    obj[key] = undefined;
                    delete  obj[key];
                }
            });
        }

        return removed;
    };

    var unique_id_current_status = {};

    /**
     * Return Next ID of type, start from 1
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true]  Use type as prefix of return ID
     * @returns {string|number}
     * @example <caption>Default type</caption>
     * _.M.nextID(); //unique_id_1
     * _.M.nextID(); //unique_id_2
     * _.M.nextID(null, false); //3
     * _.M.nextID('superman'); //superman_1
     * _.M.nextID('superman'); //superman_2
     * _.M.nextID(); //unique_id_4
     * _.M.nextID('superman', false); //3
     *
     */
    M.nextID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (!unique_id_current_status.hasOwnProperty(type)) {
            unique_id_current_status[type] = 1;
        } else {
            unique_id_current_status[type]++;
        }

        return get_unique_id_with_prefix(type, unique_id_current_status[type], type_as_prefix);
    };

    /**
     * Return current ID of type
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true] Use type as prefix of return ID
     * @returns {boolean|string|number}
     * @example
     * _.M.currentID(); //false
     * _.M.nextID(); //unique_id_0
     * _.M.nextID(); //unique_id_1
     * _.M.currentID(); //unique_id_1
     * _.M.currentID(null, false); //1
     * _.M.currentID('superman'); //false
     * _.M.nextID('superman'); //superman_0
     * _.M.nextID('superman'); //superman_1
     * _.M.currentID('superman'); //superman_1
     * _.M.currentID('superman', false); //1
     * _.M.nextID(); //2
     * _.M.currentID(); //unique_id_2
     */
    M.currentID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }

        if (!unique_id_current_status.hasOwnProperty(type)) {
            return false;
        }

        return get_unique_id_with_prefix(type, unique_id_current_status[type], type_as_prefix);
    };

    /**
     *
     * @param {string} type a type, do not require existed
     * @param {number} [value]
     * @returns {number|*}
     */
    M.resetID = function (type, value) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }

        if (_.isUndefined(value)) {
            delete unique_id_current_status[type];
        } else {
            value = arguments.length > 1 ? M.beNumber(value) : 0;
            value = Math.max(value, 0);
            unique_id_current_status[type] = value;
        }

        return value;
    };

    function get_unique_id_with_prefix(type, id, type_as_prefix) {
        if (type_as_prefix || _.isUndefined(type_as_prefix)) {
            return type + '_' + id;
        }

        return id;
    }


    /**
     * Get constructor name of object
     * @param obj
     * @param {boolean} [constructor_only = false] Return object's constructor name only
     * @returns {string}
     * @example
     * _.M.className(_.App); //"[object Object]"
     * _.M.className(_.App, true); //App
     * _.M.className(new _.M.EventEmitter(), true); //EventEmitter
     */
    M.className = function (obj, constructor_only) {
        if (constructor_only) {
            return obj.constructor.name;
        }
        return Object.prototype.toString.call(obj);
    };

    /**
     * Get type of content. If is object then return constructor name
     * @param content
     * @returns {string}
     * @example
     * _.M.contentType(123); //number
     * _.M.contentType('123'); //string
     * _.M.contentType('Yahooooooo'); //string
     * _.M.contentType(true); //boolean
     * _.M.contentType(true); //boolean
     * _.M.contentType([1,2]); //array
     * _.M.contentType(_.App); //App
     */
    M.contentType = function (content) {
        var type = typeof content;

        if (type === 'object') {
            var class_name = M.className(content, true);

            if (class_name) {
                return class_name;
            }
        }

        return type;
    };

    /**
     * Check object is an instance of a constructor type
     * @param {*} obj
     * @param {string} class_name Name of class
     * @returns {boolean}
     * @example
     * _.M.isInstanceOf(_.App, 'App');//true
     * _.M.isInstanceOf(123, 'Object'); //false
     * _.M.isInstanceOf(123, 'Number'); //true
     * _.M.isInstanceOf('123', 'String'); //true
     * _.M.isInstanceOf(new _.M.EventEmitter(), 'EventEmitter'); //true
     */
    M.isInstanceOf = function (obj, class_name) {
        return M.className(obj, true) === class_name;
    };

    /**
     * Check if object is primitive type: null, string, number, boolean
     * @param obj
     * @returns {boolean}
     * @example
     * _.M.isPrimitiveType(123); //true
     * _.M.isPrimitiveType('123'); //true
     * _.M.isPrimitiveType(null); //true
     * _.M.isPrimitiveType(); //true
     * _.M.isPrimitiveType(_.App); //false
     */
    M.isPrimitiveType = function (obj) {
        var type = typeof obj;
        return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    };


    /**
     * Merge multiple array to first array
     * @return {Array}
     */
    M.mergeArray = function () {
        switch (arguments.length) {
            case 0:
                return [];
            case 1:
                return arguments[0];
        }

        for (var i = 1; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j += 1000) {
                arguments[0].push.apply(arguments[0], arguments[i].slice(j, j + 1000));
            }
        }

        return arguments[0];
    };

    M.mergeObject = function () {
        var next_index = 0;

        for(var i = 0, length = arguments.length; i < length; i++){
            if (_.isArray(arguments[i]) || !_.isObject(arguments[i])) {
                arguments[i] = M.beArray(arguments[i]);
                arguments[i] = _.object(_.range(next_index, next_index += arguments[i].length), arguments[i]);
            }
        }
        return _.extend.apply(_, arguments);
    };

    function is_diff_strict_cb(value_1, value_2) {
        return value_1 !== value_2;
    }

    function is_diff_loose_cb(value_1, value_2) {
        return value_1 != value_2;
    }

    /**
     * Get dirty of object with others object
     * @param {function} cb Callback return true if 2 item is difference
     * @param object
     * @param [others...]
     * @return {{}}
     */
    function diff_object(cb, object, others) {
        if (arguments.length < 2) {
            return {};
        }

        var result = {};

        if (!_.isFunction(cb)) {
            cb = cb ? is_diff_strict_cb : is_diff_loose_cb;
        }

        others = M.mergeObject.apply(M, slice.call(arguments, 2));

        _.each(object, function (value, key) {
            if (!others.hasOwnProperty(key)) {
                result[key] = value;
            } else {
                if (cb(value, others[key])) {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    /**
     * Get dirty of object with others object. Strict comparison
     * @param {object} object
     * @param {object} others
     * @return {*}
     * @example
     * _.M.diffObject({a: 0, b: 1}, {a: '0', b: 1}); //{a: 0}
     */
    M.diffObject = function (object, others) {
        var args = _.flatten(_.toArray(arguments));

        args.unshift(is_diff_strict_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object. Loose comparison
     * @param {object} object
     * @param {object} others
     * @return {*}
     * @example
     * _.M.diffObjectLoose({a: 0, b: 1}, {a: '0', b: 2}); //{b: 1}
     */
    M.diffObjectLoose = function (object, others) {
        var args = _.toArray(arguments);

        args.unshift(is_diff_loose_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object, use callback
     * @param {function} callback Callback with 2 parameters: base value, other object value. Return true when difference
     * @param {object} object
     * @param {object} others
     * @return {*}
     */
    M.diffObjectWithCallback = function (callback, object, others) {
        return diff_object.apply(null, slice.apply(arguments))
    };

    /**
     * Check if value has a deep path
     * @param {*} object
     * @param {string|number|[]} deep
     * @param {string} [separator='.'] Character to split deep string to array of deeps
     * @returns {boolean}
     * @example
     * var obj = {a: {a1: {a2: true}}, b: 'hihi'};
     * _.M.hasDeep(obj, 'a.a1'); //true
     * _.M.hasDeep(obj, 'a.yahoo'); //false
     * _.M.hasDeep([obj, 123], 1); //true
     * _.M.hasDeep([obj, 123], 10); //false
     */
    M.hasDeep = function (object, deep, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            return false;
        }

        return true;
    };

    /**
     * Define object value in a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} value
     * @param {string} [separator='.']
     */
    M.defineDeep = function (object, deep, value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }
        var pointer = object, field, last_field = deep.pop();

        while (field = deep.shift()) {
            if (!pointer.hasOwnProperty(field)) {
                pointer[field] = {};
            }
            pointer = pointer[field];
        }

        pointer[last_field] = value;
    };

    /**
     * Get object's value at a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} [default_value=undefined]
     * @param {string} [separator='.']
     * @returns {*}
     */
    M.getDeep = function (object, deep, default_value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field, found = true;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            found = false;
            break;
        }

        if (found) {
            return pointer;
        }

        return default_value;
    };

    M.updateDeep = function (object, deep, callback) {
        if (!M.hasDeep(object, deep)) {
            throw new Error('Update undefined deep');
        }
        var deep_value = _.M.getDeep(object, deep);

        M.defineDeep(object, deep, callback(deep_value));
    };

    M.appendDeep = function (object, deep, value) {
        M.updateDeep(object, deep, function (current_value) {
            if (M.isLikeString(current_value)) {
                current_value += value + '';
            } else if (_.isArray(current_value)) {
                current_value.push(value);
            } else {
                current_value = [current_value, value];
            }

            return current_value;
        });
    };

    /**
     * Make sure that a value is in a range
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @example
     * _.M.minMax(10, -15, 50); //10
     * _.M.minMax(10, 20, 50); //20
     * _.M.minMax(100, 20, 50); //50
     */
    M.minMax = function (value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    /**
     * Get random string
     * @param {number} [length]
     * @param {string} [chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
     * @returns {string}
     * @example
     * _.M.randomString(10); //'mYJeC1xBcl'
     * _.M.randomString(10, 'ABCDEF'); //'CDABBEFADE'
     */
    M.randomString = function (length, chars) {
        var result = '', chars_length, i;
        if (_.isUndefined(chars) || !chars.toString().length) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        chars_length = chars.length;

        length = M.beNumber(length, 10);

        for (i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars_length - 1))];
        }
        return result;
    };

    M.randomInteger = function (min, max) {
        if (arguments.length == 0) {
            min = 0;
            max = 10;
        } else if (arguments.length == 1) {
            max = 0;
        }
        var tmp = max;

        max = Math.max(Math.floor(min), Math.floor(max));
        min = Math.min(Math.floor(tmp), Math.floor(min));

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Setup a object with field name and value or object of fields
     * @param {Object} object host object
     * @param {(string|Object)} option field name of object of fields
     * @param {*} value value of field when option param is field name
     * @returns {*}
     * @example
     * var obj = {a: 'A', b: 'B'}
     * _.M.setup(obj, 'a', '123'); //obj -> {a: '123', b: 'B'}
     * _.M.setup(obj, {b: 'Yahoo', c: 'ASD'}); //obj -> {a: 123, b: 'Yahoo', c: 'ASD'}
     */
    M.setup = function (object, option, value) {
        if (!_.isObject(object)) {
            object = {};
        }
        switch (arguments.length) {
            case 2:
                if (_.isObject(option)) {
                    object = _.extend({}, object, option);
                }
                break;
            case 3:
                object[option] = value;
        }

        return object;
    };

    /**
     * Get all of valid keys that exists in object.
     *
     * @param {object} object
     * @param {Array} keys
     * @return {Array}
     */
    M.validKeys = function (object, keys) {
        var result = [];

        keys = M.beArray(keys);
        for (var i = 0, length = keys.length; i < length; i++) {
            if (object.hasOwnProperty(keys[i])) {
                result.push(keys[i]);
            }
        }

        return result;
    };

    /**
     * Return first value of arguments that isn't empty
     * @returns {*}
     * @example
     * _.M.firstNotEmpty(['', 0, false, 123]); //123
     */
    M.firstNotEmpty = function () {
        var arr = _.flatten(_.toArray(arguments));

        return _.find(arr, function (value) {
            if (_.isString(value)) {
                return value.trim().length > 0;
            }
            if (M.isNumeric(value)) {
                var parsedValue = parseFloat(value);

                return parsedValue !== 0 && !_.isNaN(parsedValue) && _.isFinite(parsedValue);
            }
            if (value === true) {
                return true;
            }

            return !_.isEmpty(value);
        });
    };

    /**
     * Like _.pairs but array item is an object with field is "key", "value"
     * @param object
     * @returns {Array}
     * @example
     * _.M.pairsAsObject({one: 1, two: 2, three: 3});
     * => [{key: 'one', value: 1},{key: 'two', value: 2},{key: 'three', value: 3}]
     */
    M.pairsAsObject = function (object) {
        var result = [];

        _.each(object, function (value, key) {
            result.push({
                key: key,
                value: value
            });
        });

        return result;
    };
    /**
     * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values, with a column as key.
     * @param {object[]} collection
     * @param {string} key_field If key field not found then use as "undefined"
     * @param {string} value_field If value field not found then use as "undefined"
     * @returns {{}}
     * @example
     * var stooges = [{name: 'moe', id: 1, age: 40}, {name: 'larry', id: 2, age: 50}, {name: 'curly', id: 4, age: 60}];
     * _.M.pluckBy(stooges, 'id', 'name');
     * => {1: 'moe', 2: 'larry', 3: 'curly'}
     */
    M.pluckBy = function (collection, key_field, value_field) {
        var result = {};

        _.each(collection, function (object) {
            var key = object.hasOwnProperty(key_field) ? object[key_field] : undefined;
            var value = object.hasOwnProperty(value_field) ? object[value_field] : undefined;

            result[key] = value;
        });

        return result;
    };

    /**
     * Returns a copy of the object where the key is original value, new value is an array of original keys which same original value
     * @param object
     * @return {{}}
     * @example
     * var obj = {a: 'A', ă: 'A', b: 'B', d: 'D', đ: 'D'}
     * _.M.invertToArray(obj)
     * => {
     *  A: ['a', 'ă'],
     *  B: ['b'],
     *  D: ['d', 'đ']
     * }
     */
    M.invertToArray = function (object) {
        var result = {};

        _.each(object, function (value, key) {
            if (!result.hasOwnProperty(value)) {
                result[value] = [key];
            } else {
                result[value].push(key);
            }
        });

        return result;
    };

    /**
     * Repeat value by times
     * @param {*} value
     * @param {number} times Repeat times, >= 0
     * @param {boolean} [as_array = false] Return result as array, default is return as string
     * @returns {*}
     * @example
     * _.M.repeat('a', 5); //'aaaaa'
     * _.M.repeat('a', 5, true); //['a', 'a', 'a', 'a', 'a']
     *
     */
    M.repeat = function (value, times, as_array) {
        var result = [];
        times = Math.max(0, times);
        for (var i = 0; i < times; i++) {
            result.push(value);
        }
        return as_array ? result : result.join('');
    };

    /**
     * Add missing value to fit value's length
     * @param {string|number} value
     * @param {number} length Number of result need to fit
     * @param {string} span_character add value
     * @param {boolean} [before = true]
     * @returns {string}
     * @example
     * _.M.span(123, 5, '_'); //'__123'
     * _.M.span(123, 5, '_', false); //'123__'
     * _.M.span('ABCDEF', 5, '_'); //'ABCDEF'
     */
    M.span = function (value, length, span_character, before) {
        if (_.isUndefined(before)) {
            before = true;
        }
        value += '';
        if (value.length < length) {
            span_character = M.repeat((span_character + '').charAt(0), length - value.length);
            value = before ? span_character + '' + value : value + '' + span_character;
        }
        return value;
    };

    /**
     * Get n characters from left of string
     * @param {string} string
     * @param {number} [length = 1] Number of characters
     * @returns {string}
     * @example
     * _.M.left('ABC', 2); //'AB'
     */
    M.left = function (string, length) {
        if (_.isUndefined(length)) {
            length = 1;
        }

        if (length < 1) {
            return '';
        }
        return string.toString().substr(0, length);
    };

    /**
     * Get n characters from right of value
     * @param {string} string
     * @param {number} [length = 1] Number of characters, default is 1
     * @returns {string}
     * @example
     * _.M.right('ABC', 2); //'BC'
     */
    M.right = function (string, length) {
        var tmpVal = string.toString();

        if (_.isUndefined(length)) {
            length = 1;
        }
        if (length < 1) {
            return '';
        }

        return tmpVal.substr(Math.max(0, tmpVal.length - length), length);
    };

    /**
     * Padding number with 0 and sign
     * @param {number} num
     * @param {number} place
     * @param {boolean} sign Include number sign. If number is less than 0 then include sign, override this parameter
     * @param {number} [base=10] Base of number
     * @returns {string}
     * @example
     * _.M.padNumber(2,2); //"02"
     * _.M.padNumber(2,15); //"000000000000002"
     * _.M.padNumber(-2,2) //"-02"
     * _.M.padNumber(-2,2, true) //"-02"
     * _.M.padNumber(2,2, true); //"+02"
     *
     */
    M.padNumber = function (num, place, sign, base) {
        var str = Math.abs(num).toString(base || 10);
        str = M.repeat('0', place - str.replace(/\.\d+/, '').length) + str;
        if (sign || num < 0) {
            str = (num < 0 ? '-' : '+') + str;
        }
        return str;
    };

    /**
     * Check value is numeric
     * @param value
     * @returns {boolean}
     *
     * @example
     * _.M.isNumeric(123); //true
     * _.M.isNumeric(123.5); //true
     * _.M.isNumeric('123.5'); //true
     */
    M.isNumeric = function (value) {
        return !_.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    };

    /**
     * Check if numeric value is integer
     * @param {number} number
     * @returns {boolean}
     * @example
     * _.M.isInteger(123); //true
     * _.M.isInteger(123.5); //false
     * _.M.isInteger('123'); //true
     */
    M.isInteger = function (number) {
        return M.isNumeric(number) && number % 1 === 0;
    };

    /**
     * Check if a numeric is multiple of other
     * @param {number} n1
     * @param {number} n2
     * @returns {boolean}
     * @example
     * _.M.isMultiple(12, 3); //true
     * _.M.isMultiple(12, 5); // false
     * _.M.isMultiple(12, '4'); // true
     * _.M.isMultiple(12, 0); //false
     */
    M.isMultiple = function (n1, n2) {
        try {
            return n1 % n2 === 0;
        } catch (e) {
            return false;
        }
    };
    /**
     * Check if a numeric is odd
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5); //false
     * _.M.isOdd(4); //true
     * _.M.isOdd('11'); //false
     * _.M.isOdd('8'); //true
     */
    M.isOdd = function (number) {
        return M.isMultiple(number, 2);
    };
    /**
     * Check if a number is even
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isEven(5); //true
     * _.M.isEven(4); //false
     * _.M.isEven('11'); //true
     * _.M.isEven('8'); //false
     */
    M.isEven = function (number) {
        return !M.isMultiple(number, 2);
    };

    /**
     * Make sure value is in array
     * @param {*} value
     * @param {Array} values
     * @param {*} [default_value] Default value if not found value in values
     * @returns {*} If found then return value itself, else, return default_value or first item of array
     * @example
     * var items = [1,2,3,'a'];
     * _.M.oneOf(1, items); // 1
     * _.M.oneOf(0, items); // 1
     * _.M.oneOf('a', items); // 'a'
     * _.M.oneOf('b', items, 'C'); // 'C'
     */
    M.oneOf = function (value, values, default_value) {
        if (-1 !== values.indexOf(value)) {
            return value;
        }

        if (arguments.length >= 3) {
            return default_value;
        }

        return _.first(values);
    };

    /**
     * Capitalize a string
     * @param {string} str
     * @param {boolean} [all = true] True - all words of string, False - Only first word
     * @returns {string}
     * @example
     * _.M.capitalize('xin chao'); //'Xin Chao'
     * _.M.capitalize('xin chao', false); //'Xin chao'
     */
    M.capitalize = function (str, all) {
        all = _.isUndefined(all) ? true : Boolean(all);

        return str.replace(all ? /(^|\s)[a-z]/g : /(^|\s)[a-z]/, function (text) {
            return text.toUpperCase();
        });
    };

    /**
     * Check input is string or number
     * @param {*} value
     * @returns {boolean}
     * @example
     * _.M.isLikeString('yahoo'); // true
     * _.M.isLikeString(123); // true
     * _.M.isLikeString({}); // false
     * _.M.isLikeString(true); // false
     */
    M.isLikeString = function (value) {
        return _.isString(value) || M.isNumeric(value);
    };

    /**
     * Return reverse of string
     * @param {string} str
     * @returns {string}
     * @example
     * _.M.reverseString('yahoo'); // 'oohay'
     */
    M.reverseString = function (str) {
        return str.split('').reverse().join('');
    };
    /**
     * Check if a trimmed string is empty
     * @param {string} str
     * @returns {boolean}
     * @example
     * _.M.isBlank('abc'); // false
     * _.M.isBlank(''); // true
     * _.M.isBlank('    '); // true
     */
    M.isBlank = function (str) {
        return String(str).trim().length === 0;
    };

    /**
     * Return current unix timestamp as seconds
     * @returns {Number}
     * @example
     * _.M.nowSecond(); // 1450622822
     */
    M.nowSecond = function () {
        return parseInt(Math.floor(_.now() / 1000));
    };

    /**
     * Escape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.escapeURL = function (url, param) {
        return param ? encodeURIComponent(url) : encodeURI(url);
    };

    /**
     * Unescape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.unescapeURL = function (url, param) {
        return param ? decodeURI(url) : decodeURIComponent(url);
    };

    /**
     * Escape HTML
     * @param content
     * @returns {string}
     * @example
     * _.M.escapeHTML('<b>Yahoo</b>'); //&lt;b&gt;Yahoo&lt;&#x2f;b&gt;"
     */
    M.escapeHTML = function (content) {
        return (content + '').replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/\//g, '&#x2f;').toString();
    };

    /**
     * Return array value at index
     * @param {string|number|Array} array String or array of items
     * @param {number} index
     * @returns {*}
     * @example
     * var arr = ['a', 'b', 'c'];
     * var str = 'Yahoo';
     * _.M.valueAt(a, 1); //'b'
     * _.M.valueAt(a, 5); //'c'
     * _.M.valueAt(a, -1); //'c'
     * _.M.valueAt(a, -2); //'b'
     * _.M.valueAt(str, 2); //'h'
     * _.M.valueAt(str, -2); //'o'
     */
    M.valueAt = function (array, index) {
        if (M.isLikeString(array)) {
            array = (array + '').split('');
        }
        if (!_.isArray(array)) {
            array += '';
        }

        var arr_len = array.length;
        index = index % arr_len;
        if (index < 0) {
            index += arr_len;
        }
        return array[index];
    };

    /**
     * Split array to chunks, each chunk has n element
     * @param {Array} array Items
     * @param {number} n Items per chunk
     * @returns {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunk(arr, 3)
     * => [
     *  [0, 1, 2],
     *  [3, 4, 5],
     *  [6, 7, 8],
     *  [9],
     * ]
     *
     */
    M.chunk = function (array, n) {
        var lists = _.groupBy(array, function (element, index) {
            return Math.floor(index / n);
        });
        return _.toArray(lists);
    };

    /**
     * Split array to n of chunks
     * @param {Array} array
     * @param {number} chunks Number of chunks
     * @return {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunks(arr, 3)
     * => [
     *   [0, 1, 2, 3],
     *   [4, 5, 6, 7],
     *   [8, 9]
     * ]
     */
    M.chunks = function (array, chunks) {
        return M.chunk(array, Math.ceil(array.length / chunks));
    };

    /**
     * Toggle array's elements
     * @param {Array} array
     * @param {Array} elements
     * @param {boolean} status If this param is boolean then add/remove base on it value. By default it is undefined -
     *     add if none exists, remove if existed
     * @returns {array}
     * @example
     * var arr = ['A', 'B', 'C', 'D'];
     * _.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
     */
    M.toggle = function (array, elements, status) {
        elements = _.uniq(M.beArray(elements));
        if (_.isUndefined(status)) {
            var exclude = _.intersection(array, elements);
            var include = _.difference(elements, array);

            array = _.union(_.difference(array, exclude), include);
        } else {
            if (status) {
                array = _.union(array, elements);
            } else {
                array = _.difference(array, elements);
            }
        }
        return array;
    };

    /**
     * Create, define and return a object with properties. Object's properties are fixed and enumerable
     * @param {{}} properties
     * @returns {{}}
     * @example
     * var obj = _.M.defineObject({name: 'Manh', old: 123, hello: function(){
     *  alert('Hello ' + this.name);
     * }});
     *
     * obj.old = 10;
     * console.log(obj); //{name: 'Manh', old: 123}
     * _.each(obj, function(value, key){
     *  console.log(key, '=>', value);
     * });
     * //name => Manh
     * //old => 123
     */
    M.defineObject = function (properties) {
        var obj = {};
        _.each(properties, function (value, key) {
            key = key.trim();
            if (!_.has(obj, key)) {
                Object.defineProperty(obj, key, {
                    enumerable: !_.isFunction(value),
                    value: value
                });
            }
        });
        return obj;
    };

    /**
     * Check if a MaDnh constant is defined or not
     * @param {string} name
     * @returns {boolean}
     * @example
     * _.M.isDefinedConstant('TEST') => false
     */
    M.isDefinedConstant = function (name) {
        return _.has(M, name.trim().toUpperCase());
    };

    /**
     * Define a MaDnh constant
     * @param {(string|Object)} name
     * @param {*} [value = undefined]
     * @example
     * _.M.defineConstant('TEST', 123) => _.M.TEST = 123
     */
    M.defineConstant = function (name, value) {
        var obj = {},
            result = [],
            self = M;

        if (!_.isObject(name)) {
            obj[name] = value;
        } else {
            obj = name;
        }
        _.each(obj, function (value, key) {
            key = key.trim().toUpperCase();
            if (!M.isDefinedConstant(key)) {
                Object.defineProperty(self, key, {
                    enumerable: true,
                    value: value
                });
                result.push(key);
            }
        });
        return result;
    };

    /**
     * Inherit constructor prototype
     * @param {function} subclass_constructor Destination constructor
     * @param {function} base_class_constructor Source constructor
     * @param {boolean} [addSuper = true] Add property to destination prototype that reference back to source prototype
     *
     * @see https://github.com/Olical/Heir
     *
     * @example
     * function MyEE(){
     *  _.M.EventEmitter.call(this);
     * }
     *
     * _.M.inherit(MyEE, _.M.EventEmitter);
     */
    M.inherit = function (subclass_constructor, base_class_constructor, addSuper) {
        var proto = subclass_constructor.prototype = Object.create(base_class_constructor.prototype);
        proto.constructor = subclass_constructor;

        if (addSuper || _.isUndefined(addSuper)) {
            proto._super = base_class_constructor.prototype;
        }
    };

    /**
     * Call callback with arguments
     * @param {string|function|Array} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {Object|null} context context of "this" keyword
     * @returns {*}
     *
     * @example
     * _.M.callFunc(null, alert, 123);
     * _.M.callFunc(null, function(name, old){
     *      alert('My name is ' + name + ', ' + old + 'years old');
     * }, ['Manh', 10]);
     *
     * var obj = {name: 'Manh', old: 10};
     * _.M.callFunc(obj, function(say_hi){
     *      alert((say_hi ? 'Hi' : 'Hello') + '! my name is ' + this.name + ', ' + this.old + ' years old');
     * }, true);
     */
    M.callFunc = function (callback, args, context) {
        if (arguments.length >= 2) {
            args = M.beArray(args);
        } else {
            args = [];
        }

        if (callback) {
            if (_.isString(callback)) {
                if (M.WAITER.has(callback)) {
                    return M.WAITER.run(callback, args, context);
                }
                if (_.has(window, callback) && _.isFunction(window[callback])) {
                    return window[callback].apply(context || window, args);
                }

                throw new Error('Invalid callback!');
            } else if (_.isFunction(callback)) {

                return callback.apply(context || null, args);
            } else if (_.isArray(callback)) {
                var result = [],
                    this_func = arguments.callee;

                _.each(callback, function (tmpFunc) {
                    result.push(this_func(tmpFunc, args, context));
                });

                return result;
            }
        }

        return undefined;
    };

    /**
     * Call callback asynchronous. Similar to _.M.callFunc
     *
     * @param {(string|function|Array)} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {number} [delay=1] Delay milliseconds
     * @param {Object|null} context context of "this" keyword
     * @see callFunc
     */
    M.async = function (callback, args, delay, context) {
        delay = parseInt(delay);
        if (_.isNaN(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            M.callFunc(callback, args, context || null);
        }, Math.max(1, delay));
    };

    function createConsoleCB(name, description) {
        var args = [];
        if (arguments.length > 1) {
            args.push(description);
        }

        return function () {
            console[name].apply(console, args.concat(slice.apply(arguments)));
        }
    }

    /**
     * Like console.log with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.logArgs('a',123);
     * _.M.logArgs.apply(null, args);
     */
    M.logArgs = function () {
        console.log.apply(console, slice.apply(arguments));
    };

    /**
     * Create console log callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.logCb('Test 1');
     * cb(1,2,3); // Console log: 'Test 1' 1 2 3
     */
    M.logCb = function (description) {
        return createConsoleCB.apply(null, ['log'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.warn with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.warnArgs('a',123);
     * _.M.warnArgs.apply(null, args);
     */
    M.warnArgs = function () {
        console.warn.apply(console, slice.apply(arguments));
    };

    /**
     * Create console waring callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.warnCb('Test 1');
     * cb(1,2,3); // Console warn as: 'Test 1' 1 2 3
     */
    M.warnCb = function (description) {
        return createConsoleCB.apply(null, ['warn'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.error with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.errorArgs('a',123);
     * _.M.errorArgs.apply(null, args);
     */
    M.errorArgs = function () {
        console.error.apply(console, slice.apply(arguments));
    };

    /**
     * Create console error callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.errorCb('Test 1');
     * cb(1,2,3); // Console error as: 'Test 1' 1 2 3
     */
    M.errorCb = function (description) {
        return createConsoleCB.apply(null, ['error'].concat(slice.apply(arguments)));
    };


    var debug_types_status = {}, is_active_all_debug_type = false;

    /**
     *
     * @param type
     * @returns {boolean}
     */
    M.isDebugging = function (type) {
        if (is_active_all_debug_type || _.isEmpty(type)) {
            return is_active_all_debug_type;
        }

        return debug_types_status.hasOwnProperty(type) && debug_types_status[type];

    };
    /**
     *
     * @param [type] default is all debug type
     */
    M.debugging = function (type) {
        if (_.isEmpty(type)) {
            is_active_all_debug_type = true;
            return;
        }

        debug_types_status[type] = true;
    };
    /**
     *
     * @param [type] default is all debug type
     */
    M.debugComplete = function (type) {
        if (_.isEmpty(type)) {
            is_active_all_debug_type = false;
            debug_types_status = {};

            return;
        }

        delete debug_types_status[type];
    };

    /**
     * Run callback if is in debugging of a type
     * @param type null - all debug type
     * @param {function} callback
     */
    M.onDebugging = function (type, callback) {
        if (M.isDebugging(type)) {
            M.callFunc(callback);
        }
    };

    /**
     * Get json string of an array
     * @param {array} details
     * @param {string} [glue="\n"]
     * @returns {string}
     */
    M.getDebugString = function (details, glue) {
        var result = [];

        _.each(M.beArray(details), function (item) {
            result.push(JSON.stringify(item));
        });

        return result.join(glue || "\n");
    };

    /**
     *
     * @param args
     * @param order
     * @param rules
     * @returns {{}}
     * @example
     * var order = ['int', 'bool', 'str'],
     * rules = {int: 'number', bool: 'boolean', str: 'string'};
     *
     * _.M.optionalArgs([1, true, 'A'], order, rules); //{int: 1, bool: true, str: "A"}
     * _.M.optionalArgs([true, 'A'], order, rules);//{bool: true, str: "A"}
     * _.M.optionalArgs(['A'], order, rules); //{str: "A"}
     * _.M.optionalArgs(['A', 'V'], order, rules); //{int: "A", bool: "V"}
     * _.M.optionalArgs([1, []], order, rules); //{int: 1, bool: []}
     * _.M.optionalArgs([true, []], order, rules); //{int: true, bool: []}
     * _.M.optionalArgs(['A', []], order, rules); //{int: "A", bool: []}
     * _.M.optionalArgs([[], []], order, rules); //{int: Array[0], bool: []}
     *
     * _.M.optionalArgs(['A', 'V'], ['int', 'bool', 'str', 'str2'], {int: 'number', bool: 'boolean', str: 'string', str2: 'string'});
     * //=> {str: "A", str2: "V"}
     */
    M.optionalArgs = function (args, order, rules) {
        var result = {},
            arg, index = 0, last_index, missing_rules, type, args_cloned, args_with_type, found;

        missing_rules = _.difference(order, Object.keys(rules));
        missing_rules.forEach(function (missing) {
            rules[missing] = true;
        });

        args_with_type = order.map(function (arg_name) {
            return rules[arg_name];
        });

        if (_.isEmpty(args)) {
            return result;
        }
        if (args.length >= order.length) {
            result = _.object(order, args.slice(0, order.length));
        } else {
            args_cloned = args.slice(0);

            while (arg = args_cloned.shift()) {
                type = M.contentType(arg);
                found = false;
                last_index = index;

                M.loop(args_with_type.slice(index), (function (tmp_arg, tmp_type) {
                    return function (types) {
                        if (types === true || tmp_type === types
                            || (_.isArray(types) && -1 != types.indexOf(tmp_type))
                            || (_.isFunction(types) && types(tmp_arg))) {
                            found = true;

                            return 'break';
                        }

                        index++;
                    }
                })(arg, type));

                if (!found) {
                    result = _.object(order.slice(0, args.length), args);
                    break;
                }

                result[order[index++]] = arg;
            }
        }

        return result;
    };

    /**
     * Sort number asc
     */
    function sortNumberCallback(a, b) {
        return a - b;
    }

    /**
     * Sort number desc
     */
    function sortNumberDescCallback(a, b) {
        return b - a;
    }

    function is_equal_strict(a, b) {
        return a === b;
    }

    function is_equal_loose(a, b) {
        return a == b;
    }


    M.defineConstant({
        /**
         * Array sort compare function. Sort number
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(); // [1, 10, 2, 21]
         * scores.sort(_.M.SORT_NUMBER); // [1, 2, 10, 21]
         */
        SORT_NUMBER: sortNumberCallback,
        /**
         * Array sort compare function. Sort number desc
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(_.M.SORT_NUMBER_DESC); // [21, 10, 2, 1]
         */
        SORT_NUMBER_DESC: sortNumberDescCallback,

        /**
         * Compare 2 value is equal, loose comparison
         * @constant
         * @example
         * _.M.IS_EQUAL(1, 1); //true
         * _.M.IS_EQUAL(1, '1'); //true
         * _.M.IS_EQUAL(1, true); //true
         * _.M.IS_EQUAL(1, false); //false
         * _.M.IS_EQUAL(1, 2); //false
         */
        IS_EQUAL: is_equal_loose,

        /**
         * Compare 2 value is equal, strict comparison
         * @constant
         * @example
         * _.M.IS_STRICT_EQUAL(1, 1); //true
         * _.M.IS_STRICT_EQUAL(1, '1'); //false
         */
        IS_STRICT_EQUAL: is_equal_strict
    });
})(_);
/**
 * @module _.M.FLAG
 * @memberOf _.M
 */
;(function (_) {
    var _flags = {};

    /**
     * @lends _.M.FLAG
     * @type {{}}
     */
    _.M.FLAG = _.M.defineObject({
        /**
         * Check if a flag is exists
         * @param {string} name
         */
        has: function (name) {
            return _.has(_flags, name);
        },

        /**
         * Set a flag
         * @param {string} name
         * @param {boolean} [is_active=true] Flag status, default is True
         */
        flag: function (name, is_active) {
            is_active = _.isUndefined(is_active) ? true : Boolean(is_active);

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    _flags[tmp_name] = is_active;
                });
            } else {
                _flags[name] = is_active;
            }
        },

        /**
         * Get flags
         * @param {boolean} [detail=false] If true then return flags with detail of it, else only return flags name
         */
        flags: function (detail) {
            if (detail) {
                return _.clone(_flags);
            }
            return _.keys(_flags);
        },

        /**
         * Get flag by name
         * @param {string} name
         * @returns {(*|boolean)}
         */
        get: function (name) {
            return this.has(name) && Boolean(_flags[name]);
        },

        /**
         * Check if a flag is exists
         * @param {string} name
         * @returns {*}
         */
        isFlagged: function (name) {
            var result, self = this;

            if (_.isArray(name)) {
                result = [];
                _.each(name, function (tmp_name) {
                    if (self.get(tmp_name)) {
                        result.push(tmp_name);
                    }
                })
            } else {
                result = this.get(name);
            }

            return result;
        },

        /**
         *
         * @param {string|string[]} name
         * @param {boolean} [status] Missing - On/off when current flag's status is off/on.
         * Boolean - On/off when status is true/false
         */
        toggle: function (name, status) {
            var thisFunc = arguments.callee;
            var self = this;

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    thisFunc.apply(self, [tmp_name, status]);
                })
            } else {
                if (!_.isUndefined(status)) {
                    this.flag(name, Boolean(status));
                } else {
                    this.flag(name, !this.isFlagged(name));
                }
            }
        },

        reset: function () {
            _flags = {};
        }

    });
})(_);
/**
 * @module _.M.BaseClass
 * @memberOf _.M
 */
;(function (_) {
    /**
     * Base class
     * @class _.M.BaseClass
     * @property {string} type_prefix Prefix of class, use as prefix of instance ID, default is class name
     * @property {string} id Instance ID
     */
    function BaseClass() {
        if (!this.type_prefix) {
            this.type_prefix = _.M.className(this, true);
        }

        if (!this.id) {
            this.id = _.M.nextID(this.type_prefix, true);
        }
    }

    /**
     * 
     * @type {_.M.BaseClass}
     */
    _.M.BaseClass = BaseClass;
})(_);
;(function (_) {
    var _pre_options = {};


    function _extend(sources, dest_name, options, real_time) {
        if (_pre_options.hasOwnProperty(dest_name)) {
            throw new Error('Destination Pre Options is already exists');
        }
        sources = _.M.beArray(sources);
        var not_founds = _.filter(sources, function (source) {
            return !_pre_options.hasOwnProperty(source);
        });

        if (!_.isEmpty(not_founds)) {
            throw new Error('PreOptions are not defined:' + not_founds.join(', '));
        }
        if (!_.isObject(options)) {
            options = {};
        }
        if (!real_time) {
            var base_options = {};

            _.each(sources, function (base) {
                _.extend(base_options, _.M.PreOptions.get(base));
            });
            _.extend(options, base_options);

            _pre_options[dest_name] = {
                options: options,
                base: []
            };
        } else {
            _pre_options[dest_name] = {
                options: options,
                base: sources
            };
        }
    }

    _.M.PreOptions = _.M.defineObject({
        /**
         *
         * @param {string} name
         * @param {{}}options
         * @param {boolean} [override=false]
         */
        define: function (name, options, override) {
            if (override || !_pre_options.hasOwnProperty(name)) {
                _pre_options[name] = {
                    options: options,
                    base: []
                };
                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @returns {boolean}
         */
        has: function (name) {
            return _pre_options.hasOwnProperty(name);
        },
        /**
         *
         * @param {string} name
         * @param {{}} options
         * @returns {boolean}
         */
        update: function (name, options) {
            if (_pre_options.hasOwnProperty(name)) {
                _.extend(_pre_options[name].options, options);
                return true;
            }

            return false;
        },
        updateBase: function (name, new_base) {
            if (_pre_options.hasOwnProperty(name)) {
                _pre_options[name].base = new_base;

                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @param {{}} [custom={}]
         * @returns {*}
         */
        get: function (name, custom) {
            if (!_pre_options.hasOwnProperty(name)) {
                throw new Error('Pre Options "' + name + '" is undefined');
            }

            var result = {};

            _.each(_.M.beArray(_pre_options[name].base), function (base) {
                _.extend(result, _.M.PreOptions.get(base));
            });
            _.extend(result, _.clone(_pre_options[name].options), _.isObject(custom) ? custom : {});

            return result;
        },

        /**
         * Create PreOptions, base on real time value of other PreOptions
         * @param {string|string[]} sources Base on other PreOptions
         * @param {string} dest_name
         * @param {{}} [options={}]
         */
        extend: function (sources, dest_name, options) {
            _extend(sources, dest_name, options, true);
        },
        /**
         * Create PreOptions, base on runtime-value of other PreOptions
         * @param {string|string[]} sources Base on other PreOptions
         * @param {string} dest_name
         * @param {{}} [options={}]
         */
        baseOn: function (sources, dest_name, options) {
            _extend(sources, dest_name, options, false);
        },

        /**
         *
         * @param {boolean} [detail=false]
         * @returns {Array|{}}
         */
        list: function (detail) {
            if (detail) {
                return _.clone(_pre_options);
            }

            return Object.keys(_pre_options);
        },

        reset: function () {
            _pre_options = {};
        }
    });
})(_);
/**
 * Store data by key and data type. Support add, check exists, get and delete
 * @module _.M.ContentManager
 * @memberOf _.M
 * @requires _.M.BaseClass
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_STRING: 'string',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_NUMBER: 'number',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_BOOLEAN: 'boolean',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_ARRAY: 'array',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_FUNCTION: 'function',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_OBJECT: 'object',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_MIXED: 'mixed'
    });

    /**
     * Extract key to get content {string} type
     * @param {ContentManager} instance
     * @param {string} key
     * @returns {(string|boolean)} False when invalid key
     */
    function getContentTypeFromKey(instance, key) {
        var info = key.substr(instance.id.length + 1).split('_');

        if (info.length > 1) {
            return info[0];
        }

        return false;
    }

    /**
     * @class _.M.ContentManager
     */
    function ContentManager() {
        _.M.BaseClass.call(this);

        this._contents = {};
        this._usings = {};
    }

    _.M.inherit(ContentManager, _.M.BaseClass);

    /**
     * Check if content type is exists
     * @param {string} type
     * @returns {boolean}
     */
    ContentManager.prototype.hasType = function (type) {
        return this._contents.hasOwnProperty(type);
    };

    /**
     * Get array of content types
     * @returns {Array}
     */
    ContentManager.prototype.types = function () {
        return Object.keys(this._contents);
    };
    ContentManager.prototype.keys = function () {
        var self = this,
            result = {};

        Object.keys(this._contents).forEach(function (type) {
            result[type] = Object.keys(self._contents[type]);
        });

        return result;
    };

    /**
     * Filter content by callback, return position of valid contents
     * @param {function} callback Callback arguments:
     * - content
     * - meta
     * - key
     * - content type.
     * Return true on valid content, otherwise
     *
     * @param types
     * @returns {Array} Each item is object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     *  - meta: content meta
     */
    ContentManager.prototype.filter = function (callback, types) {
        var result = [],
            self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
        } else {
            types = _.intersection(_.M.beArray(types), Object.keys(this._contents));
        }

        _.M.loop(types, function (type) {
            _.M.loop(Object.keys(self._contents[type]), function (key) {
                if (callback(self._contents[type][key].content, self._contents[type][key].meta, key, type)) {
                    result.push({
                        type: type,
                        key: key,
                        content: _.clone(self._contents[type][key].content),
                        meta: self._contents[type][key].meta ? _.clone(self._contents[type][key].meta) : undefined
                    });
                }
            });
        });

        return result;
    };

    /**
     * Find first position of valid content
     * @param callback Callback arguments: content, meta, content key, content type. Return true on valid content, otherwise
     * @param types
     * @returns {boolean|{}} False if not found, else return object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     *  - meta: meta
     */
    ContentManager.prototype.find = function (callback, types) {
        var found = false,
            self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
        } else {
            types = _.intersection(_.M.beArray(types), Object.keys(this._contents));
        }

        _.M.loop(types, function (type) {
            _.M.loop(Object.keys(self._contents[type]), function (key) {
                var item = self._contents[type][key];
                if (callback(_.clone(item.content), _.clone(item.meta), key, type)) {
                    found = {
                        type: type,
                        key: key,
                        content: _.clone(item.content),
                        meta: item.meta ? _.clone(item.meta) : undefined
                    };

                    return 'break';
                }
            });

            if (found) {
                return 'break';
            }
        });

        return found;
    };

    /**
     * Find positions of content by content and [types]
     * @param {*} content
     * @param {string} [types] Find in this types, if missing then auto detect
     * @returns {Array} Array of object with keys: type, key
     */
    ContentManager.prototype.contentPositions = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return this.filter(callback, types);
    };

    /**
     * Check if key is valid
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isValidKey = function (key) {
        return false !== getContentTypeFromKey(this, key);
    };

    /**
     * Find content exists
     * @param content
     * @param types
     * @returns {boolean}
     */
    ContentManager.prototype.hasContent = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return false !== this.find(callback, types);
    };

    /**
     * Check if key is exists
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.has = function (key) {
        if (this.isUsing(key)) {
            return true;
        }

        var type = getContentTypeFromKey(this, key);

        if (false !== type) {
            return this._contents.hasOwnProperty(type) && this._contents[type].hasOwnProperty(key);
        }

        return false;
    };

    /**
     * Clean empty type
     */
    ContentManager.prototype.clean = function () {
        var self = this;
        _.each(Object.keys(this._contents), function (type) {
            if (_.isEmpty(self._contents[type])) {
                delete self._contents[type];
            }
        })
    };

    /**
     * Add content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.add = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var key = _.M.nextID(this.id + '_' + type);

        if (!this._contents.hasOwnProperty(type)) {
            this._contents[type] = {};
        }
        this._contents[type][key] = {
            content: content,
            meta: meta
        };

        return key;
    };

    /**
     * Add unique content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.addUnique = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var positions = this.contentPositions(content, type);

        if (positions.length == 0) {
            return this.add(content, meta, type);
        }

        return positions.shift().key;
    };

    /**
     *
     * @param {string|string[]} keys
     * @param with_meta
     * @return {{}}
     */
    ContentManager.prototype.items = function (keys, with_meta) {
        var result = {},
            type,
            key,
            callback;

        if (with_meta) {
            callback = function (item) {
                return _.clone(item)
            };
        } else {
            callback = function (item) {
                return _.clone(item.content);
            }
        }
        if (!_.isEmpty(keys)) {
            var type_grouped = _.groupBy(_.M.beArray(keys), _.partial(getContentTypeFromKey, this));

            for (type in type_grouped) {
                if (type_grouped.hasOwnProperty(type)) {
                    _.each(_.pick(this._contents[type], type_grouped[type]), function (value, key) {
                        result[key] = callback(value);
                    });
                }
            }
        } else {
            for (type in this._contents) {
                if (this._contents.hasOwnProperty(type)) {
                    for (key in this._contents[type]) {
                        if (this._contents[type].hasOwnProperty(key)) {
                            result[key] = callback(this._contents[type][key]);
                        }
                    }
                }
            }
        }


        return result;
    };

    /**
     * Check if content key is using
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isUsing = function (key) {
        return this._usings.hasOwnProperty(key);
    };

    /**
     * Check if content is using
     * @param {*} content
     * @param {string} [type] Auto detect when missing
     * @returns {boolean}
     */
    ContentManager.prototype.isUsingContent = function (content, type) {
        var positions = this.contentPositions(content, type);

        if (!_.isEmpty(positions)) {
            return !_.isEmpty(_.intersection(_.pluck(positions, 'key'), Object.keys(this._usings)));
        }

        return false;
    };

    /**
     * Toggle using key
     * @param {string} key
     * @param {boolean} [is_using = true]
     * @return {boolean} True -> key is exists and set using status success. False -> key is not exists
     */
    ContentManager.prototype.using = function (key, is_using) {
        if (this.has(key)) {
            if (_.isUndefined(is_using) || is_using) {
                this._usings[key] = true;
            } else {
                delete this._usings[key];
            }

            return true;
        }

        return false;
    };

    /**
     * Set keys to unused
     * @param {string|string[]}keys
     */
    ContentManager.prototype.unused = function (keys) {
        this._usings = _.omit(this._usings, _.flatten(_.toArray(arguments)));
    };

    /**
     * Get using keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {string[], {}}
     */
    ContentManager.prototype.usingKeys = function (grouped) {
        if (grouped) {
            return _.groupBy(Object.keys(this._usings), _.partial(getContentTypeFromKey, this));
        }

        return Object.keys(this._usings);
    };
    /**
     * Get unused keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {object|Array}
     */
    ContentManager.prototype.unusedKeys = function (grouped) {
        var using_grouped = this.usingKeys(true),
            result = {};

        for (var type in this._contents) {
            if (this._contents.hasOwnProperty(type)) {
                if (!using_grouped.hasOwnProperty(type)) {
                    result[type] = Object.keys(this._contents[type]);
                } else {
                    result[type] = _.difference(Object.keys(this._contents[type]), using_grouped[type]);
                }

                if (_.isEmpty(result[type])) {
                    delete result[type];
                }
            }
        }

        if (!grouped) {
            return _.flatten(_.values(result));
        }

        return result;
    };

    /**
     * Get content and meta by key
     * @param {string} key
     * @returns {*}
     */
    ContentManager.prototype.get = function (key) {
        var type = getContentTypeFromKey(this, key);

        if (false !== type && this._contents[type].hasOwnProperty(key)) {
            return _.clone(this._contents[type][key]);
        }

        return false;
    };

    /**
     * Get type contents
     * @param {string} type
     * @returns {({}|boolean)}
     */
    ContentManager.prototype.getType = function (type) {
        if (this.hasType(type)) {
            return _.clone(this._contents[type]);
        }

        return false;
    };

    /**
     * Get content by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getContent = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.content);
        }

        return default_value;
    };

    /**
     * Get content meta by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getMeta = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.meta);
        }

        return default_value;
    };

    /**
     * Remove content by key. Return removed keys
     * @param {string|string[]} keys
     * @returns {object[]} Array of objects, each object has 2 item:
     * - type: content type
     * - key: removed key
     */
    ContentManager.prototype.remove = function (keys) {
        var removes = [],
            key_grouped = _.groupBy(_.flatten(_.toArray(arguments)), _.partial(getContentTypeFromKey, this));

        delete key_grouped['false'];

        for (var type in key_grouped) {
            if (key_grouped.hasOwnProperty(type) && this._contents.hasOwnProperty(type)) {
                for (var index in key_grouped[type]) {
                    if (key_grouped[type].hasOwnProperty(index)) {
                        removes.push({
                            type: type,
                            key: key_grouped[type][index]
                        });

                        delete this._contents[type][key_grouped[type][index]];
                        delete this._usings[key_grouped[type][index]];
                    }
                }
            }
        }

        this.clean();

        return removes;
    };

    /**
     * Remove items by content
     * @param {*} content
     * @param {string} [type]
     * @returns {object[]} Array of objects, each object has 2 item:
     * - type: content type
     * - key: removed key
     */
    ContentManager.prototype.removeContent = function (content, type) {
        var positions = this.contentPositions(content, type),
            self = this;

        if (positions.length) {
            _.each(positions, function (pos) {
                delete self._contents[pos.type][pos.key];
                delete self._usings[pos.key];
            });
        }

        this.clean();

        return positions;
    };

    /**
     * Update content and meta
     * @param {string} key
     * @param {*} content
     * @param {*} [meta]
     * @returns {boolean}
     */
    ContentManager.prototype.update = function (key, content, meta) {
        if (this.has(key)) {
            var type = getContentTypeFromKey(this, key);

            this._contents[type][key].content = content;

            if (arguments.length >= 3) {
                this._contents[type][key].meta = meta;
            }

            return true;
        }

        return false;
    };

    /**
     * Update meta
     * @param {string} key
     * @param {*} meta
     * @returns {boolean}
     */
    ContentManager.prototype.updateMeta = function (key, meta) {
        if (this.has(key)) {
            var type = getContentTypeFromKey(this, key);

            this._contents[type][key].meta = meta;

            return true;
        }

        return false;
    };


    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUsing = function () {
        return this.remove(Object.keys(this._usings));
    };

    /**
     * Remove using content
     * @returns {array} Removed position
     */
    ContentManager.prototype.removeUnusing = function () {
        return this.remove(this.unusedKeys());
    };

    /**
     * Get status
     * @returns {{using: string[], types: {}}}
     */
    ContentManager.prototype.status = function () {
        return {
            using: Object.keys(this._usings),
            types: this.keys()
        };
    };

    /**
     *
     * @type {_.M.ContentManager}
     */
    _.M.ContentManager = ContentManager;

})(_);
/**
 * Priority
 * @module _.M.Priority
 * @memberOf _.M
 * @requires _.M.ContentManager
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @name _.M.PRIORITY_HIGHEST
         * @constant {number}
         * @default
         */
        PRIORITY_HIGHEST: 100,
        /**
         * @name _.M.PRIORITY_HIGH
         * @constant {number}
         * @default
         */
        PRIORITY_HIGH: 250,
        /**
         * @name _.M.PRIORITY_DEFAULT
         * @constant {number}
         * @default
         */
        PRIORITY_DEFAULT: 500,
        /**
         * @name _.M.PRIORITY_LOW
         * @constant {number}
         * @default
         */
        PRIORITY_LOW: 750,
        /**
         * @name _.M.PRIORITY_LOWEST
         * @constant {number}
         * @default
         */
        PRIORITY_LOWEST: 1000,

        /**
         * @name _.M.PRIORITY_LEVEL_1
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_1: 100,

        /**
         * @name _.M.PRIORITY_LEVEL_2
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_2: 200,

        /**
         * @name _.M.PRIORITY_LEVEL_3
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_3: 300,

        /**
         * @name _.M.PRIORITY_LEVEL_4
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_4: 400,

        /**
         * @name _.M.PRIORITY_LEVEL_5
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_5: 500,

        /**
         * @name _.M.PRIORITY_LEVEL_6
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_6: 600,

        /**
         * @name _.M.PRIORITY_LEVEL_7
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_7: 700,
        /**
         * @name _.M.PRIORITY_LEVEL_8
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_8: 800,

        /**
         * @name _.M.PRIORITY_LEVEL_9
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_9: 900,
        /**
         * @name _.M.PRIORITY_LEVEL_10
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_10: 1000
    });

    /**
     * Manage contents with priority
     * @class _.M.Priority
     * @extends _.M.ContentManager
     */
    function Priority() {
        _.M.ContentManager.call(this);

        /**
         * Priority number and keys
         * @type {{}}
         * @private
         */
        this._priorities = {};

        /**
         * key => priority
         * @type {{}}
         * @private
         */
        this._key_mapped = {};
    }
    _.M.inherit(Priority, _.M.ContentManager);

    /**
     * Check if a priority is exists
     * @param priority
     * @returns {boolean}
     */
    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority);
    };

    /**
     * Check if a key is exists
     * @param {string} key
     * @returns {*|boolean}
     */
    Priority.prototype.has = function (key) {
        return this._key_mapped.hasOwnProperty(key);
    };

    /**
     * Get status about number of priorities and contents
     * @returns {{priorities: number, contents: number}}
     */
    Priority.prototype.status = function () {
        var priorities = Object.keys(this._priorities),
            result = {
                priorities: priorities.length,
                contents: 0
            },
            self = this;

        priorities.forEach(function (priority) {
            result.contents += self._priorities[priority].length;
        });

        return result;
    };

    /**
     * Add content
     * @param {*} content
     * @param {number} [priority = _.M.PRIORITY_DEFAULT]
     * @param {*} [meta] Content meta info
     * @returns {(string|boolean)} content key
     */
    Priority.prototype.add = function (content, priority, meta) {
        var key = this._super.add.call(this, content, meta, 'priority');

        this.using(key);
        priority = _.M.beNumber(priority, _.M.PRIORITY_DEFAULT);

        if (!_.has(this._priorities, priority)) {
            this._priorities[priority] = [];
        }

        this._priorities[priority].push(key);
        this._key_mapped[key] = priority;

        return key;
    };

    /**
     * Remove content by keys
     * @param {string|string[]} keys
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]} Removed keys
     */
    Priority.prototype.remove = function (keys, priorities) {
        var removed  = remove_keys.apply(null, [this].concat(_.toArray(arguments)));

        return _.pluck(this._super.remove.call(this, removed), 'key');
    };

    /**
     *
     * @param instance
     * @param {string[]} keys
     * @param {number[]} priorities
     */
    function get_valid_priorities_by_keys(instance, keys, priorities) {
        var priorities_and_keys = _.M.invertToArray(_.pick(instance._key_mapped, _.M.beArray(keys))),
            priorities_from_keys_casted = _.M.castItemsType(Object.keys(priorities_and_keys), 'number');

        if (!priorities) {
            priorities = priorities_from_keys_casted;
        } else {
            priorities = _.intersection(_.M.castItemsType(_.M.beArray(priorities), 'number'), priorities_from_keys_casted);
        }
        priorities = get_valid_priorities(instance, priorities);

        return _.mapObject(_.pick(instance._priorities, priorities), function (priority_keys, priority) {
            return _.intersection(priorities_and_keys[priority], priority_keys);
        });
    }
    /**
     *
     * @param {Priority} instance
     * @param {number[]} priorities
     * @return {number[]}
     */
    function get_valid_priorities(instance, priorities) {
        return _.intersection(_.M.castItemsType(priorities, 'number'), _.M.castItemsType(Object.keys(instance._priorities), 'number'));
    }

    function remove_keys(instance, keys, priorities) {
        var priorities_with_keys = get_valid_priorities_by_keys(instance, keys, priorities),
            remove_keys;


        _.M.loop(priorities_with_keys, function (priority_keys, priority) {
            instance._priorities[priority] = _.difference(instance._priorities[priority], priority_keys);
        });

        remove_keys = _.flatten(_.values(priorities_with_keys));
        _.M.removeKeys(instance._key_mapped, remove_keys);

        return remove_keys;
    }

    /**
     * Remove content
     * @param {*} content
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]} Removed keys
     */
    Priority.prototype.removeContent = function (content, priorities) {
        var content_positions = this.contentPositions(content, 'priority'),
            keys = _.pluck(content_positions, 'key');

        if(!keys.length){
            return [];
        }
        if (priorities) {
            return this.remove(keys, priorities);
        }

        return this.remove(keys);
    };

    /**
     * Get priority data
     * @param {boolean} [content_only = false] return priority content only, default get content and meta
     * @returns {Array} List of objects with keys:
     * - key: content key
     * - meta: meta info
     * - content: content
     */
    Priority.prototype.export = function (content_only) {
        var contents = [],
            priority_keys = _.M.castItemsType(Object.keys(this._priorities), 'number'),
            self = this,
            raw_contents = this.getType('priority');

        priority_keys.sort(_.M.SORT_NUMBER);

        _.each(priority_keys, function (priority) {
            _.each(self._priorities[priority], function (key) {
                if (!raw_contents.hasOwnProperty(key)) {
                    return;
                }
                if (content_only) {
                    contents.push(raw_contents[key]['content']);
                } else {
                    contents.push(_.extend({key: key}, raw_contents[key]));
                }
            });
        });

        return contents;
    };

    /**
     *
     * @type {_.M.Priority}
     */
    _.M.Priority = Priority;
})(_);
/**
 * Callback listener system
 * @module _.M.WAITER
 * @memberOf _.M
 */
;(function (_) {
    var _waiters = {};

    /**
     * @lends _.M.WAITER
     * @type {{}}
     */
    _.M.WAITER = _.M.defineObject({
        /**
         * Check if a waiter key is exists
         * @param {string} waiter_key
         */
        has: function (waiter_key) {
            return _waiters.hasOwnProperty(waiter_key) && _waiters[waiter_key].times > 0;
        },

        /**
         * Add callback
         * @param {(string|function)} callback Callback
         * @param {int} [times = 1] Run times
         * @param {string} [description = ''] Waiter description
         * @returns string Callback key
         */
        add: function (callback, times, description) {
            var key = _.M.nextID('waiter_key', true);

            _waiters[key] = {
                callback: callback,
                times: _.isUndefined(times) ? 1 : times,
                description: description || ''
            };

            return key;
        },

        /**
         * Similar to "add" but add waiter key to window as function
         * @param {(string|function)} callback Callback
         * @param {int} [times = 1] Run times
         * @param {string} [description] Waiter description
         * @returns {(string|number)} Waiter key/function name
         */
        createFunc: function (callback, times, description) {
            var key = this.add(callback, times, description);
            var self = this;

            window[key] = (function (key) {
                return function () {
                    return self.run.apply(self, [key].concat(_.toArray(arguments)));
                };
            })(key);

            return key;
        },

        /**
         * Remove keys by arguments
         * @returns {Array} Removed waiters
         */
        remove: function () {
            var keys = _.flatten(_.toArray(arguments)),
                removed = [];

            _.each(keys, function (tmp_key) {
                if (_waiters.hasOwnProperty(tmp_key)) {
                    removed.push(tmp_key);
                    window[tmp_key] = undefined;
                    delete _waiters[tmp_key];
                    delete window[tmp_key];
                }
            });

            return removed;
        },

        /**
         * Run the waiter
         * @param {string} waiter_key
         * @param {Array} args
         * @param {Object} this_arg
         * @returns {*}
         */
        run: function (waiter_key, args, this_arg) {
            var result;

            if (this.has(waiter_key)) {
                result = _waiters[waiter_key].callback.apply(this_arg || null, _.M.beArray(args));

                if (--_waiters[waiter_key].times < 1) {
                    this.remove(waiter_key);
                }
            } else {
                throw new Error('Waiter key is non-exists: ' + waiter_key);
            }

            return result;
        },

        /**
         * Return list of waiters
         * @param {boolean} [description = false] Include waiter description, default is false
         * @returns {(Array|{})}
         */
        list: function (description) {
            if (description) {
                var result = {};
                _.each(_waiters, function (detail, name) {
                    result[name] = detail.description;
                });
                return result;
            }

            return Object.keys(_waiters);
        }
    });
})(_);
/**
 * @module _.M.EventEmitter
 * @memberOf _.M
 * @requires _.M.Priority
 */
;(function (_) {
    _.M.defineConstant({
        /**
         * Default limit event't listeners
         * @name _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_LIMIT_LISTENERS: 10,

        /**
         * Unlimited event's listeners
         * @name _.M.EVENT_EMITTER_EVENT_UNLIMITED
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_UNLIMITED: -1

    });

    /**
     * Event management system
     * @class _.M.EventEmitter
     * @extends _.M.BaseClass
     */
    function EventEmitter(options) {
        _.M.BaseClass.call(this);

        options = _.defaults(options || {}, {
            'limit': _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS,
            'events': {},
            'event_mimics': [],
            'event_privates': []
        });

        /**
         *
         * @type {{_.M.Priority}}
         * @private
         */
        this._events = {};
        /**
         *
         * @type {{}}
         * @private
         */
        this._event_emitted = {};

        /**
         * @private
         */
        this._limit = _.M.beNumber(options.limit, _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS);

        /**
         *
         * @type {{}}
         * @private
         */
        this._event_followers = {};

        /**
         *
         * @type {{}}
         * @private
         */
        this._event_following = {};

        /**
         * Mimic events when noticed from other EventEmitter
         * @type {Array}
         * @private
         */
        this._event_mimics = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._event_privates = ['attach', 'attached'];

        if (!_.isEmpty(options['events'])) {
            this.addListeners(_.M.beObject(options['events']));
        }
        if (!_.isEmpty(options['event_mimics'])) {
            this.mimic(_.M.beArray(options['event_mimics']));
        }
        if (!_.isEmpty(options['event_privates'])) {
            this.private(_.M.beArray(options['event_privates']));
        }
    }

    /**
     * Reset events
     * @param {string} [event] Special event to reset, if not, reset all events
     */
    EventEmitter.prototype.resetEvents = function (event) {
        if (event) {
            if (this._events.hasOwnProperty(event)) {
                delete this._events[event];
                delete this._event_emitted[event];
            }
        } else {
            this._events = {};
            this._event_emitted = {};
        }
    };

    /**
     * Alias of resetEvents
     * @see resetEvents
     */
    EventEmitter.prototype.reset = function (event) {
        return this.resetEvents(event);
    };

    /**
     * Get all events name
     * @param {boolean} count Return events listeners count
     * @return {Object|Array}
     */
    EventEmitter.prototype.events = function (count) {
        if (count) {
            var result = {};
            var self = this;

            Object.keys(this._events).forEach(function (event) {
                result[event] = self._events[event].priority.status().contents;
            });

            return result;
        }
        return Object.keys(this._events);
    };

    /**
     * Get event emitted count
     * @param {string} event Event name, if not special then return all of emitted events
     * @returns {(number|{})}
     */
    EventEmitter.prototype.emitted = function (event) {
        if (!_.isUndefined(event)) {
            return this._event_emitted.hasOwnProperty(event) ? this._event_emitted[event] : 0;
        }

        return _.clone(this._event_emitted);
    };

    /**
     * Set event listener limit
     * @param {int} [limit]
     */
    EventEmitter.prototype.limit = function (limit) {
        this._limit = limit + 0;
    };

    /**
     * Set unlimited for event listeners
     */
    EventEmitter.prototype.unlimited = function () {
        this._limit = _.M.EVENT_EMITTER_EVENT_UNLIMITED;
    };

    /**
     * Add event listener
     * @param {string|string[]} events Array of events name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} [option] Option is object with keys:
     * priority {@see _.M.PRIORITY_DEFAULT},
     * times (-1 - forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (events, listeners, option) {
        var self = this;

        listeners = _.M.beArray(listeners);
        events = _.uniq(_.M.beArray(events));

        if (!listeners.length) {
            return false;
        }

        add_listener__prepare_events(this, events, listeners.length);
        option = add_listener__get_option(option);

        _.each(events, function (event) {
            var event_detail = self._events[event];
            var keys = add_listener__add_listeners(self, event, listeners, option);

            if (!event_detail.key_mapped.hasOwnProperty(option.key)) {
                event_detail.key_mapped[option.key] = keys;
            } else {
                _.M.mergeArray(event_detail.key_mapped[option.key], keys);
            }
        });

        return option.key;
    };

    function add_listener__prepare_events(ee, events, listener_length) {
        _.each(events, function (event) {
            if (!ee._events.hasOwnProperty(event)) {
                ee._events[event] = {
                    priority: new _.M.Priority(),
                    key_mapped: {}
                };
            } else if (ee._limit != _.M.EVENT_EMITTER_EVENT_UNLIMITED) {
                var status = ee._events[event].priority.status();

                if (status.contents + listener_length > ee._limit) {
                    console.warn('Possible _.M.EventEmitter memory leak detected. '
                        + (status.contents + listeners.length) + ' listeners added (limit is ' + ee._limit
                        + '). Use emitter.limit() or emitter.unlimited to resolve this warning.'
                    );
                }
            }
        });
    }

    /**
     *
     * @param option
     * @returns {{priority, times, context, key, async}}
     */
    function add_listener__get_option(option) {
        if (_.M.isNumeric(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: _.M.PRIORITY_DEFAULT,
            times: -1,
            context: null,
            key: null,
            async: false
        });

        option.times = _.M.beNumber(option.times, -1);
        if (option.key === null) {
            option.key = _.M.nextID('event_emitter_listener');
        }

        return option;
    }

    /**
     *
     * @param {EventEmitter} ee
     * @param {string} event
     * @param {callback|callback[]} listeners
     * @param {{}} option
     * @return {string[]}
     */
    function add_listener__add_listeners(ee, event, listeners, option) {
        var keys = [],
            event_detail = ee._events[event];

        _.M.loop(_.M.beArray(listeners), function (listener) {
            var key = event_detail.priority.add(listener, option.priority, {
                listener_key: option.key,
                async: option.async,
                times: option.times,
                event: event
            });

            keys.push(key);
        });

        return keys;
    }

    /**
     * Check if a key is exists
     * @param {string} key
     * @param {string|string[]} [events]
     * @return {boolean}
     */
    EventEmitter.prototype.has = function (key, events) {
        if (!events) {
            events = Object.keys(this._events);
        } else {
            events = _.intersection(_.M.beArray(key), Object.keys(this._events));
        }
        if (_.isEmpty(events)) {
            return false;
        }

        var found = false, self = this;

        _.M.loop(events, function (event) {
            if (self._events[event].key_mapped.hasOwnProperty(key)) {
                found = true;
                return 'break';
            }
        });

        return found;
    };

    /**
     * @see addListener
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, arguments);
    };

    /**
     * Add once time listener
     * @param events
     * @param listeners
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (events, listeners, option) {
        if (_.M.isNumeric(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(events, listeners, option);
    };

    /**
     * @see addOnceListener
     */
    EventEmitter.prototype.once = function (events, listener, option) {
        return this.addOnceListener.apply(this, arguments);
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     * @return {string[]} Listener keys
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this, keys = [];

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = _.M.beArray(event_cbs);
                _.each(event_cbs, function (event_cb) {
                    event_cb = _.M.beArray(event_cb);
                    events_arr.push({
                        name: event_name,
                        cb: event_cb[0],
                        options: event_cb.length > 1 ? event_cb[1] : {}
                    });
                });
            });
        }

        _.each(events_arr, function (event_info) {
            keys.push(self.addListener(event_info['name'], event_info['cb'], event_info['options']));
        });

        return keys;
    };

    /**
     * Emit event. Each event emitted will emit a event called 'event_emitted', with event emitted and it's data
     * @param {string|string[]} events Array of events
     * @param {*} [data]
     * @param {Function} [final_cb]
     */
    EventEmitter.prototype.emitEvent = function (events, data, final_cb) {
        var self = this;

        _.each(_.M.beArray(events), function (event) {
            if (self._events.hasOwnProperty(event)) {
                _emit_event(self, event, _.clone(data));
            }
            if (event !== 'event_emitted') {
                _emit_event(self, 'event_emitted', [event, _.clone(data)]);
            }
            if (_is_need_to_notice(self, event)) {
                _notice_event(self, event, _.clone(data));
            }

            _emit_event(self, event + '_complete', _.clone(data));
        });

        if (final_cb) {
            final_cb.call(this);
        }
    };

    function _emit_event(instance, event_name, data) {
        var emitted = false,
            listeners;

        if (instance._events.hasOwnProperty(event_name)) {
            listeners = instance._events[event_name].priority.export();

            if (listeners.length) {
                emitted = true;
                _.each(listeners, function (listener_detail) {
                    if (listener_detail.meta.times == -1 || listener_detail.meta.times > 0) {
                        if (listener_detail.meta.async) {
                            _.M.async(listener_detail.content, data, listener_detail.meta.context || instance);
                        } else {
                            _.M.callFunc(listener_detail.content, data, listener_detail.meta.context || instance);
                        }

                        if (listener_detail.meta.times == -1) {
                            return;
                        }

                        listener_detail.meta.times--;
                        if (listener_detail.meta.times > 0) {
                            instance._events[event_name].priority.updateMeta(listener_detail.key, listener_detail.meta);
                            return;
                        }
                    }

                    _remove_listener(instance, event_name, listener_detail.meta.listener_key, listener_detail.key);
                });
            }
        }
        if (!instance._event_emitted.hasOwnProperty(event_name)) {
            instance._event_emitted[event_name] = 1;
        } else {
            instance._event_emitted[event_name] += 1;
        }

        return emitted;
    }

    function _remove_listener(instance, event, listener_key, priority_key) {
        if (!instance._events.hasOwnProperty(event) || !instance._events[event].key_mapped.hasOwnProperty(listener_key)) {
            return;
        }
        instance._events[event].priority.remove(priority_key);
        instance._events[event].key_mapped[listener_key] = _.without(instance._events[event].key_mapped[listener_key], priority_key);

        if (!instance._events[event].key_mapped[listener_key].length) {
            delete instance._events[event].key_mapped[listener_key];
        }
    }

    function _is_need_to_notice(instance, event_name) {
        return 'event_emitted' !== event_name
            && -1 == instance._event_privates.indexOf(event_name)
            && !_.isEmpty(instance._event_followers);
    }

    function _notice_event(instance, event_name, data) {
        _.each(instance._event_followers, function (follower) {
            if (follower.async) {
                _.M.async(_.partial(_notice_event_cb, follower), [instance.id, event_name, data], instance);
            } else {
                _.M.callFunc(_.partial(_notice_event_cb, follower), [instance.id, event_name, data], instance);
            }
        });
    }

    function _notice_event_cb(follower, source_id, source_event, source_data) {
        follower.target.notice(source_id, source_event, source_data);
    }


    /**
     * Alias of 'emitEvent'
     * @see emitEvent
     */
    EventEmitter.prototype.emit = function () {
        this.emitEvent.apply(this, arguments);
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} removes Listener / listener key or array of them
     * @param {string[]} [events]
     * @param {number} [priority]
     */
    EventEmitter.prototype.removeListener = function (removes, events, priority) {
        var self = this, removed = {}, removes_by_keys, remove_by_listeners;

        removes = _.M.beArray(removes);
        events = _get_valid_events(self, events);

        removes_by_keys = _.filter(removes, _.M.isLikeString);
        remove_by_listeners = _.filter(removes, _.isFunction);

        if (removes_by_keys.length) {
            removed = _remove_listener_by_keys(self, removes_by_keys, events, priority);
        }
        if (remove_by_listeners.length) {
            _merge_object_item(removed, _remove_listener_by_listeners(self, remove_by_listeners, events, priority));
        }

        _.each(events, function (event) {
            if (_.isEmpty(self._events[event].key_mapped)) {
                delete self._events[event];
            }
        });

        return removed;
    };

    /**
     *
     * @param instance
     * @param {Array} [events]
     * @return {Array}
     * @private
     */
    function _get_valid_events(instance, events) {
        if (!events) {
            return Object.keys(instance._events);
        }

        return _.M.validKeys(instance._events, _.M.beArray(events));
    }

    /**
     *
     * @param instance
     * @param keys
     * @param {Array} events Valid events
     * @return {{}}
     * @private
     */
    function _group_keys_by_event(instance, keys, events) {
        var grouped = {}, event, found, events_cloned = _.clone(events);

        while (keys.length && (event = events_cloned.shift())) {
            found = _.M.validKeys(instance._events[event].key_mapped, keys);

            if (found.length) {
                grouped[event] = found;
                keys = _.difference(keys, found);
            }
        }

        return grouped;
    }

    function _remove_listener_by_keys(instance, keys, events, priority) {
        var keys_grouped_by_event = _group_keys_by_event(instance, keys, events),
            event_detail;

        _.each(keys_grouped_by_event, function (keys, event) {
            event_detail = instance._events[event];
            event_detail.priority.remove(_.flatten(
                _.values(
                    _.pick(event_detail.key_mapped, keys))),
                priority ? priority : null);

            _.M.removeKeys(event_detail.key_mapped, keys);
            instance._events[event] = event_detail;
        });

        return keys_grouped_by_event;
    }

    function _remove_listener_by_listeners(instance, listeners, events, priority) {
        var removed = {}, priority_keys_removed;

        priority = priority || null;

        _.each(listeners, function (listener) {
            _.each(events, function (event) {
                priority_keys_removed = instance._events[event].priority.removeContent(listener, priority);

                if (priority_keys_removed.length) {
                    var removed_grouped_by_listener_key = _remove_key_mapped_by_priority_keys(instance._events[event].key_mapped, priority_keys_removed);

                    _merge_object_item(removed, _.M.beObject(event, Object.keys(removed_grouped_by_listener_key)));
                }
            });
        });

        return removed;
    }


    /**
     *
     * @param key_mapped
     * @param priority_keys
     * @return {{}} Object, Event key => priority keys
     * @private
     */
    function _remove_key_mapped_by_priority_keys(key_mapped, priority_keys) {
        var found, keys = Object.keys(key_mapped), key, removed = {};

        while (priority_keys.length && (key = keys.shift())) {
            found = _.intersection(priority_keys, key_mapped[key]);

            if (found.length) {
                key_mapped[key] = _.difference(key_mapped[key], found);
                if (!key_mapped[key].length) {
                    delete key_mapped[key];
                }

                priority_keys = _.difference(priority_keys, found);
                removed[key] = found;
            }
        }

        return removed;
    }

    /**
     * Merge each item of an object with item of other object
     * @param {{}} target
     * @param {{}} object
     */
    function _merge_object_item(target, object) {
        _.each(object, function (value, key) {
            value = _.M.beArray(value);

            if (!target.hasOwnProperty(key)) {
                target[key] = value;
            } else {
                _.M.mergeArray(target[key], value);
            }
        });
    }

    /**
     * Alias of `removeListener`
     * @see removeListener
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Set events is private
     */
    EventEmitter.prototype.private = function () {
        _.M.mergeArray(this._event_privates, _.flatten(_.toArray(arguments)));
    };

    /**
     * Set events is mimic
     */
    EventEmitter.prototype.mimic = function () {
        _.M.mergeArray(this._event_mimics, _.flatten(_.toArray(arguments)));
    };

    /**
     * Attach other event emitter to this. Notice async
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [async=true] notice target EventEmitter async. Default is true
     * @returns {boolean}
     */
    EventEmitter.prototype.attach = function (eventEmitter, only, excepts, async) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (!this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this._event_followers[eventEmitter.id] = {
                    target: eventEmitter,
                    async: _.isUndefined(async) || Boolean(async)
                };
                this.emitEvent('attach', [eventEmitter, only, excepts]);
                eventEmitter.attachTo(this, only, excepts);
                return true;
            }

            return false;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     * Check if has an EE instance is attached to this
     * @param {_.M.EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.hasFollower = function (eventEmitter) {
        return _.M.isEventEmitter(eventEmitter) && this._event_followers.hasOwnProperty(eventEmitter.id);
    };

    /**
     * Attach other event emitter to this. Notice sync
     * @param eventEmitter
     * @param only
     * @param excepts
     * @return boolean
     */
    EventEmitter.prototype.attachHard = function (eventEmitter, only, excepts) {
        return this.attach(eventEmitter, only, excepts, false);
    };

    /**
     * Attach this to other event emitter instance. Notice async
     * @param {_.M.EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [hard=false] Hard attach to other, other notice will call immediate. Default is false
     * @returns {boolean}
     */
    EventEmitter.prototype.attachTo = function (eventEmitter, only, excepts, hard) {
        if (!_.M.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid _.M.EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.type_prefix,
                only: _.M.beArray(only || []),
                excepts: _.M.beArray(excepts || [])
            };
            this.emitEvent('attached', [eventEmitter, only, excepts]);
            if (hard) {
                return eventEmitter.attachHard(this);
            }

            return eventEmitter.attach(this);

        }

        return true;
    };

    /**
     * Check if this one is following another EE instance
     * @param {EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.isFollowing = function (eventEmitter) {
        return _.M.isEventEmitter(eventEmitter) && this._event_following.hasOwnProperty(eventEmitter.id);
    };

    /**
     * Hard Attach this to other event emitter instance. Notice sync
     * @param {_.M.EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @returns {boolean}
     */
    EventEmitter.prototype.attachHardTo = function (eventEmitter, only, excepts) {
        return this.attachTo(eventEmitter, only, excepts, true);
    };

    /**
     * Notice following event emitter emitted. If noticed event is a mimic event then do not emit any notice events.
     * Emit events:
     * - <source id>.<event name>
     * - <source type>.<event name>,
     * - noticed.<source id>.<event name>
     * - noticed.<source id>
     * - noticed.<source type>.<event name>
     * - noticed.<source type>
     * - noticed
     *
     * Each notice event emit with data as object:
     * - id: source id
     * - type: source type
     * - event: source event name
     * - data: source event data
     *
     * @param {string} sourceID Following event emitter id
     * @param {string} eventName Event emitted
     * @param {*} data
     */
    EventEmitter.prototype.notice = function (sourceID, eventName, data) {
        if (this._event_following.hasOwnProperty(sourceID)) {
            var following_info = this._event_following[sourceID],
                self = this;

            if ((_.isEmpty(following_info.only) || -1 !== following_info.only.indexOf(eventName))
                && (_.isEmpty(following_info.excepts) || -1 === following_info.excepts.indexOf(eventName))) {

                var mimic_events = [
                    eventName,
                    following_info.type + '.*',
                    following_info.type + '.' + eventName
                ];

                if (!_.isEmpty(_.intersection(mimic_events, self._event_mimics))) {
                    self.emitEvent(eventName, data);

                    return;
                }

                var notice_data = {
                        id: following_info.id,
                        type: following_info.type,
                        event: eventName,
                        data: data
                    },
                    notice_events = [
                        following_info.id + '.' + eventName,
                        following_info.type + '.' + eventName,
                        'noticed.' + following_info.id + '.' + eventName,
                        'noticed.' + following_info.id,
                        'noticed.' + following_info.type + '.' + eventName,
                        'noticed.' + following_info.type,
                        'noticed'
                    ];

                this.emitEvent(notice_events, notice_data);
            }
        }
    };

    /**
     * Detach a followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detach', [eventEmitter]);
                delete this._event_followers[eventEmitter.id];
                eventEmitter.detachFrom(this);

                return true;
            }

            return false;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     * Detach a following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_following.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detached', [eventEmitter]);
                delete this._event_following[eventEmitter.id];
                eventEmitter.detach(this);

                return true;
            }
            return false;

        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     *
     * @type {_.M.EventEmitter}
     */
    _.M.EventEmitter = EventEmitter;

    /**
     * Check if object is instance of Event Emitter
     * @param {object} object
     * @returns {boolean}
     */
    _.M.isEventEmitter = function (object) {
        if (_.isObject(object)) {
            return object instanceof EventEmitter;
        }

        return false;
    };

})(_);
/**
 * Cache management system
 * @module _.M.CACHE
 * @memberOf _.M
 */
;(function (_) {
    _.M.defineConstant({
        /**
         * 10 seconds
         * @name _.M.CACHE_MIN
         * @constant {number}
         * @default
         */
        CACHE_MIN: 10,
        /**
         * 1 minute
         * @name _.M.CACHE_TINY
         * @constant {number}
         * @default
         */
        CACHE_TINY: 60,
        /**
         * 5 minutes
         * @name _.M.CACHE_SHORT
         * @constant {number}
         * @default
         */
        CACHE_SHORT: 300,
        /**
         * 10 minutes
         * @name _.M.CACHE_MEDIUM
         * @constant {number}
         * @default
         */
        CACHE_MEDIUM: 600,
        /**
         * 1 hour
         * @name _.M.CACHE_LONG
         * @constant {number}
         * @default
         */
        CACHE_LONG: 3600,
        /**
         * Forever
         * @name _.M.CACHE_FOREVER
         * @constant {number}
         * @default
         */
        CACHE_FOREVER: true
    });

    var _cache_data = {};
    var _clean_interval_time = _.M.CACHE_MIN;
    var _clean_interval;

    /**
     * Check if a cache name is exists
     * @param {string} name
     * @returns {boolean}
     * @private
     */
    function _has_cache(name) {
        if (_.has(_cache_data, name)) {
            //-1 to ensure this cache is valid when get right after check
            if (_cache_data[name].expire_time === true || (_cache_data[name].expire_time - 1) > _.M.nowSecond()) {
                return true;
            }
            _expire_cache(name);
        }
        return false;
    }

    /**
     * Set cache value
     * @param {string} name
     * @param {*} value
     * @param {number} [live_time] Seconds
     * @private
     */
    function _set_cache(name, value, live_time) {
        if (_.isUndefined(live_time) || !_.M.isNumeric(Number(live_time))) {
            live_time = _.M.CACHE_MEDIUM;
        }
        _cache_data[name] = {
            value: value,
            live_time: live_time,
            expire_time: live_time === true ? true : _.M.nowSecond() + live_time
        }
    }

    /**
     * Delete expire caches
     * @private
     */
    function _expire_cache() {
        _.each(_.flatten(arguments), function (name) {
            delete _cache_data[name];
        });
    }

    /**
     * Add/Remove item when cached item is array
     * @param {string} name
     * @param {*} value
     * @param {boolean} [addMode = true] Add mode
     * @returns {*} Return new value of cache
     * @private
     */
    function _cache_collection_change(name, value, addMode) {
        var live_time = _.M.CACHE_MEDIUM;
        var new_value = [];

        if (_.isUndefined(addMode)) {
            addMode = true;
        }

        if (_has_cache(name)) {
            var old_detail = _cache_data[name];

            live_time = old_detail.live_time;
            new_value = old_detail.value;

            if (!_.isArray(new_value)) {
                new_value = [new_value];
            }
            if (addMode) {
                new_value.push(value);
            } else {
                var last_index = _.lastIndexOf(new_value, value);

                if (last_index != -1) {
                    new_value.splice(last_index, 1);
                }
            }
        } else {
            if(addMode){
                new_value.push(value);
            }else{
                return undefined;
            }

        }
        _set_cache(name, new_value, live_time);
        return _cache_data[name].value;
    }

    /**
     * Add/Subtract value of cached item when it is number
     * @param {string} name
     * @param {number} [value = 1]
     * @param {boolean} [addMode = true] TRUE - add mode, FALSE - subtract mode
     * @returns {number}
     * @private
     */
    function _cache_number_change(name, value, addMode) {
        if (_.isUndefined(value) || !_.M.isNumeric(Number(value))) {
            value = 1;
        }
        if (_.isUndefined(addMode)) {
            addMode = true;
        }
        if (addMode) {
            value = Math.abs(value);
        }else{
            value = -1 * Math.abs(value);
        }

        if (!_has_cache(name)) {
            _set_cache(name, value);
        } else {
            _cache_data[name].value =  Number(_cache_data[name].value);

            if (!_.M.isNumeric(_cache_data[name].value)) {
                _cache_data[name].value = 0;
            }

            _cache_data[name].value += value;
        }

        return _cache_data[name].value;
    }

    /**
     * Clean expired caches
     * @private
     */
    function _clean_cache() {
        var removes = [];
        var now_second = _.M.nowSecond();
        _.each(_cache_data, function (data, name) {
            if (data.expire_time !== true && data.expire_time <= now_second) {
                removes.push(name);
            }
        });
        _expire_cache(removes);
    }

    //Clean cache every 10 seconds
    _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);

    /**
     * @lends _.M.CACHE
     * @type {{}}
     */
    _.M.CACHE = _.M.defineObject({

        set: function (name, value, live_time) {
            _set_cache(name, value, live_time);
        },
        /**
         * Check if a cached name is exists
         * @param {string} name
         * @returns {boolean}
         */
        has: function (name) {
            return _has_cache(name);
        },

        /**
         * Get cached value
         * @param {string} name
         * @param {*} default_value
         * @returns {*}
         */
        get: function (name, default_value) {
            if (_.has(_cache_data, name)) {
                if (_cache_data[name].expire_time === true || _cache_data[name].expire_time > _.M.nowSecond()) {
                    return _cache_data[name].value;
                }
                delete _cache_data[name];
            }

            return default_value;
        },

        /**
         * Add live time
         * @param {string} name
         * @param {number} [live_time] Default is cached live time
         * @return {boolean|number} False - cache is not exists. True - cache is forever. Number - next expire time
         */
        touch: function (name, live_time) {
            if (this.has(name)) {
                if (_cache_data[name].expire_time !== true) {
                    var cache = _cache_data[name];

                    if (!_.M.isNumeric(live_time)) {
                        live_time = cache.live_time;
                    }

                    cache.expire_time = Math.max(cache.expire_time, _.M.nowSecond() + live_time);

                    return cache.expire_time;
                }

                return true;
            }

            return false;
        },

        /**
         * Get valid caches
         * @param {boolean} [name_only = true] Only return cache name
         * @returns {*}
         */
        list: function (name_only) {

            /**
             * @type {({}|Array)}
             */
            var result;
            var now_second = _.M.nowSecond();

            /**
             * @type {function}
             */
            var addItem;
            if (name_only || _.isUndefined(name_only)) {
                result = [];
                addItem = function (key) {
                    result.push(key);
                };
            } else {
                result = {};
                addItem = function (key, data) {
                    result[key] = data;
                }
            }

            _.each(_cache_data, function (data, key) {
                if (data.expire_time === true || now_second < data.expire_time) {
                    addItem(key, data);
                }
            });

            return result;
        },

        /**
         * Clean expired caches
         */
        clean: function () {
            return _clean_cache();
        },

        /**
         * Manual delete expired caches
         */
        expire: function () {
            _expire_cache(Array.prototype.slice.apply(arguments));
        },

        /**
         * Increment value of a cache, if cache is not exists then create with value and live time as default
         * (CACHE_MEDIUM), if exists then increment it and set live time as old. If old value isn't a valid numeric
         * then set it to 0
         *
         * @param {string} name
         * @param {number} [value = 1] Increment value
         * @returns {number}
         */
        increment: function (name, value) {
            if (!_.M.isNumeric(value)) {
                value = 1;
            }
            return _cache_number_change(name, value, true);
        },

        /**
         * Decrement value of a cache, if cache is not exists then create with value and live time as default
         * (CACHE_MEDIUM), if exists then decrement it and set live time as old. If old value isn't a valid numeric
         * then set it to 0
         *
         * @param {string} name
         * @param {number} [value = 1] Decrement value
         * @returns {number}
         */
        decrement: function (name, value) {
            if (!_.M.isNumeric(value)) {
                value = 1;
            }
            return _cache_number_change(name, value, false);
        },

        /**
         * Add item to array
         * @param {string} name
         * @param {*} value
         * @returns {*}
         */
        arrayPush: function (name, value) {
            return _cache_collection_change(name, value, true);
        },

        /**
         * Remove item from array
         * @param {string} name
         * @param {*} value
         * @returns {*}
         */
        arrayWithout: function (name, value) {
            return _cache_collection_change(name, value, false);
        }
    });

})(_);
;(function (_) {
    var tasks = {};

    /**
     *
     * @param {string|function|function[]|{}} [handler]
     * @constructor
     */
    function Task(handler) {
        this.type_prefix = 'task';
        _.M.BaseClass.call(this);
        /**
         * Task name
         * @type {string}
         */
        this.name = '';
        /**
         * Task options
         * @type {{}}
         */
        this.options = {};

        /**
         * Task process handler
         * @type {string|Function|Function[]|{}|null}
         */
        this.handler = handler || null;

        /**
         *
         * @type {*}
         * @private
         */
        this._result = null;

        /**
         *
         * @type {null|{code: number, message: string}}
         * @private
         */
        this._error = null;
    }

    /**
     *
     * @param {string|{}} name Option name or object of options
     * @param {*} [value]
     * @returns {Task}
     */
    Task.prototype.option = function (name, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    /**
     * Check if process is error
     * @returns {boolean}
     */
    Task.prototype.isError = function () {
        return this._error;
    };

    /**
     * @return {void|{}} void when process is ok. Object with error code and message
     */
    Task.prototype.getError = function () {
        if (this.isError()) {
            return _.pick(_.extend({
                code: 0,
                message: ''
            }, _.isObject(this._error) ? this._error : {}), 'code', 'message');
        }
    };

    /**
     *
     * @returns {*}
     */
    Task.prototype.getResult = function () {
        return this._result;
    };

    /**
     *
     * @param {*} result
     */
    Task.prototype.setProcessResult = function (result) {
        this._result = result;
        this._error = null;
    };

    /**
     *
     * @param {string} message
     * @param {string|number} [code=0]
     */
    Task.prototype.setProcessError = function (message, code) {
        this._result = null;
        this._error = {
            message: message,
            code: code || 0
        }
    };

    /**
     *
     * @param {*} data
     * @returns {boolean}
     */
    Task.prototype.process = function (data) {
        var self = this;

        this._result = _.clone(data);
        this._error = null;

        if (_.isString(this.handler)) {
            this.handler = _.M.beArray(this.handler);
        }
        if (_.isFunction(this.handler)) {
            this.handler.bind(this)(data, this.setProcessResult.bind(this), this.setProcessError.bind(this));
        } else if (this.handler instanceof Task) {
            this.handler.process(self._result);

            self._result = this.handler.getResult();
            self._error = this.handler.getError();
        } else if (_.isArray(this.handler)) {
            _.M.loop(this.handler, function (handle) {
                var tmp_task_instance;

                if (_.isString(handle)) {
                    tmp_task_instance = Task.factory(handle);
                } else {
                    tmp_task_instance = new Task(handle);
                }

                tmp_task_instance.process(self._result);
                self._result = tmp_task_instance.getResult();
                self._error = tmp_task_instance.getError();

                if (self.isError()) {
                    return 'break';
                }
            });
        } else if (_.isObject(this.handler)) {
            _.M.loop(this.handler, function (options, handle) {
                var tmp_task_instance = Task.factory(handle);

                if (!_.isEmpty(options)) {
                    tmp_task_instance.options(options);
                }

                tmp_task_instance.process(self._result);
                self._result = tmp_task_instance.getResult();
                self._error = tmp_task_instance.getError();

                if (self.isError()) {
                    return 'break';
                }
            });
        }

        return !this.isError();
    };

    /**
     * Check if task is exists
     * @param {string} name
     * @returns {boolean}
     */
    Task.has = function (name) {
        return tasks.hasOwnProperty(name);
    };

    /**
     * Return task list
     * @returns {Array}
     */
    Task.list = function () {
        return Object.keys(tasks);
    };

    /**
     * Register task
     * @param {string} name
     * @param {string|function|object|function[]} handler
     * @param {{}} [options] Task options
     */
    Task.register = function (name, handler, options) {
        var info = _.M.optionalArgs(Array.prototype.slice.call(arguments, 0), ['name', 'handler', 'options'], {
            name: 'string', handler: [
                'string', 'function', 'array', 'Task'
            ], options: 'object'
        });

        if (info.handler instanceof Task) {
            info.name = info.handler.name;
        }

        tasks[info.name] = {
            handler: info.handler,
            options: info.options
        }
    };

    /**
     * Create task instance from name
     * @param {string} name Task name
     * @param {{}} [options] Task instance options
     * @returns {Task}
     */
    Task.factory = function (name, options) {
        if (Task.has(name)) {
            var task_info = tasks[name],
                task = new Task();

            task.name = name;
            task.handler = task_info['handler'];
            task.options = task_info['options'];

            if (_.isObject(options)) {
                task.option(options);
            }
            return task;
        }

        throw new Error('Create unregistered task: ' + name);
    };

    Task.apply = function (data, tasks) {
        var result = {
            data: _.clone(data)
        };

        if(tasks){
            if(_.isString(tasks)){
                tasks = [tasks];
            }
            if (_.isArray(tasks)) {
                tasks = _.object(tasks, _.M.repeat({}, tasks.length, true));
            }

            _.M.loop(tasks, function (options, name) {
                var task = Task.factory(name, options);

                if (task.process(_.clone(result['data']))) {
                    result['data'] = task.getResult();
                } else {
                    delete result['data'];
                    result['error'] = task.getError();
                    return 'break';
                }
            });
        }

        return result;
    };

    _.M.Task = Task;
}).call(window, _);
/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {
    function App() {
        _.M.EventEmitter.call(this);

        this.private('init');
    }

    _.M.inherit(App, _.M.EventEmitter);

    /**
     * Option this app
     * @param {string|{}} option
     * @param {*} value
     * @param {string} [separator='.']
     */
    App.prototype.option = function (option, value, separator) {
        var options = {}, invalid_options;

        if (_.isObject(option)) {
            options = option;
            invalid_options = _.pick(options, function (value, key) {
                return (key + '')[0] === '_' || _.isFunction(value);
            });

            if (!_.isEmpty(invalid_options)) {
                console.warn('Invalid _.App options: ' + Object.keys(invalid_options).join(', '));
            }
            _.extend(this, _.omit(option, Object.keys(invalid_options)));
        } else {
            option += '';
            var deep = option.split(separator || '.');

            if (deep[0][0] === '_') {
                console.warn('Invalid _.App options: ' + deep[0][0]);
                return this;
            }

            _.M.defineDeep(this, deep, value);
        }

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {boolean} [time=1]
     * @param {number} [priority=_.M.PRIORITY_DEFAULT]
     */
    App.prototype.onInit = function (callback, time, priority) {
        this.addListener('init', callback, {
            times: time || 1,
            priority: priority || _.M.PRIORITY_DEFAULT
        });

        return this;
    };

    /**
     * Init App
     * @param {boolean} [reset=false]
     */
    App.prototype.init = function (reset) {
        this.emitEvent('init');

        reset && this.resetEvents('init');
    };

    App.prototype.resetInitCallbacks = function () {
        this.resetEvents('init');
    };

    _.module('App', new App);
})(_);
/**
 * @module _.M.AJAX
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {

    _.M.defineConstant({
        AJAX_PRE_OPTIONS_NAME: '_.M.AJAX',
        /**
         * @constant {string}
         * @default
         */
        AJAX_ABORTED: 'aborted',
        /**
         * @constant {string}
         * @default
         */
        AJAX_TIMEOUT: 'timeout',
        /**
         * @constant {string}
         * @default
         */
        AJAX_PARSER_ERROR: 'parser_error',
        /**
         * @constant {number}
         * @default
         */
        AJAX_SERVER_ERROR: 500,
        /**
         * @constant {number}
         * @default
         */
        AJAX_FORBIDDEN: 403,
        /**
         * @constant {number}
         * @default
         */
        AJAX_NOT_FOUND: 404
    });

    var jqXHR_response_statuses = {
        204: 'Server has received the request but there is no information to send back',
        400: 'The request had bad syntax or was inherently impossible to be satisfied',
        401: 'The parameter to this message gives a specification of authorization schemes which are acceptable',
        403: 'The request is for something forbidden',
        404: 'The server has not found anything matching the URI given',
        405: 'Method not allowed',
        406: 'Not acceptable',
        408: 'Request timeout',
        413: 'Payload too large',
        414: 'URI too long',
        429: 'Too many requests',
        431: 'Request header fields too large',
        500: 'The server encountered an unexpected condition which prevented it from fulfilling the request',
        501: 'The server does not support the facility required',
        parser_error: 'Parse response failed',
        aborted: 'Manual abort request'
    };

    /**
     * Option values
     * - response_tasks: Response adapter object with key is adapter name, value is adapter option object
     * - data_tasks: Data adapter object with key is adapter name, value is adapter option object
     * - auto_abort: abort prev request if not completed
     * - retry: retry times when error
     * - is_continue: check if continue to retry request. Boolean or function which bind to AJAX instance, return
     * boolean value
     */
    _.M.PreOptions.define(_.M.AJAX_PRE_OPTIONS_NAME, {
        response_tasks: {},
        data_tasks: {},
        auto_abort: true,
        retry: 0,
        retry_delay: 0,
        is_continue: true
    });

    /**
     *
     * @param {object} [options]
     * @class _.M.AJAX
     * @extends _.M.EventEmitter
     */
    function AJAX(options) {
        _.M.EventEmitter.call(this);

        this.options = _.M.PreOptions.get(_.M.AJAX_PRE_OPTIONS_NAME);

        /**
         * jQuery XHR object
         * @type {null}
         * @property
         */
        this.jqXHR = null;

        /**
         * requested times
         * @type {number}
         * @property
         */
        this.requested = 0;

        /**
         * @property
         * @type {number}
         */
        this.retry_time = 0;

        /**
         * @property
         * @type {null|object}
         * @private
         */
        this._last_options = null;

        /**
         * @property
         * @type {boolean}
         * @private
         */
        this._is_retrying = false;

        /**
         * @property
         * @type {null}
         * @private
         */
        this._retry_timeout_id = null;

        /**
         * @property
         * @type {*}
         */
        this.response = null;

        /**
         * @property
         * @type {{code: number|string, message: string}}
         */
        this.error = null;
        this._is_response_meaning_failed = false;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    _.M.inherit(AJAX, _.M.EventEmitter);

    /**
     *
     * @param {{}} options
     */
    AJAX.globalOption = function (options) {
        _.M.PreOptions.update(_.M.AJAX_PRE_OPTIONS_NAME, options);
    };

    /**
     * Get error detail
     * @param {Array} error_arguments jQuery error callback arguments as array
     * @returns {{code: string|number, message: string}}
     */
    AJAX.beautifyError = function (error_arguments) {
        var jqXHR = error_arguments[0],
            textStatus = error_arguments[1],
            errorThrown = error_arguments[2],
            err_result = {
                code: '',
                message: 'Ajax error'
            };

        switch (textStatus) {
            case 'parsererror':
                err_result.code = _.M.AJAX_PARSER_ERROR;
                break;

            case 'abort':
                err_result.code = _.M.AJAX_ABORTED;
                break;

            default:
                err_result.code = jqXHR.status;
        }

        if (jqXHR_response_statuses.hasOwnProperty(err_result.code)) {
            err_result.message = jqXHR_response_statuses[err_result.code];
        } else {
            err_result.message = errorThrown;
        }

        return err_result;
    };

    AJAX.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    AJAX.prototype.data = function (data) {
        this.options.data = data;

        return this;
    };
    AJAX.prototype.addData = function (name, value) {
        var data;

        if (!this.options.data) {
            this.options.data = {};
        }

        if (_.isObject(arguments[0])) {
            data = _.extend({}, name);
        } else {
            data = {};
            if (arguments.length < 2) {
                data[name + ''] = 'true';
            } else {
                data[name] = value;
            }
        }

        if (_.isObject(this.options.data)) {
            _.extend(this.options.data, data);
        } else if (_.isString(this.options.data)) {
            data = _.map(data, function (value, key) {
                return key + '=' + value;
            });

            if (this.options.data.length) {
                this.options.data += '&' + data;
            } else {
                this.options.data = data;
            }
        }

        return this;
    };

    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.done = function (callback) {
        this.on('done', callback);

        if (this.isSuccess()) {
            callback.apply(this, [_.clone(this.response)]);
        }


        return this;
    };

    /**
     * Add catch callback. Callback arguments:
     * - message: Error message
     * - code: error code
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.fail = function (callback) {
        this.on('fail', callback);

        if (this.isFailed()) {
            callback.apply(this, [this.error.message, this.error.code]);
        }

        return this;
    };

    /**
     * Add finally callback
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.always = function (callback) {
        this.on('always', callback);

        if (this.isDone()) {
            callback.apply(this, [this.error, this.response]);
        }

        return this;
    };

    /**
     * Get status of ajax
     * @returns {(boolean|number)}
     */
    AJAX.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.hasOwnProperty('readyState')) {
            return this.jqXHR.readyState;
        }

        return false;
    };
    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    AJAX.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAX.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };

    AJAX.prototype.isRetrying = function () {
        return Boolean(this._is_retrying);
    };

    /**
     * Check if request is done and not retrying
     * @returns {boolean}
     */
    AJAX.prototype.isDone = function () {
        return !this.isRetrying() && this.status() === 4;
    };

    AJAX.prototype.isFailed = function () {
        return this.isDone() && !_.isEmpty(this.error);
    };

    AJAX.prototype.isResponseMeaningFailed = function () {
        return this.isFailed() && this._is_response_meaning_failed;
    };

    AJAX.prototype.isSuccess = function () {
        return this.isDone() && _.isEmpty(this.error);
    };

    /**
     * Check if current request is aborted
     * @returns {boolean}
     */
    AJAX.prototype.isAborted = function () {
        return this.error && (this.error.code === _.M.AJAX_ABORTED);
    };

    AJAX.prototype.isLastRetryTime = function () {
        return this.isRetrying() && this.options.retry && this.retry_time >= parseInt(this.options.retry);
    };

    AJAX.prototype.isRetryable = function () {
        if (!_.isEmpty(this.error) && !this.isAborted() && !this.isResponseMeaningFailed() && this.options.retry && this.retry_time < parseInt(this.options.retry)) {
            var is_continue;

            if (_.isFunction(this.options.is_continue)) {
                is_continue = this.options.is_continue.bind(this)(_.clone(this.error));
            } else {
                is_continue = Boolean(this.options.is_continue);
            }

            return is_continue;
        }

        return false;
    };

    function _ajax_done_cb(response) {
        var result = _.M.Task.apply(response, this.options.response_tasks);

        if (result.error) {
            this._is_response_meaning_failed = true;
            this.error = result.error;

            if (!this.isRetryable()) {
                this.emitEvent('fail', [result.error.message, result.error.code]);
            }

            return;
        }

        this.response = result.data;

        this.emitEvent('done', [_.clone(result.data)]);
    }

    function _ajax_fail_cb(jqXHR, textStatus, errorThrown) {
        var err_result = AJAX.beautifyError(arguments);

        this.error = err_result;

        if (!this.isRetryable() && !this.isAborted()) {
            this.emitEvent('fail', [err_result.message, err_result.code]);
        }
    }

    function _at_the_end(ajax_instance) {
        ajax_instance._last_options = null;
        ajax_instance._is_retrying = false;
        ajax_instance.emitEvent('always', [ajax_instance.error, ajax_instance.response]);

        if (_.App) {
            _.App.emitEvent('ajax_complete', [ajax_instance]);
        }
    }

    function _ajax_always_cb(jqXHR, textStatus) {
        var self = this;

        if (this.isAborted()) {
            this.emitEvent('aborted');
        } else if (this.isRetryable()) {
            if (this.isRetrying()) {
                this.emitEvent('retry_complete', [this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);

                if (_.App) {
                    _.App.emitEvent('ajax_retry_complete', [this, this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);
                }
            }

            this._is_retrying = true;
            if (!this.options.retry_delay) {
                this.request();
            } else {
                this._retry_timeout_id = _.M.async(function () {
                    self.request();
                }, [], this.options.retry_delay);
            }

            return;
        }

        _at_the_end(this);
    }

    /**
     * Get request option, ready for request
     * @param instance
     * @param {{}} options
     * @return {{}|boolean}
     */
    function _getRequestOptions(instance, options) {
        var last_options = _.extend({}, instance.options, _.isObject(options) ? options : {}),
            before_send_cb;

        if (last_options.hasOwnProperty('success') || last_options.hasOwnProperty('done')) {
            instance.removeListener('success_listeners_from_options');
            instance.addListener('done', _.values(_.pick(last_options, ['success', 'done'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'success_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('error') || last_options.hasOwnProperty('fail')) {
            instance.removeListener('error_listeners_from_options');
            instance.addListener('fail', _.values(_.pick(last_options, ['error', 'fail'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'error_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('complete') || last_options.hasOwnProperty('always')) {
            instance.removeListener('complete_listeners_from_options');
            instance.addListener('always', _.values(_.pick(last_options, ['complete', 'always'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'complete_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('beforeSend')) {
            before_send_cb = last_options.beforeSend;
        }

        _.M.removeKeys(last_options, ['success', 'done', 'error', 'fail', 'complete', 'always', 'beforeSend']);

        last_options['done'] = _ajax_done_cb.bind(instance);
        last_options['fail'] = _ajax_fail_cb.bind(instance);
        last_options['always'] = _ajax_always_cb.bind(instance);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (instance.option('auto_abort') && instance.isRequesting()) {
                instance.abort();
            }
            if (_.isFunction(before_send_cb) && !instance.isRetrying()) {
                result = _.M.callFunc(before_send_cb, [jqXHR, settings], instance);
            }
            if (!_.isObject(last_options.data)) {
                last_options.data = {};
            }

            if (false !== result) {
                instance.requested++;
                instance.error = null;
                instance._is_response_meaning_failed = false;
                instance.response = null;
                instance.responses = null;

                if (instance.isRetrying()) {
                    instance.retry_time++;
                    instance.emitEvent('retry');
                } else {
                    instance.retry_time = 0;
                    instance.emitEvent('request');
                }
            }

            return result;
        };

        if (!_.isEmpty(last_options.data_tasks)) {
            var request_data_result = _.M.Task.apply(_.clone(last_options.data), last_options.data_tasks);

            if (request_data_result.data) {
                last_options.data = request_data_result.data;
            } else {
                this.error = request_data_result.error;
                return false;
            }
        }

        _.M.removeKeys(last_options, ['response_tasks', 'data_tasks', 'auto_abort', 'retry', 'retry_delay', 'is_continue']);

        return last_options;
    }

    /**
     * Do Request
     * @param instance
     * @param options
     * @returns {AJAX|*}
     * @private
     */
    function _do_request(instance, options) {
        var last_options;

        if ((arguments.length == 1 || instance.isRetrying()) && _.isObject(instance._last_options)) {
            last_options = instance._last_options;
        } else {
            last_options = _getRequestOptions(instance, options);
            if (false !== last_options) {
                instance._last_options = last_options;
            } else {
                instance.emitEvent('fail', [instance.error.message, instance.error.code]);
                _at_the_end(instance);
            }
        }

        if (last_options) {
            instance.jqXHR = $.ajax(_.omit(last_options, ['done', 'fail', 'always']))
                .done(last_options['done'])
                .fail(last_options['fail'])
                .always(last_options['always']);
        }

        return instance;
    }

    AJAX.prototype.request = function (options) {
        return _do_request(this, options);
    };

    /**
     * Abort current request
     */
    AJAX.prototype.abort = function () {
        if (this.isRequesting() && this.jqXHR.abort) {
            this.jqXHR.abort();
        } else if (this.isRetrying()) {
            clearTimeout(this._retry_timeout_id);
            this.emitEvent('aborted');
            _at_the_end(this);
        }
    };

    function _ajax_restful_shorthand_func(instance, method, url, data, callback, dataType) {
        var args,
            options = {
                url: url,
                method: (method + '').toUpperCase()
            };

        args = _.M.optionalArgs(Array.prototype.slice.call(arguments, 3), ['data', 'callback', 'dataType'], {
            data: ['string', 'object'],
            callback: 'function',
            dataType: 'string'
        });

        if (args.data) {
            options.data = args.data;
        }
        if (args.callback) {
            options.done = args.callback;
        }
        if (args.dataType) {
            options.dataType = args.dataType;
        }

        return _do_request(instance, options);
    }

    ['get', 'post', 'put', 'delete'].forEach(function (method) {
        AJAX.prototype[method] = function (url, data, callback, dataType) {
            return _ajax_restful_shorthand_func.apply(null, [this, method.toUpperCase()].concat(Array.prototype.slice.call(arguments, 0)));
        };
    });
    ['get', 'post'].forEach(function (method) {
        AJAX.prototype[method + 'JSON'] = function (url, data, callback) {
            var args = _.M.optionalArgs(Array.prototype.slice.call(arguments, 0, 3), ['url', 'data', 'callback'], {
                    url: 'string',
                    data: ['string', 'object'],
                    callback: 'function'
                }),
                options = {
                    dataType: 'json'
                };

            if (args.url) {
                options.url = args.url;
            }
            if (args.data) {
                options.data = args.data;
            }
            if (args.callback) {
                options.done = args.callback;
            }

            return this.request(options);
        };
    });

    ['get', 'post', 'put', 'delete', 'getJSON', 'postJSON'].forEach(function (method) {
        AJAX[method] = function (url, data, callback, dataType) {
            var instance = new AJAX();

            instance[method].apply(instance, Array.prototype.slice.call(arguments, 0));
            return instance;
        }
    });

    /**
     *
     * @param {string|object} [data]
     */
    AJAX.prototype.query = function (data) {
        var options = {
            method: 'GET'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };

    /**
     *
     * @param {string|object} [data]
     */
    AJAX.prototype.send = function (data) {
        var options = {
            method: 'POST'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };


    /*
     |--------------------------------------------------------------------------
     | AJAX Helpers
     |--------------------------------------------------------------------------
     */

    /**
     * Create AJAX instance with Pre Options
     * @param {string} pre_options_name
     * @param {{}} [custom_options={}]
     * @returns {_.M.AJAX}
     */
    AJAX.use = function (pre_options_name, custom_options) {
        return new AJAX(_.M.PreOptions.get(pre_options_name, custom_options));
    };


    function _load_apply_content(response, target, apply_type) {
        target = $(target);
        switch (apply_type) {
            case 'append':
                target.append(response);
                break;
            case 'prepend':
                target.prepend(response);
                break;

            default:
                target.html(response);
        }
    }

    /**
     * Load content to element
     * @param {string} url
     * @param {string|*} target Selector string or jQuery DOM
     * @param {{}} options Options:
     * - error_content: null - default error content: "Load content failed: <error message>. Error code: <error code>".
     * It may be string or function with arguments as: error message, error code
     * - apply_type: Way to apply response to target: replace, append or prepend. Default is replace
     */
    AJAX.load = function (url, target, options) {
        var instance = new AJAX();

        if (!_.isObject(options)) {
            options = {};
        }

        options = _.extend({
            error_content: '',
            apply_type: 'replace'
        }, options, {
            url: url
        });

        instance.option(options);
        instance.done(function (response) {
            _load_apply_content(response, target, options.apply_type);
        }).fail(function (error_message, error_code) {
            var response = '';

            if (options.error_content) {
                if (_.isFunction(options.error_content)) {
                    response = options.error_content(instance, error_message, error_code);
                } else {
                    response = options.error_content + '';
                }
            }

            _load_apply_content(response, target, options.apply_type);
        });

        instance.request();

        return instance;
    };

    /**
     *
     * @type {_.M.AJAX}
     */
    _.M.AJAX = AJAX;
})(_);