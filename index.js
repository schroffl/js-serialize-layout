// The export pattern is a UMD template:
// https://github.com/umdjs/umd/blob/1deb860078252f31ced62fa8e7694f8bbfa6d889/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.SerializeLayout = factory();
  }
}(this, function () {
  var exportTo = {};

  function getDataKey(key, info) {
    if (typeof info === 'string')
      return info;
    else if (info && info.key)
      return info.key;
    else
      return key;
  }

  exportTo.deserialize = function(ctor, layout, data, input) {
    var obj = new ctor();

    for (var key in layout) {
      var info = layout[key],
          dataKey = getDataKey(key, info);

      if (!data.hasOwnProperty(dataKey))
        continue;

      var value = data[dataKey];

      if (info && typeof info.from === 'function')
        obj[key] = info.from(value, input);
      else
        obj[key] = value;
    }

    return obj;
  };

  exportTo.serialize = function(layout, obj, input) {
    var data = {};

    for (var key in layout) {
      var info = layout[key];

      if (info && info.exclude)
        continue;

      var dataKey = getDataKey(key, info),
          value = obj[key];

      if (info && info.to)
        data[dataKey] = info.to(value, input);
      else
        data[dataKey] = value;
    }

    return data;
  };

  exportTo.wrap = function(ctor, layout) {
    return {
      deserialize: exportTo.deserialize.bind(null, ctor, layout),
      serialize: exportTo.serialize.bind(null, layout)
    };
  };

  exportTo.makeSerializable = function(ctor, layout) {
    var wrapper = exportTo.wrap(ctor, layout);

    ctor.deserialize = wrapper.deserialize;
    ctor.serialize = wrapper.serialize;
  };

  function __default_typescript_static_method() {
    var cls = this;
    var msg = '\n\n\t';

    msg += 'It seems like you forgot to call SerializeLayout.makeSerializable ';
    msg += 'on your \'' + cls.name + '\' class.\n\t';
    msg += 'Or maybe you didn\'t include the code where the function is called.\n\t';
    msg += 'If you are running minfied code and the class name is mangled, make\n\t';
    msg += 'use of your browsers debugger to find out which class is meant.\n';

    throw new Error(msg);
  }

  exportTo.Serializable = function() {};
  exportTo.Serializable.deserialize = __default_typescript_static_method;
  exportTo.Serializable.serialize = __default_typescript_static_method;

  return exportTo;
}));
