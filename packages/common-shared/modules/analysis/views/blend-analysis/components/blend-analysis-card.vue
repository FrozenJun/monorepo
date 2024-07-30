<script setup lang="ts">
import { PropType, ref } from 'vue'
import { HOLOGRAM_DATA_TYPE_ENUM } from '@/api/modules/enum'
import fallback from '../../../assets/images/empty/fallback.png'
import { useDict } from '@/app/utils/useDict'
const { options: vehicleType } = useDict('arch_vehicle_type')
const { options: plateTypeOptions } = useDict('arch_vehicle_plate_type_code')
defineProps({
  cardItem: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="blend-analysis-card">
    <div class="blend-analysis-card__card-content">
      <a-image
        shape="square"
        class="blend-analysis-card__avatar"
        :src="cardItem.avatarUrl || fallback"
        :preview="!!cardItem.avatarUrl"
        :fallback="fallback"
        @click.stop="1"
      ></a-image>
      <div
        v-if="cardItem.subjectType === HOLOGRAM_DATA_TYPE_ENUM.人"
        class="blend-analysis-card__info"
      >
        <div v-if="cardItem.name" class="blend-analysis-card__title">
          {{ cardItem.name }}
        </div>
        <div v-if="cardItem.idcard" class="blend-analysis-card__idcard">
          {{ cardItem.idcard }}
        </div>
        <div class="blend-analysis-card__footerInfo gl-ellipsis-two">
          <a-tooltip>
            <template #title>
              {{ cardItem.address }}
            </template>
            {{ cardItem.address }}
          </a-tooltip>
        </div>
      </div>
      <div
        v-if="cardItem.subjectType === HOLOGRAM_DATA_TYPE_ENUM.车辆"
        class="blend-analysis-card__info"
      >
        <div v-if="cardItem.vehicle" class="blend-analysis-card__title">
          {{ cardItem.vehicle }}
        </div>
        <div class="blend-analysis-card__footerInfo">
          <div v-if="cardItem.type">
            {{ vehicleType.find((type) => type.value === cardItem.type)?.label || '' }}
          </div>
          <div v-if="cardItem.plateType">
            {{ plateTypeOptions.find((type) => type.value === cardItem.plateType)?.label || '' }}
          </div>
          <div v-if="cardItem.brand">{{ cardItem.brand }}</div>
          <div v-if="cardItem.color">{{ cardItem.color }}</div>
        </div>
      </div>
      <div
        v-if="cardItem.subjectType === HOLOGRAM_DATA_TYPE_ENUM.码"
        class="blend-analysis-card__info"
      >
        <div v-if="cardItem.imsi" class="blend-analysis-card__title">
          {{ cardItem.imsi }}
        </div>
        <div v-if="cardItem.phone" class="blend-analysis-card__title">
          {{ cardItem.phone }}
        </div>
        <div v-if="cardItem.mac" class="blend-analysis-card__title">
          {{ cardItem.mac }}
        </div>
      </div>
      <div class="blend-analysis-card__percentage">{{ cardItem.percentage }}</div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(blend-analysis-card) {
  @include e(card-content) {
    width: 288px;
    height: 103px;
    margin: 16px;
    position: relative;
  }

  @include e(avatar) {
    width: 72px;
    height: 103px;
    border-radius: 2px;
  }

  @include e(info) {
    width: 216px;
    height: 103px;
    float: right;
    padding-left: 8px;
    position: relative;
  }

  @include e(title) {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }

  @include e(idcard) {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
  }

  @include e(footerInfo) {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 18px;
    position: absolute;
    bottom: 0;
    max-height: 72px;
  }

  @include e(percentage) {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
    font-weight: 550;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
