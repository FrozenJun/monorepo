<script setup lang="ts">
import ForceGraph3D from '3d-force-graph'
import { onMounted, ref } from 'vue'
import { data, dataPipe } from './data'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

const graphRef = ref()
const graph = ForceGraph3D({
  controlType: 'orbit',
  extraRenderers: [new CSS2DRenderer()],
})

onMounted(() => {
  graph(graphRef.value!)
    .enableNodeDrag(false)
    .onNodeHover((node) => {
      console.log(node)
      return (graphRef.value.style.cursor = node ? 'pointer' : null)
    })
    .nodeVal('links')
    .nodeRelSize(2)
    .nodeThreeObject((node: any) => {
      const nodeEl = document.createElement('div')
      nodeEl.innerHTML = node.name
      nodeEl.style.color = node.color
      nodeEl.className = 'node-label'
      return new CSS2DObject(nodeEl)
    })
    .nodeThreeObjectExtend(true)
    .graphData(dataPipe(data))
})
</script>

<template>
  <div class="home">
    <div class="home__graph" ref="graphRef"></div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(home) {
  width: 100%;
  height: 100%;

  @include e(graph) {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }
}
</style>
