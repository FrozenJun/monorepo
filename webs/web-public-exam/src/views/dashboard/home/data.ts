export const data = [
  {
    id: 1,
    name: '<p style="font-style: italic ">Node 1</p>',
    value: 10,
    color: '#00dd00',
    includes: [2, 3],
  },
  {
    id: 2,
    name: '<p style="font-style: italic ">Node 2</p>',
    value: 20,
    color: '#00dd00',
    includes: [4, 5],
  },
  {
    id: 3,
    name: '<p style="font-style: italic ">Node 3</p>',
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
