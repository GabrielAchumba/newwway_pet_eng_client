<template>
  <q-card style="min-width: 70%;">
    <q-toolbar class="bg-secondary text-primary">
      <q-toolbar-title class="text-caption">
        {{ dialogTitle }}
      </q-toolbar-title>
      <div class="button-group-container">
        <q-btn-group 
            push 
            class="row q-pa-sm bg-secondary text-primary items-stretch"
            flat>
            <q-btn 
            v-for="toolbarItem in toolbarItems"
            :key="toolbarItem.id"
            class="col" 
            color="accent" 
            glossy text-color="primary" 
            push 
            :label="toolbarItem.title" 
            :style="toolbarItem?.style" 
            @click="toolBarItemClick(toolbarItem?.title2)"
            size="sm">
            </q-btn>
        </q-btn-group>
        </div>
      <q-btn flat round dense icon="close" v-close-popup size="sm" />
    </q-toolbar>

    <q-card-section
    class="q-pt-md scroll-container">
      <slot name="content"></slot>
    </q-card-section>

  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';

export default defineComponent({
  name: 'SlotsDialog',
  components:{
  },
  props: {
    dialogTitle: {
      type: String,
      default: ""
    },
    toolbarItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['toolBarItemClick'],
  setup(props, { emit }) {
    console.log("props.dialogTitle: ", props.dialogTitle)
    console.log("props.toolbarItems: ", props.toolbarItems)

    

    const toolBarItemClick = async (title2) => {

      emit('toolBarItemClick', title2);

    }


    const handleCancel = () => {
      //emit('cancel');
    };



    onMounted(() => {
      

    });

    return {
      handleCancel,
      toolBarItemClick,
    };
  }
});
</script>

<style scoped>
.scroll-container {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  max-height: calc(100vh - 80px); /* Adjust based on your header height */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* WebKit */
}

.button-group-container {
  flex-shrink: 0;
  /*border-top: 1px solid #e0e0e0;  Optional separator */
  background-color: #0A1D3F;
}

.spinner-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>