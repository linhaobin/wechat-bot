import { Application } from 'egg'
import init from './app/init'

export default (app: Application) => {
  init(app)
}
