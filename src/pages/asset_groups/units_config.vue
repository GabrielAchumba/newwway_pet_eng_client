<template>
  <div>
    <Table 
    :columns="columns"
    :rows="rows"
    @updateEditableTable="updateEditableTable"/>  
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Table from '../../components/tables/TableEditable5.vue';

export default defineComponent({
  name: 'UnitsConfig',
  components:{
    Table
  },
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  },
  emits: ['updateEditableTable'],
  setup(props, { emit }) {

    const columns = ref([
        {
            name: 'unitName',
            required: true,
            label: 'Unit Name',
            align: 'left',
            field: row => row.unitName,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'text',
            isEditable: false
        },
        {
            name: 'input',
            label: 'Input',
            align: 'left',
            field: row => row.input,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'select',
            isEditable: true,
        },
        {
            name: 'output',
            label: 'Output',
            align: 'left',
            field: row => row.output,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'select',
            isEditable: true,
        },
    ]);

    const rows = ref([...props.rows]);
    console.log("rows: ", rows)

    const updateEditableTable = (payload) => {
      console.log("payload.value: ", payload.value)
      rows.value = [...payload.value];
      emit('updateEditableTable', payload.value);
    };

    watch(() => props.rows, (newVal) => {
      
      if(newVal){
        rows.value = [...newVal];
      }

    }, { deep: true, immediate: true })

    return {
        columns,
        rows,
        updateEditableTable
    };
  }
});
</script>

<style scoped>
</style>