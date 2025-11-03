<template>
  <div>
    <Table 
    :columns="columns"
    :rows="rows"
    @updateEditableTable="updateEditableTable"
    />  
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Table from '../../../tables/TableEditable4.vue';

export default defineComponent({
  name: 'DPConstraints',
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
    console.log("props.activeDrainagePoint: ", props.activeDrainagePoint)

    const columns = ref([
        {
            name: 'abandonmentCondtion',
            required: true,
            label: 'Constraint',
            align: 'left',
            field: row => row.abandonmentCondtion,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'text',
            isEditable: false
        },
        {
            name: 'abandonmentValue',
            required: false,
            label: 'Value',
            align: 'left',
            field: row => row.abandonmentValue,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: 'number',
            isEditable: true
        },
        {
            name: 'abandonmentUnit',
            required: false,
            label: 'Unit',
            align: 'left',
            field: row => row.abandonmentUnit,
            sortable: true,
            headerClasses: 'text-primary bg-secondary',
            variableType: null,
            isEditable: false
        }
      ]);

    const rows = ref(props.activeDrainagePoint.Constraints);


    const updateEditableTable = (payload) => {
      const _payload = {
        value: payload.value,
        variable: "Constraints"
      }
      emit('updateEditableTable', _payload);
    };

    watch(() => props.activeDrainagePoint, (newVal) => {
      console.log("activeDrainagePoint prop changed in child:", newVal)
      //rows.value = newVal.Constraints
      rows.value = newVal?.Constraints ?  newVal?.Constraints.map((row, idx) => {

        //const numericValue = Number(row.abandonmentValue);
        console.log("numericValue: ", row.abandonmentValue, idx)

        if (row.abandonmentValue) {
            return {
                constraintId: row?.constraintId || null,
                abandonmentCondtion: row.abandonmentCondtion,
                abandonmentValue: row.abandonmentValue,
                abandonmentUnit: row.abandonmentUnit?.trim() || "",
            }
        } else {
            return {
                constraintId: row?.constraintId || null,
                abandonmentCondtion: row.abandonmentCondtion,
                abandonmentValue: null,
                abandonmentUnit: row.abandonmentUnit?.trim() || "",
            }
        }
      }) : [];
      console.log("rows.value: ", rows.value);
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