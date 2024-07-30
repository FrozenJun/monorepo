<script setup lang="ts">
import { useCmap } from './useCmap'
import CesiumMap from 'common-shared/modules/cesium/components/cesium-map/index.vue'
import ForceGraph3D from '3d-force-graph'
import * as Cesium from 'cesium'
import { onMounted } from 'vue'

const { mapOption, onMapReady, mapInstance } = useCmap({})
const graph = ForceGraph3D()

const data = {
  nodes: Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })),
  links: [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 6, target: 7 },
    { source: 7, target: 8 },
    { source: 8, target: 9 },
    { source: 9, target: 10 },
    { source: 10, target: 11 },
    { source: 11, target: 12 },
    { source: 12, target: 13 },
    { source: 13, target: 14 },
    { source: 14, target: 15 },
    { source: 15, target: 16 },
    { source: 16, target: 17 },
    { source: 17, target: 18 },
    { source: 18, target: 19 },
    { source: 19, target: 20 },
    { source: 20, target: 21 },
    { source: 21, target: 22 },
    { source: 22, target: 23 },
    { source: 23, target: 24 },
    { source: 24, target: 25 },
  ],
}

onMounted(() => {
  graph(document.getElementById('graph')!)
    .graphData(data)
    .onEngineStop(() => {
      console.log('graph.graphData().nodes', graph.graphData().nodes)
      // 模拟生成的节点位置，转化为经纬度
      const nodePositions = graph.graphData().nodes.map((node) => ({
        id: node.id,
        x: 120.1551 + (node.x || 0) * 0.001, // 杭州的经度，加随机偏移
        y: 30.2741 + (node.y || 0) * 0.001, // 杭州的纬度，加随机偏移
        z: 100 + (node.z || 0) * 10, // 随机高度在1000到1500之间
      }))
      console.log(nodePositions)

      // 在Cesium中添加节点
      nodePositions.forEach((position) => {
        mapInstance.value.cesiumObject.value.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z),
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
          },
        })
      })

      data.links.forEach((link) => {
        const source = nodePositions.find((node) => node.id === link.source)
        const target = nodePositions.find((node) => node.id === link.target)
        if (source && target) {
          mapInstance.value.cesiumObject.value.viewer.entities.add({
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                source.x,
                source.y,
                source.z,
                target.x,
                target.y,
                target.z,
              ]),
              width: 1,
              material: Cesium.Color.BLUE,
            },
          })
        }
      })
    })
})
</script>

<template>
  <div class="home">
    <div id="graph"></div>
    <CesiumMap class="home__map" :mapOption="mapOption" @mapReady="onMapReady"></CesiumMap>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(home) {
  width: 100%;
  height: 100%;

  #graph {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
  }

  @include e(map) {
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}
</style>
