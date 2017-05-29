
export default function sequelizeCleaner (Model, {
  identifier = 'id',
  recordIdentifier = 'id'
} = {}) {
  return {
    mapper: record => record[recordIdentifier],
    clean: async ids => {
      if (!ids.length) {
        return 0
      }

      const removeIds = (await Model.findAll({
        attributes: [identifier],
        where: {
          [identifier]: { $notIn: ids }
        }
      })).map(v => v[identifier])

      if (removeIds.length) {
        await Model.destroy({
          where: {
            [identifier]: { $in: removeIds }
          }
        })
      }

      return removeIds
    }
  }
}
