import { Agent } from 'egg'
import init from './app/agent/init'

export default (agent: Agent) => {
  init(agent)
}

// const init = require('./app/agetn/init')

// module.exports = (agent) => {
//   init(agent)
// }
