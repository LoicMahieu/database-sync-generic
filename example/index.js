
sync({
  // reporterId: record => record.id,

  input: async ({ context }) => {
    if (!context) {
      context = {
        page: 1
      }
    }

    return {
      data: [{}, {}],
      context: {
        page: context.page + 1
      },
      hasNext: false
    }
  },

  mapper: (record) => {
    return undefined
    return record
  },

  updater: async (record) => {
    return true // updated
    return false // created
  },

  cleaner: {
    mapper: (record) => record.id, // optional
    clean: async (recordsMapped) => {}
  },
  // OR
  cleaner: async (records) => {
    return [{}, {}] // records that have been cleaned
  }
})



sync({
  input: createMetadataInput({
    languages: ['fr', 'nl']
  }),

  input: createPartnersInput({
    options: {
      groups: ['azeaze']
    },
    count: 100
  }),

  mapper: flow(
    normalizePartner,
    filterPartnerType('breeders'),
    filterPartnerGroup('foo_group')
  ),

  updater: createSequelizeUpdater({
    Model: Breed
  })
})
