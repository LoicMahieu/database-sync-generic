
import Deferred from 'es6-deferred'

const createUpdater = (updaterFn) => {
  const promises = []
  const stats = {
    error: 0,
    changed: 0,
    notChanged: 0,
    updated: 0,
    created: 0
  }

  const push = record => {
    const deferred = new Deferred()

    // Add in queue
    promises.push(deferred.promise)

    const update = async () => {
      // Call update method
      let updated

      try {
        updated = await updaterFn(record)
      } catch (err) {
        stats.error++
        err.record = record

        throw err
      }

      // Stats
      if (updated) stats.updated++
      else stats.created++
      if (updated === 1) stats.changed++
      if (updated === 2) stats.notChanged++
    }

    update()
      .then(() => deferred.resolve())
      .catch(err => deferred.reject(err))

    return deferred.promise
  }

  // Wait until all updates are done
  const drain = async () => {
    await Promise.all(promises)
  }

  return {
    push,
    drain,
    stats
  }
}

export default createUpdater
