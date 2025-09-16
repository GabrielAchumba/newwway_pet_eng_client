<template>
  <!-- QDialog makes it a proper popup -->
  <q-dialog v-model="isVisible" persistent>
    <q-card :style="cardStyle" class="bg-primary">

      <!-- HEADER -->
      <q-bar class="bg-secondary text-primary">
        <div class="text-h6 text-primary">{{ title }}</div>

        <q-space />
        <q-btn dense flat icon="close" class="bg-secondary text-primary" @click="cancelMessageBox" />
      </q-bar>

      <q-separator />

      <!-- MESSAGE -->
      <q-card-section class="bg-primary text-secondary">
        <p>{{ message }}</p>
      </q-card-section>

      <q-separator />

      <!-- ACTIONS -->
      <q-card-actions align="right">
        <q-btn flat label="Cancel"
               class="bg-accent text-primary"
               size="sm"
               no-caps
               @click="cancelMessageBox" />
        <q-btn flat label="Okay"
               class="bg-secondary text-primary"
               size="sm"
               no-caps
               @click="oKMessageBox" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    title: { type: String, required: true },
    message: { type: String, default: '' },
    cancelEvent: { type: String, default: '' },
    okayEvent: { type: String, default: '' },
    modelValue: { type: Boolean, default: false } // allow v-model from parent
  },
  emits: ['update:modelValue'],
  computed: {
    isVisible: {
      get () { return this.modelValue },
      set (val) { this.$emit('update:modelValue', val) }
    },
    cardStyle () {
      return {
        width: this.$q.screen.lt.sm ? '95vw' : '400px',
        maxWidth: '95vw',
      }
    }
  },
  methods: {
    cancelMessageBox () {
      this.$emit(this.cancelEvent, this.title)
      this.isVisible = false
    },
    oKMessageBox () {
      this.$emit(this.okayEvent, this.title)
      this.isVisible = false
    }
  }
}
</script>