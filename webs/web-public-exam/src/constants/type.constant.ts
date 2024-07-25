import { EQuestionTheme, EQuestionType } from './type.enum'

export const THEME_TYPES = {
  [EQuestionTheme.片段阅读]: [EQuestionType.中心理解题],
}

const question = {
  source: '', //出处
  accessories: {
    options: ['生搬硬套 无视', '标新立异 罔顾', '好大喜功 弱化', '贪大求全 漠视'],
    type: 101,
  },

  content:
    '<p>有的地方搞森林城市创建不计成本，选树种不考虑当地环境气候，一味<u>            </u>，大搞南方草原风光、中部沿海风情的反气候移植。这种贪图表面光鲜、<u>        </u>生态效益、忽视经济效益和社会效益的做法，无疑背离了森林城市创建的初心。</p><p>依次填入画横线部分最恰当的一项是：</p>',
  correctAnswer: null,
  createdTime: 1671434176738,
  difficulty: 5,
  hasVideo: 0,
  id: 5430473,
  material: null,
  materialIndexes: null,
  shortSource: null,
  type: 1,
}
