<template>
  <div>
    <Table 
    :columns="columns"
    :rows="rows"
    @updateEditableTable="updateEditableTable"/>  
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Table from '../../components/tables/TableEditable5.vue';
import { unitNames } from '../../units_quantities/unitNames';

export default defineComponent({
  name: 'UnitsConfig',
  components:{
    Table
  },
  props: {
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

    const rows = ref(unitNames.map((row, idx)=> {
            return {
                id: idx,
                unitName: row.unitName,
                input: 0,
                output: 0,
                columsOptions:{
                    input: row.inputOptions,
                    output: row.outputOptions,
                },
                quantity: row.quantity,
                unitId: 0
            }
        }));

    const updateEditableTable = (payload) => {
      console.log("payload: ", payload)
      emit('updateEditableTable', payload);
    };

    // watch(() => props.activeDrainagePoint, (newVal) => {
      
    //   rows.value = newVal.Schedule
    // }, { deep: true, immediate: true })

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