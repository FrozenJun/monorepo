export default [
  {
    name: 'Home',
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ './home/index.vue'),
  },
]
