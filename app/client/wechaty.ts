// import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'
import { Contact, Message, Wechaty } from 'wechaty'
import { PuppetPadchat } from 'wechaty-puppet-padchat'

export type DongEvent = EventBase<'dong', string | undefined>
export type StartEvent = EventBase<'start', void>
export type StopEvent = EventBase<'stop', void>
export type ScanEvent = EventBase<'scan', { qrcode: string; status: number }>
export type LoginEvent = EventBase<
  'login',
  {
    id: string
    weixin: string | null
    name: string
  }
>
export type LogoutEvent = EventBase<
  'logout',
  {
    id: string
  }
>
export type MessageEvent = EventBase<'message', any>
export type FriendshipEvent = EventBase<'friendship', any>
export type RoomJoinEvent = EventBase<'room-join', any>
export type RoomLeaveEvent = EventBase<'room-leave', any>
export type RoomTopicEvent = EventBase<'room-topic', any>

export type HeartbeatEvent = EventBase<'heartbeat', object>
export type ErrorEvent = EventBase<'error', Error>

type EventBase<T extends string, D> = { type: T } & (D extends void ? {} : { data: D })
interface EventCommon {
  id: string
  userId: string
}
type OnEvent =
  | DongEvent
  | StartEvent
  | StopEvent
  | ScanEvent
  | LoginEvent
  | LogoutEvent
  | MessageEvent
  | FriendshipEvent
  | RoomJoinEvent
  | RoomLeaveEvent
  | RoomTopicEvent
  | HeartbeatEvent
  | ErrorEvent

export type Event = EventCommon & OnEvent
type OptionOn = (data: Event) => void

export interface Options {
  profilePath: string
  id: string
  userId: string
  on: OptionOn
}

export default class WechatyClient {
  id: string
  profilePath: string
  userId: string
  options: Options
  wechaty: Wechaty

  constructor(options: Options) {
    this.profilePath = options.profilePath
    this.id = options.id || uuid()
    this.userId = options.userId
    this.options = options

    this.init()
  }

