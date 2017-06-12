'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _es6Deferred = require('es6-deferred');

var _es6Deferred2 = _interopRequireDefault(_es6Deferred);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUpdater = function createUpdater(updaterFn) {
  var promises = [];
  var stats = {
    error: 0,
    changed: 0,
    notChanged: 0,
    updated: 0,
    created: 0
  };

  var push = function push(record) {
    var deferred = new _es6Deferred2.default();

    // Add in queue
    promises.push(deferred.promise);

    var update = async function update() {
      // Call update method
      var updated = void 0;

      try {
        updated = await updaterFn(record);
      } catch (err) {
        stats.error++;
        err.record = record;

        throw err;
      }

      // Stats
      if (updated) stats.updated++;else stats.created++;
      if (updated === 1) stats.changed++;
      if (updated === 2) stats.notChanged++;
    };

    update().then(function () {
      return deferred.resolve();
    }).catch(function (err) {
      return deferred.reject(err);
    });

    return deferred.promise;
  };

  // Wait until all updates are done
  var drain = async function drain() {
    await Promise.all(promises);
  };

  return {
    push: push,
    drain: drain,
    stats: stats
  };
};

exports.default = createUpdater;