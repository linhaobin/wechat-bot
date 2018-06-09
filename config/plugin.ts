import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  cors: {
    enable: true,
    package: 'egg-cors'
  },

  security: false,

  mongoose: {
    enable: true,
    package: 'egg-mongoose-hb'
  },

  redis: {
    enable: true,
    package: 'egg-redis'
  }
}

export default plugin
