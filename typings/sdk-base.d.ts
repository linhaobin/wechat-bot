declare module 'sdk-base' {
  export = Base

  class Base extends NodeJS.EventEmitter {
    constructor(options: Base.Options)
    /**
     * detect sdk start ready or not
     * @return {Boolean} ready statuzs
     */
    isReady: boolean
    /**
     * set ready state or onready callback
     *
     * @param {Boolean|Error|Function} flagOrFunction - ready state or callback function
     * @return {void|Promise} ready promise
     */
    ready(flagOrFunction?: boolean | Error | Function): void | Promise<void>
  }
  declare namespace Base {
    export interface Options {
      name?: string
      initMethod: string
    }
  }
}
