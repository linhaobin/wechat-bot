// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Instance from '../../../app/model/instance';
import Project from '../../../app/model/project';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    Instance: ReturnType<typeof Instance>;
    Project: ReturnType<typeof Project>;
    User: ReturnType<typeof User>;
  }
}