  /**
   * 登录
   */
  public login() {
    return new Promise<{ qrcode: string; status: number }>(async (resolve, reject) => {
      try {
        // 扫描事件
        this.wechaty.once('scan', async (qrcode: string, status: number) => {
          console.info(`scan: ${qrcode} `)
          resolve({ qrcode, status })
        })

        // fix: WARN PuppetPuppeteer initWatchdogForPuppet() dog.on(reset) last food:inited, timeout:120000
        this.wechaty.on('login', () => {
          const watchdog = () => {
            this.wechaty.puppet.emit('watchdog', { data: 'any', timeout: 2 * 60 * 1000 })

            setTimeout(watchdog, 60 * 1000)
          }
          watchdog()
        })

        await this.wechaty.start().catch(reject)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * start
   *
   */
  public async start() {
    // const profile = this.getProfile(this.id)
    // if (!fs.existsSync(`${profile}.memory-card.json`)) {
    //   throw new Error('wechaty profile not exists')
    // }

    return this.wechaty.start()
  }

  public async stop() {
    return this.wechaty.stop()
  }

  /**
   * 初始化
   */
  private init() {
    const puppet = new PuppetPadchat({
      token: 'WECHATY_PUPPET_PADCHAT_TOKEN'
    })
    this.wechaty = new Wechaty({ profile: this.getProfile(this.id), puppet })

    this.initListener()

    // TODO 1分钟后检查是否已登录，未登录则删除该wechaty

    // TODO: 0.14 not support multiple
    // if (!globalWechaty) {
    //   globalWechaty = this.wechaty = Wechaty.instance({ profile: this.getProfile(this.id) })
    //   this.wechaty.stop()
    //   this.wechaty.reset()
    // }
    // this.wechaty = globalWechaty
  }

  /**
   * 初始化监听器
   */
  private async initListener() {
    // tslint:disable:max-line-length
    // public on(event: 'dong'       , listener: string | ((this: Wechaty, data?: string) => void))
    // public on(event: 'error'      , listener: string | ((this: Wechaty, error: Error) => void))
    // public on(event: 'friendship' , listener: string | ((this: Wechaty, friendship: Friendship) => void))
    // public on(event: 'heartbeat'  , listener: string | ((this: Wechaty, data: any) => void))
    // public on(event: 'logout'     , listener: string | ((this: Wechaty, user: ContactSelf) => void))
    // public on(event: 'login'      , listener: string | ((this: Wechaty, user: ContactSelf) => void))
    // public on(event: 'message'    , listener: string | ((this: Wechaty, message: Message) => void))
    // public on(event: 'room-join'  , listener: string | ((this: Wechaty, room: Room, inviteeList: Contact[],  inviter: Contact) => void))
    // public on(event: 'room-leave' , listener: string | ((this: Wechaty, room: Room, leaverList: Contact[], remover?: Contact) => void))
    // public on(event: 'room-topic' , listener: string | ((this: Wechaty, room: Room, newTopic: string, oldTopic: string, changer: Contact) => void))
    // public on(event: 'scan'       , listener: string | ((this: Wechaty, qrcode: string, status: number, data?: string) => void))
    // public on(event: 'start'      , listener: string | ((this: Wechaty) => void))
    // public on(event: 'stop'       , listener: string | ((this: Wechaty) => void))

    const { wechaty } = this

    // dong
    wechaty.on('dong', data => {
      this.on({ type: 'dong', data })
    })
    // error
    wechaty.on('error', error => {
      this.on({ type: 'error', data: error })
    })
    // heartbeat
    wechaty.on('heartbeat', data => {
      this.on({ type: 'heartbeat', data })
    })
    // friendship
    wechaty.on('friendship', friendship => {
      this.on({ type: 'friendship', data: friendship.toString() })
    })
    // logout
    wechaty.on('logout', wechatUser => {
      this.handleLogout(wechatUser)
    })
    // login
    wechaty.on('login', wechatUser => {
      this.handleLogin(wechatUser)
    })
    // message
    wechaty.on('message', async message => {
      this.handleMessage(message)
    })
    // room-join
    wechaty.on('room-join', (room, inviteeList, inviter) => {
      this.on({
        type: 'room-join',
        data: {
          room: room.toString(),
          inviteeList: inviteeList.map(item => item.toString()),
          inviter: inviter.toString()
        }
      })
    })
    // room-leave
    wechaty.on('room-leave', (room, leaverList, remover) => {
      this.on({
        type: 'room-leave',
        data: {
          room: room.toString(),
          inviteeList: leaverList.map(item => item.toString()),
          inviter: remover && remover.toString()
        }
      })
    })
    // room-topic
    wechaty.on('room-topic', (room, newTopic, oldTopic) => {
      this.on({
        type: 'room-leave',
        data: {
          room: room.toString(),
          newTopic,
          oldTopic
        }
      })
    })
    // scan
    wechaty.on('scan', (qrcode, status) => {
      this.on({ type: 'scan', data: { qrcode, status } })
    })
    // start
    wechaty.on('start', () => {
      this.on({ type: 'start' })
    })
    // stop
    wechaty.on('stop', () => {
      this.on({ type: 'stop' })
    })
  }

  /**
   * handle login
   *
   */
  private handleLogin(wechatUser: Contact): any {
    console.info('login', wechatUser.toString())
    this.on({
      type: 'login',
      data: {
        id: wechatUser.id,
        weixin: wechatUser.weixin(),
        name: wechatUser.name()
      }
    })
  }
  /**
   * handle logout
   *
   */
  private handleLogout(wechatUser: Contact): any {
    console.info('logout', wechatUser.toString())
    this.on({
      type: 'logout',
      data: {
        id: wechatUser.id
      }
    })
  }
  /**
   * handle message
   *
   * @param message
   */
  private handleMessage(message: Message): any {
    console.info('message', message.toString())
    this.on({
      type: 'message',
      data: message.toString()
    })
  }

  private on(event: OnEvent) {
    this.options.on({
      id: this.id,
      userId: this.userId,
      ...event
    })
  }

  // 获取 profile 路径
  private getProfile(name: string) {
    const profilePath = this.options.profilePath

    return path.resolve(profilePath, name)
  }
}
