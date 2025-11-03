<template>
  <div class="container">
    <div class="scrollable-content">
      <IPRLayer v-if="isIPRLayer"/>
      <IPRAbandonment v-if="isIIPRAbandonment"/>
    </div>
    <!-- <q-separator></q-separator> -->
    <div class="button-group-container">
      <q-btn-group 
          push 
          class="row q-pa-sm bg-primary text-primary items-stretch"
          style="width: 100%"
          flat>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="IPR Layer" style="border-right: 2px solid #0A1D3F;" @click="IPRLayerClick" size="sm"/>
              <q-btn class="col" color="accent" glossy text-color="primary" 
              push label="Abandonment" @click="AbandonmentClick" size="sm"/>
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import IPRLayer from './ipr_layer.vue';
import IPRAbandonment from './abandonment.vue';

export default defineComponent({
  name: 'IPRInput',
  components:{
    IPRLayer,
    IPRAbandonment
  },
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    console.log("props.selectedComponent: ", props.selectedComponent)

    const isIPRLayer = ref(true);
    const isIIPRAbandonment = ref(false);

    const IPRLayerClick = () => {
      isIPRLayer.value = true;
      isIIPRAbandonment.value = false;
    };

    const AbandonmentClick = () => {
      isIPRLayer.value = false;
      isIIPRAbandonment.value = true;
    };

    return {
      isIPRLayer,
      isIIPRAbandonment,
      IPRLayerClick,
      AbandonmentClick
    };
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* or whatever height you need */
  max-height: 80vh; /* adjust as needed */
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-height: 0; /* Important for flex child scrolling */
}

.scrollable-content::-webkit-scrollbar {
  display: none;
}

.button-group-container {
  flex-shrink: 0;
  border-top: 1px solid #e0e0e0; /* Optional separator */
  background-color: var(--q-primary, white);
}
</style>