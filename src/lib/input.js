
const createInput = (inputFn, onRecord) => {
  let isStopped = false
  const stats = {
    inputTrips: 0
  }

  const start = async () => {
    let previous

    /* eslint-disable no-unmodified-loop-condition */
    while (!isStopped && (!previous || previous.hasNext)) {
      previous = await inputFn(previous && previous.context)
      stats.inputTrips++

      if (isStopped) {
        return
      }

      if (previous && previous.data) {
        previous.data.forEach(record => {
          onRecord(record)
        })
      }
    }
  }

  const stop = () => {
    isStopped = true
  }

  return {
    start,
    stop,
    stats
  }
}

export default createInput
