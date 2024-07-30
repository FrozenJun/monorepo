import _ from 'lodash'
import { ObserverCls } from './observer'

type Command<T> = { key: T; execute: Function }

/**
 * 命令模式类
 *
 * 推荐使用enum定义T
 *
 * TODO 添加测试
 * TODO 完善队列与实际使用功能
 */
export class CommandCls<T extends string = string> {
  /**
   * 命令执行者列表
   */
  private commandList: Command<T>[] = []

  /**
   * 待执行命令列表
   */
  private executeList: Command<T>[] = []

  /**
   * 是否正在执行命令
   */
  private isExecuting = false

  /**
   * 执行命令历史记录
   */
  private executesLog: Command<T>[][] = []
  getExecutesLog() {
    return this.executesLog
  }

  /**
   * 观察者，用于完成一个执行后通知下一个命令开始执行
   */
  private observer = new ObserverCls()

  /**
   * 新增命令
   */
  add(key: T, command: Function) {
    this.commandList.push({ key, execute: command })
  }

  /**
   * 执行命令,并保存执行记录
   */
  execute(key: T | T[], ...args: any[]) {
    this.executesLog.push(this.executeOnly(key, ...args))
  }

  /**
   * 回放
   */
  replay(clearLogAfterReplay?: boolean) {
    this.executesLog.forEach((executes) => executes.forEach(({ execute }) => execute()))
    if (clearLogAfterReplay) this.executesLog.length = 0
  }

  /**
   * 执行命令
   */
  private executeOnly(key: T | T[], ...args: any[]) {
    const keys = _.isString(key) ? [key] : key
    const matchs = keys
      .map((key) => this.commandList.find((command) => command.key === key))
      .filter(Boolean) as Command<T>[]
    matchs.forEach(({ execute }) => execute(...args))
    return matchs
  }
  /**
   * 执行单一命令
   */
  private async executeSingle(execute: Function, ...args: any[]) {
    this.isExecuting = true
    await execute(...args)
    this.isExecuting = false
    if (this.executeList.length) {
      this.observer.trigger('executed', ...args)
    }
  }
}
