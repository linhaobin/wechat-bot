// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Sign from '../../../app/controller/sign';
import Test from '../../../app/controller/test';
import Wechat from '../../../app/controller/wechat';

declare module 'egg' {
  interface IController {
    sign: Sign;
    test: Test;
    wechat: Wechat;
  }
}
