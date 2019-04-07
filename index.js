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
    else if (!info)
      return key;
    else if (info.key)
      return info.key;
  }

  exportTo.deserialize = function(ctor, layout, data) {
    var obj = new ctor();

    for (var key in layout) {
      var info = layout[key],
          dataKey = getDataKey(key, info);

      if (!data.hasOwnProperty(dataKey))
        continue;

      var value = data[dataKey];

      if (info && typeof info.from === 'function')
        obj[key] = info.from(value);
      else
        obj[key] = value;
    }

    return obj;
  };

  exportTo.serialize = function(layout, obj) {
    var data = {};

    for (var key in layout) {
      var info = layout[key];

      if (info && info.exclude)
        continue;

      var dataKey = getDataKey(key, info),
          value = obj[key];

      if (info && info.to)
        data[dataKey] = info.to(value);
      else
        data[dataKey] = value;
    }

    return data;
  };

  exportTo.wrap = function(ctor, layout) {
    return {
      deserialize: exportTo.deserialize.bind(null, ctor, layout),
      serialize: exportTo.deserialize.bind(null, layout)
    };
  };

  exportTo.makeSerializable = function(ctor, layout) {
    var wrapper = exportTo.wrap(ctor, layout);

    ctor.deserialize = wrapper.deserialize;
    ctor.serialize = wrapper.serialize;
  };

  return exportTo;
}));