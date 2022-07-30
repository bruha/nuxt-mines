<template>
  <span
    class="cell"
    :class="{
      'cell--opened': cell.isOpened,
    }"
    @click.left="onClickLeft(cell)"
    @click.right.prevent="onClickRight(cell)"
  >
    {{
      cell.isOpened
        ? cell.hasBomb
          ? '💣'
          : cell.bombsNear
        : cell.hasFlag
        ? '🏴'
        : ''
    }}
  </span>
</template>

<style lang="scss">
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  background: #ddd;
  text-align: center;
  cursor: default;

  &:not(&--opened):hover {
    background: #d0d0d0;
  }
}
</style>

<script setup lang="ts">
import { Cell } from '@/game'

defineProps({
  cell: Object as PropType<Cell>,
})

const emit = defineEmits(['open', 'flag'])

const onClickLeft = (cell: Cell) => {
  if (!cell.isOpened) {
    emit('open', cell)
  }
}
const onClickRight = (cell: Cell) => {
  if (cell.isOpened) {
    emit('open', cell, { isForced: true })
  } else {
    emit('flag', cell)
  }
}
</script>
