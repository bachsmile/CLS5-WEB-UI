<script setup lang="ts">
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: string): void
}
interface Props {
  mobileNumber?: string
  isDialogVisible: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const phoneNumber = ref(structuredClone(toRaw(props.mobileNumber)))

function formSubmit() {
  if (phoneNumber.value) {
    emit('submit', phoneNumber.value)
    emit('update:isDialogVisible', false)
  }
}

function resetPhoneNumber() {
  phoneNumber.value = structuredClone(toRaw(props.mobileNumber))
  emit('update:isDialogVisible', false)
}

function dialogModelValueUpdate(val: boolean) {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    max-width="600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-5 pa-sm-15">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium ">
          Enable One Time Password
        </VCardTitle>
        <VCardSubtitle class="mt-3">
          Verify Your Mobile Number for SMS
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="pt-6">
        <p class="mb-6">
          Enter your mobile phone number with country code and  we will send you a verification code.
        </p>

        <VForm @submit.prevent="() => {}">
          <VTextField
            v-model="phoneNumber"
            dirty
            name="mobile"
            type="number"
            prefix="+1"
            label="Phone Number"
            placeholder="202 555 0111"
            class="mb-5"
          />

          <VBtn
            type="submit"
            class="me-3"
            @click="formSubmit"
          >
            Submit
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            @click="resetPhoneNumber"
          >
            Cancel
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
