<template>
  <div>
    <h4>Game <span v-show="isFailed">FAILED</span></h4>
    <div class="field">
      <Cell v-for="cell in field" :cell="cell" @open="onOpen" @flag="onFlag" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: grid;
  grid-template-columns: repeat(v-bind(cols), v-bind(size));
  grid-template-rows: repeat(v-bind(rows), v-bind(size));
  grid-gap: 1px;
}
</style>

<script setup type="ts">
import { Game } from '@/game'

const bombs = ref(20)
const cols = ref('10')
const rows = ref('10')
const size = ref('30px')
const game = Game.getInstance()
const field = game.getField()
game.init(+cols.value, +rows.value, bombs.value)
const isFailed = game.getFailedStatus()

const onOpen = (cell, options) => {
  if (isFailed.value) return
  game.openCell(cell.coords, options)
}
const onFlag = (cell) => {
  if (isFailed.value) return
  game.flagCell(cell.coords)
}
</script>
