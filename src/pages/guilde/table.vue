<script lang="ts" setup>
import CmTable from '@/components/common/CmTable.vue'

const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: 'PLAYER', value: 'player' },
  { text: 'TEAM', value: 'team' },
  { text: 'ORG', value: 'org' },
  { text: 'NUMBER', value: 'number' },
  { text: 'POSITION', value: 'position' },
  { text: 'HEIGHT', value: 'height' },
  { text: 'WEIGHT (lbs)', value: 'weight', sortable: true },
  { text: 'LAST ATTENDED', value: 'lastAttended', width: 200 },
  { text: 'COUNTRY', value: 'country' },
  { text: '', value: 'action', width: 150 },
])

function actionItemView() {
  // console.log('view')
}

function actionItemEdit() {
  // console.log('edit')
}

const items = reactive ([
  {
    customId: 0,
    isSelected: false,
    player: 'Stephen Curry',
    team: 'GSW',
    number: 30,
    position: 'G',
    indicator: { height: '6-2', weight: 185 },
    lastAttended: 'DavcustomIdson',
    country: 'USA',
    action: [
      {
        title: 'Xem chi tiết',
        icon: 'eye',
        action: {
          type: 'view',
          event: actionItemView,
        },
      },
      {
        title: 'Tải file',
        icon: 'download',
        action: {
          type: 'download',
        },
      },
      {
        title: 'Chỉnh sửa',
        icon: 'edit',
        action: {
          type: 'edit',
          event: actionItemEdit,
        },
      },
    ],
  },
  { customId: 1, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 2, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 3, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 4, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 5, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 6, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 7, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 8, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 9, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 10, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 11, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 12, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 13, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 14, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 15, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 16, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 17, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 18, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
  { customId: 19, isSelected: false, player: 'Lebron James', team: 'LAL', number: 6, position: 'F', indicator: { height: '6-9', weight: 250 }, lastAttended: 'St. Vincent-St. Mary HS (OH)', country: 'USA' },
  { customId: 20, isSelected: false, player: 'Kevin Durant', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  { customId: 21, isSelected: false, player: 'Giannis Antetokounmpo', team: 'MIL', number: 34, position: 'F', indicator: { height: '6-11', weight: 242 }, lastAttended: 'Filathlitikos', country: 'Greece' },
])

function handleClickRow(e: any) {
  // console.log(e)
}

function selectedRows(e: any) {
  // console.log(e)
}

function splitRow() {
  // console.log(headers)
  headers.splice(1, 1)
}
</script>

<template>
  <div>
    <CmTable
      :group-options="groupOptions"
      :headers="headers"
      :items="items"
      custom-id="customId"
      is-expand
      @handleClickRow="handleClickRow"
      @update:selected="selectedRows"
    />
  </div>
</template>
