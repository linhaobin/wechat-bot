// import * as Base from 'sdk-base'

declare module 'cluster-client' {
  export = Cluster
  function Cluster(client: T, options?: Cluster.ClientWrapperOptions): Cluster.ClientWrapper<T, O>

  // interface Cluster {
  //   (client: T, options?: Cluster.ClientWrapperOptions): Cluster.ClientWrapper<T>
  // }
  declare namespace Cluster {
    export interface ClusterClient<T, Options> {
      constructor(options: Options): T
    }

    interface ClientWrapperOptions {
      [string]: any
    }
    class ClientWrapper<T, O> {
      constructor(clientClass: T, options: ClientWrapperOptions)

      override(name, value): ClientWrapper

      delegate(from, to): ClientWrapper

      create(options: O): T
    }

    // export abstract class APIClientBase extends Base {
    //   _client: ClusterClient
    //   abstract get DataClient(): any
    //   get isClusterClientLeader(): any
    //   get clusterOptions(): any
    //   get delegates(): any
    //   // tslint:disable-next-line
    //   constructor(options)

    //   close(): any
    // }
  }
}
