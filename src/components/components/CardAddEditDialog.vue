<script setup lang="ts">
import constant from '@/constant/constant'

interface Details {
  number: string
  name: string
  expiry: string
  cvv: string
  isPrimary: boolean
  type: string
}
interface Emit {
  (e: 'submit', value: Details): void
  (e: 'update:isDialogVisible', value: boolean): void
}

interface Props {
  cardDetails?: Details
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardDetails: () => ({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    isPrimary: false,
    type: '',
  }),
})

const emit = defineEmits<Emit>()

const cardDetails = ref<Details>(structuredClone(toRaw(props.cardDetails)))

watch(props, () => {
  cardDetails.value = structuredClone(toRaw(props.cardDetails))
})

function formSubmit() {
  emit('submit', cardDetails.value)
}

function dialogModelValueUpdate(val: boolean) {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-5 pa-sm-15">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium mb-4">
          {{ props.cardDetails.name ? 'Edit Card' : 'Add New Card' }}
        </VCardTitle>
        <p class="mb-0">
          {{ props.cardDetails.name ? 'Edit your saved card details' : 'Add your saved card details' }}
        </p>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 Card Number -->
            <VCol cols="12">
              <VTextField
                v-model="cardDetails.number"
                label="Card Number"
                type="number"
                :min="constant.MIN_NUMBER"
                :max="constant.MAX_NUMBER"
              />
            </VCol>

            <!-- 👉 Card Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="cardDetails.name"
                label="Name"
              />
            </VCol>

            <!-- 👉 Card Expiry -->
            <VCol
              cols="6"
              md="3"
            >
              <VTextField
                v-model="cardDetails.expiry"
                label="Expiry Date"
              />
            </VCol>

            <!-- 👉 Card CVV -->
            <VCol
              cols="6"
              md="3"
            >
              <VTextField
                v-model="cardDetails.cvv"
                type="password"
                label="CVV Code"
              />
            </VCol>

            <!-- 👉 Card Primary Set -->
            <VCol cols="12">
              <VSwitch
                v-model="cardDetails.isPrimary"
                label="Set as primary card"
              />
            </VCol>

            <!-- 👉 Card actions -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                class="me-3"
                type="submit"
                @click="formSubmit"
              >
                Submit
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="$emit('update:isDialogVisible', false)"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
