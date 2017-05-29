
import sync from '../src/sync'
import fetch from 'isomorphic-fetch'
import Sequelize from 'sequelize'
import omnipartners from 'omnipartners'

import sequelizeUpdater from './lib/sequelizeUpdater'
import sequelizeCleaner from './lib/sequelizeCleaner'

const omni = omnipartners({
  partners: {
    key: 'xxx',
    secret: 'xxx'
  }
})

const sequelize = new Sequelize('database-sync-generic', 'root', '', {
  logging: false
})

const Post = sequelize.define('post', {
  title: Sequelize.STRING,
  body: Sequelize.STRING
})

const Comment = sequelize.define('comment', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  body: Sequelize.STRING
})

const Breeder = sequelize.define('breeder', {
  id: { type: Sequelize.STRING(50), primaryKey: true},
  name: Sequelize.STRING
})

sequelize.sync()

const jsonplaceholderInput = (route) => async ({ page = 1 } = {}) => {
  const res = await fetch(`http://jsonplaceholder.typicode.com${route}?_page=${page}&_limit=30`)
  return {
    data: await res.json(),
    context: {
      page: page + 1
    },
    hasNext: !!res.headers.get('link')
  }
}

Promise.all([
  // sync({
  //   input: jsonplaceholderInput('/posts'),
  //   updater: sequelizeUpdater(Post),
  //   cleaner: sequelizeCleaner(Post)
  // }),
  // sync({
  //   input: jsonplaceholderInput('/comments'),
  //   updater: sequelizeUpdater(Comment),
  //   cleaner: sequelizeCleaner(Comment)
  // }),
  sync({
    input: async ({ page = 1 } = {}) => {
      const { data, total_pages: totalPages } = await omni.partners.listPartners({
        // partner_type: 'shops',
        // search_term: 'Tom',
        page
      })

      return {
        data,
        context: {
          page: page + 1
        },
        hasNext: page <= totalPages
      }
    },
    mapper: record => ({
      id: record.partner_ext_id,
      name: record.partner_name
    }),
    updater: sequelizeUpdater(Breeder),
    cleaner: sequelizeCleaner(Breeder)
  })
])
  .then(stats => {
    console.log('success', stats)
    process.exit(0)
  })
  .catch(err => {
    console.log('Got errorr :(')
    console.log(err)
    console.log(err.record)
    process.exit(1)
    // throw err
  })
