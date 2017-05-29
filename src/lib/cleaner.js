
const createCleaner = (cleaner) => {
  if (typeof cleaner === 'function') {
    cleaner = {
      clean: cleaner
    }
  }

  if (!cleaner.mapper) {
    cleaner.mapper = record => record
  }

  const records = []
  const stats = {
    cleaned: 0
  }

  const push = record => records.push(cleaner.mapper(record))
  const clean = async () => {
    const cleanedRecords = await cleaner.clean(records)

    if (Array.isArray(cleanedRecords)) {
      stats.cleanedRecords = cleanedRecords
      stats.cleaned = cleanedRecords.length
    } else {
      stats.cleaned = cleanedRecords || 0
    }
  }

  return {
    clean,
    push,
    stats
  }
}

export default createCleaner
