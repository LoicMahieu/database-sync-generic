
export default function sequelizeUpdater (Model, {
  identifier = 'id',
  recordIdentifier = 'id'
} = {}) {
  return async record => {
    const model = await Model.findOne({
      where: {
        [identifier]: record[recordIdentifier]
      }
    })

    if (model) {
      model.set(record)
      const changed = model.changed()
      await model.save()
      return changed ? 1 : 2
    } else {
      await Model.create(record)
      return 0
    }
  }
}
