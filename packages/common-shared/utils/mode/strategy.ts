/**
 * 策略模式示例
 *
 */
enum EType {
  A = 'A',
  B = 'B',
}
const getStrategy = (type: EType) => {
  const strategys = {
    [EType.A]: () => {},
    [EType.B]: () => {},
  }

  return strategys[type]
}

export default undefined
