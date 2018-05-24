// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import ErrorHandler from '../../../app/middleware/error_handler';
import JoiHandler from '../../../app/middleware/joi_handler';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: ReturnType<typeof ErrorHandler>;
    joiHandler: ReturnType<typeof JoiHandler>;
  }
}
