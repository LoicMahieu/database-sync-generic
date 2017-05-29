
import createInput from './lib/input'
import createUpdater from './lib/updater'
import createCleaner from './lib/cleaner'

const defaultMapper = record => record

export default function sync ({
  input,
  mapper = defaultMapper,
  updater,
  cleaner
}) {
  return new Promise((resolve, reject) => {
    const stats = {
      start: new Date(),
      end: null,
      time: null,
      found: 0,
      used: 0
    }
    let error = null

    const handleError = err => {
      error = err
      input.stop()
      reject(err)
    }

    updater = createUpdater(updater)
    cleaner = createCleaner(cleaner)
    input = createInput(input, record => {
      stats.found++
      record = mapper(record)
      if (record) {
        stats.used++
        updater.push(record).catch(handleError)
        cleaner.push(record)
      }
    })

    input.start()
      .then(() => !error && Promise.all([
        updater.drain(),
        cleaner.clean()
      ]))
      .then(() => {
        Object.assign(
          stats,
          input.stats,
          updater.stats,
          cleaner.stats
        )
        stats.end = new Date()
        stats.time = stats.end - stats.start

        return stats
      })
      .then(resolve)
      .catch(reject)
  })
}
