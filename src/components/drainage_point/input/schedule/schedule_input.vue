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
import Table from '../../../tables/TableEditable4.vue';
import { EVENTTYPES, CONSTRAINTTYPES } from '../../../../constants/asset_models';

export default defineComponent({
  name: 'DPScheduleInput',
  components:{
    Table
  },
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    },
    activeDrainagePoint: {
        type: Object,
        default: () => ({})
    }
  },
  emits: ['updateEditableTable'],
  setup(props, { emit }) {
    console.log("props.selectedComponent: ", props.selectedComponent)

    const columns = ref([
        {
            name: 'scheduleDate',
            required: true,
            label: 'Date',
            align: 'left',
            field: row => row.scheduleDate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'date',
            isEditable: true
        },
        {
            name: 'eventType',
            label: 'Event Type',
            align: 'left',
            field: row => row.eventType,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'select',
            isEditable: true,
            options: EVENTTYPES,
        },
        {
            name: 'constraintType',
            label: 'Constraint Type',
            align: 'left',
            field: row => row.constraintType,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'select',
            isEditable: true,
            options: CONSTRAINTTYPES,
        },
        {
            name: 'newValue',
            label: 'New Value',
            align: 'left',
            field: row => row.newValue,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'number',
            isEditable: true
        },
        {
            name: 'scheduleUnit',
            label: 'Unit',
            align: 'left',
            field: row => row.scheduleUnit,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'text',
            isEditable: false
        }
        ]);

    const rows = ref(props.activeDrainagePoint.Schedule);

    const updateEditableTable = (payload) => {
      const _payload = {
        value: payload.value,
        variable: "Schedule"
      }
      emit('updateEditableTable', _payload);
    };

    watch(() => props.activeDrainagePoint, (newVal) => {
      
      rows.value = newVal.Schedule
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