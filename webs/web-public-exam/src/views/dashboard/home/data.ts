interface Note {
  id: string
  name: string
  content: string
  origin: string[] // 因，来源列表
  result: string[] // 果，结果列表
  children?: string[] // 子节点
  parents?: string[] // 父节点
  tags: string[] // 标签
}

export const notes: Note[] = [
  {
    id: '1',
    name: 'DHCP',
    content: 'xxx',
    origin: ['ip', 'ip分配限制'],
    result: ['自动ip分配'],
    tags: [],
    children: ['1'],
    parents: [],
  },
  {
    id: '2',
    name: 'ip',
    content: 'xxx',
    origin: ['互联网'],
    result: ['网络协议'],
    children: ['1'],
    parents: [],
    tags: [],
  },
]

export const data = [
  {
    id: 1,
    name: '如何打造笔记系统',
    content: `
    1. 目的：提示解决问题的能力`,
    tags: ['笔记'],
    value: 10,
    color: '#00dd00',
    includes: [2, 3],
  },
  {
    id: 2,
    name: '什么是问题',
    content: `
    1.问题是果，答案是因，最底层是这个世界的运行规则，最外层的是人性的选择
    2.人们在已有的信息中寻找答案，而不是创造答案，造新车新房，参与行业提供已有的差异化的解决方案
    3.难以获取的信息，难以具象化的抽象，具有价值
    4.如果无法获取时效性，封闭性的信息，只能通过将抽象具象化换取价值
    5.人性是因，产生了需求
    6.人感觉良好是当前的需求被满足，或者未来的预期变好，或者不好的情况减轻与消失
    7.满足情绪需求需要人性，满足物质需求需要世界规则
    8.现实的结构与关系引出了`,
    tags: ['问题'],
    value: 20,
    color: '#00dd00',
    includes: [4, 5],
  },
  {
    id: 3,
    name: '笔记内容',
    content: `
    1. 到底是什么需要笔记，除了确定的可查阅的不便的信息
    2. 如DHCP,我知道这个协议的属性、意义、特征，就可以判断出一些因为DHCP引起的问题，以此视为一种作用，那么我需要记录的是什么？它的因与果`,
    value: 30,
    color: '#00dd00',
    includes: [6, 7],
  },
  {
    id: 4,
    name: '<p style="font-style: italic ">Node 4</p>',
    value: 40,
    color: '#00dd00',
    includes: [8, 9],
  },
  {
    id: 5,
    name: '<p style="font-style: italic ">Node 5</p>',
    value: 50,
    color: '#00dd00',
    includes: [10, 11],
  },
  {
    id: 6,
    name: '<p style="font-style: italic ">Node 6</p>',
    value: 60,
    color: '#dd0000',
    includes: [12, 13],
  },
  { id: 7, name: 'Node 7', value: 70, color: '#dd0000', includes: [14, 15] },
  { id: 8, name: 'Node 8', value: 80, color: '#dd0000', includes: [16, 17] },
  { id: 9, name: 'Node 9', value: 90, color: '#dd0000', includes: [18, 19] },
  { id: 10, name: 'Node 10', value: 100, color: '#dd0000', includes: [1, 2] },
  { id: 11, name: 'Node 11', value: 110, color: '#dd0000', includes: [3, 4] },
  { id: 12, name: 'Node 12', value: 120, color: '#dd0000', includes: [5, 6] },
  { id: 13, name: 'Node 13', value: 130, color: '#00dd00', includes: [7, 8] },
  { id: 14, name: 'Node 14', value: 140, color: '#0000dd', includes: [9, 10] },
  { id: 15, name: 'Node 15', value: 150, color: '#0000dd', includes: [11, 12] },
  { id: 16, name: 'Node 16', value: 160, color: '#0000dd', includes: [13, 14] },
  { id: 17, name: 'Node 17', value: 170, color: '#0000dd', includes: [15, 16] },
  { id: 18, name: 'Node 18', value: 180, color: '#0000dd', includes: [17, 18] },
  { id: 19, name: 'Node 19', value: 190, color: '#0000dd', includes: [1, 2, 3, 4, 5, 6, 7] },
]

export function dataPipe(data: any[]): { nodes: any[]; links: any[] } {
  const nodes = data
  const links = data.flatMap((d) => d.includes.map((i: number) => ({ source: d.id, target: i })))
  return { nodes, links }
}
