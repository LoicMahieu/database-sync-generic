'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sync;

var _input = require('./lib/input');

var _input2 = _interopRequireDefault(_input);

var _updater = require('./lib/updater');

var _updater2 = _interopRequireDefault(_updater);

var _cleaner = require('./lib/cleaner');

var _cleaner2 = _interopRequireDefault(_cleaner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultMapper = function defaultMapper(record) {
  return record;
};

function sync(_ref) {
  var input = _ref.input,
      _ref$mapper = _ref.mapper,
      mapper = _ref$mapper === undefined ? defaultMapper : _ref$mapper,
      updater = _ref.updater,
      cleaner = _ref.cleaner;

  return new Promise(function (resolve, reject) {
    var stats = {
      start: new Date(),
      end: null,
      time: null,
      found: 0,
      used: 0
    };
    var error = null;

    var handleError = function handleError(err) {
      error = err;
      input.stop();
      reject(err);
    };

    updater = (0, _updater2.default)(updater);
    cleaner = (0, _cleaner2.default)(cleaner);
    input = (0, _input2.default)(input, function (record) {
      stats.found++;
      record = mapper(record);
      if (record) {
        stats.used++;
        updater.push(record).catch(handleError);
        cleaner.push(record);
      }
    });

    input.start().then(function () {
      return !error && Promise.all([updater.drain(), cleaner.clean()]);
    }).then(function () {
      Object.assign(stats, input.stats, updater.stats, cleaner.stats);
      stats.end = new Date();
      stats.time = stats.end - stats.start;

      return stats;
    }).then(resolve).catch(reject);
  });
}