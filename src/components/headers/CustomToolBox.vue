<template>
  <div class="row items-center q-pa-sm bg-primary" style="height: 40px;" :class="{'toolbox-shadow': shadow}">
    <div class="row">
      <!-- <q-btn
        v-for="(button, index) in buttons"
        :key="index"
        dense
        flat
        round
        :icon="button.icon"
        :class="button.class || 'text-secondary'"
        @click="button.handler"
      >
        <q-tooltip>{{ button.tooltip }}</q-tooltip>
      </q-btn> -->

      <q-btn
        v-for="(button, index) in buttons"
        :key="index"
        dense
        flat
        round
        :icon="button.icon"
        :class="[button.class || 'text-secondary', 'mx-btn']"
        @click="button.handler"
      >
        <q-tooltip>{{ button.tooltip }}</q-tooltip>
    </q-btn>


    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbox',
  props: {
    buttons: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(button => {
          return 'icon' in button && 'handler' in button && 'tooltip' in button
        })
      }
    },
    shadow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.toolbox-shadow {
  box-shadow: 0 2px 4px -1px rgba(10, 29, 63, 0.1), 
              0 1px 3px -1px rgba(10, 29, 63, 0.1);
  z-index: 1;
  position: relative;
}

/* Smooth transition for shadow */
.toolbox-shadow {
  transition: box-shadow 0.2s ease;
}

/* Optional: More pronounced shadow on hover */
.toolbox-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(10, 29, 63, 0.1), 
              0 2px 4px -1px rgba(10, 29, 63, 0.1);
}

.mx-btn {
  margin: 0 8px; /* adjust spacing as needed */
}
</style>