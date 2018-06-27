// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Sign from '../../../app/service/sign';
import User from '../../../app/service/user';
import Wechat from '../../../app/service/wechat';

declare module 'egg' {
  interface IService {
    sign: Sign;
    user: User;
    wechat: Wechat;
  }
}
