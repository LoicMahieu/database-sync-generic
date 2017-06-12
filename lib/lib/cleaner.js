'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createCleaner = function createCleaner(cleaner) {
  if (typeof cleaner === 'function') {
    cleaner = {
      clean: cleaner
    };
  }

  if (!cleaner.mapper) {
    cleaner.mapper = function (record) {
      return record;
    };
  }

  var records = [];
  var stats = {
    cleaned: 0
  };

  var push = function push(record) {
    return records.push(cleaner.mapper(record));
  };
  var clean = async function clean() {
    var cleanedRecords = await cleaner.clean(records);

    if (Array.isArray(cleanedRecords)) {
      stats.cleanedRecords = cleanedRecords;
      stats.cleaned = cleanedRecords.length;
    } else {
      stats.cleaned = cleanedRecords || 0;
    }
  };

  return {
    clean: clean,
    push: push,
    stats: stats
  };
};

exports.default = createCleaner;