"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createInput = function createInput(inputFn, onRecord) {
  var isStopped = false;
  var stats = {
    inputTrips: 0
  };

  var start = async function start() {
    var previous = void 0;

    /* eslint-disable no-unmodified-loop-condition */
    while (!isStopped && (!previous || previous.hasNext)) {
      previous = await inputFn(previous && previous.context);
      stats.inputTrips++;

      if (isStopped) {
        return;
      }

      if (previous && previous.data) {
        previous.data.forEach(function (record) {
          onRecord(record);
        });
      }
    }
  };

  var stop = function stop() {
    isStopped = true;
  };

  return {
    start: start,
    stop: stop,
    stats: stats
  };
};

exports.default = createInput;