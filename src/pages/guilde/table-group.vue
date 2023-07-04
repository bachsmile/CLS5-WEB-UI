<script lang="ts" setup>
import CmTableGroup from '@/components/common/CmTableGroup.vue'

const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: 'PLAYER', value: 'player', key: true },
  { text: 'TEAM', value: 'team' },
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
    player: '0->1,2,3,4,5',
    team: 'GSW',
    number: 30,
    position: 'G',
    indicator: { height: '6-2', weight: 185 },
    lastAttended: 'DavcustomIdson',
    country: 'USA',
    children: [{ customId: 1 }, { customId: 5 }],
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
  {
    customId: 1,
    isSelected: false,
    player: '1-> 2,3,4',
    team: 'LAL',
    number: 6,
    position: 'F',
    indicator: { height: '6-9', weight: 250 },
    lastAttended: 'St. Vincent-St. Mary HS (OH)',
    country: 'USA',
    children: [{ customId: 2 }, { customId: 3 }],
  },
  { customId: 2, isSelected: false, player: '2', team: 'BKN', number: 7, position: 'F', indicator: { height: '6-10', weight: 240 }, lastAttended: 'Texas-Austin', country: 'USA' },
  {
    customId: 3,
    isSelected: false,
    player: '3-> 4',
    team: 'MIL',
    number: 34,
    position: 'F',
    indicator: { height: '6-11', weight: 242 },
    lastAttended: 'Filathlitikos',
    country: 'Greece',
    children: [{ customId: 4 }],
  },
  {
    customId: 4,
    isSelected: false,
    player: '4',
    team: 'LAL',
    number: 6,
    position: 'F',
    indicator: { height: '6-9', weight: 250 },
    lastAttended: 'St. Vincent-St. Mary HS (OH)',
    country: 'USA',
  },
  {
    customId: 5,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
  },
  {
    customId: 6,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
    children: [{ customId: 7 }],
  },
  {
    customId: 7,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
    children: [{ customId: 8 }, { customId: 9 }],
  },
  {
    customId: 8,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
    children: [{ customId: 10 }],
  },
  {
    customId: 10,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
  },
  {
    customId: 9,
    isSelected: false,
    player: '5',
    team: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
  },
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
    <CmTableGroup
      :group-options="groupOptions"
      :headers="headers"
      :items="items"
      custom-id="customId"
      @handleClickRow="handleClickRow"
      @selectedRows="selectedRows"
    />
  </div>
</template>
