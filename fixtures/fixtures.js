const Fixtures = require('node-mongodb-fixtures')

const uri = 'mongodb://localhost:27017/cafedb'

const fixtures = new Fixtures({
  dir: 'fixtures/mockData',
  mute: false,
  filter: 'users.*'
})

fixtures
  .connect(uri, { useUnifiedTopology: true })
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch((error) => console.log(error))
  .finally(() => fixtures.disconnect)
