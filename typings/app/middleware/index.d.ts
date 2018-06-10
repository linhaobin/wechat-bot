// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import ErrorHandler from '../../../app/middleware/error_handler';
import JoiHandler from '../../../app/middleware/joi_handler';
import NobodyHandler from '../../../app/middleware/nobody_handler';
import NotfoundHandler from '../../../app/middleware/notfound_handler';
import SignatureHandler from '../../../app/middleware/signature_handler';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ErrorHandler;
    joiHandler: typeof JoiHandler;
    nobodyHandler: typeof NobodyHandler;
    notfoundHandler: typeof NotfoundHandler;
    signatureHandler: typeof SignatureHandler;
  }
}
