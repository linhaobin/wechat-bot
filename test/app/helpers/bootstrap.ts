import mock from 'egg-mock'

const options: any = {}
if (process.env.EGG_BASE_DIR) options.baseDir = process.env.EGG_BASE_DIR
const app = mock.app(options)

before(() => app.ready())
afterEach(mock.restore)

export { app }
