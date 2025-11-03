<template>
  <div>
    <Table :table_VM="table_VM"/>  
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Table from '../../../tables/Table2.vue';

export default defineComponent({
  name: 'IPRAbandonment',
  components:{
    Table
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

    const table_VM = ref({
        title: "",
        separator: "cell",
        columns: [
        {
            name: 'abandonmentCondtion',
            required: true,
            label: 'Abandonment Constraint',
            align: 'left',
            field: row => row.abandonmentCondtion,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'value',
            label: 'Value',
            align: 'left',
            field: row => row.abandonmentValue,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'unit',
            label: 'Unit',
            align: 'left',
            field: row => row.abandonmentUnit,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        }
        ],
        rows: [
        { id: 1, abandonmentCondtion: 'Maximum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb' },
        { id: 2, abandonmentCondtion: 'Maximum Water Cut', abandonmentValue: null, oilRate: 'percent' },
        { id: 3, abandonmentCondtion: 'Maximum Water Gas Ratio', abandonmentValue: null, oilRate: 'scf/stb' },
        { id: 4, abandonmentCondtion: 'Maximum Liquid Rate', abandonmentValue: null, oilRate: 'stb/d' },
        ]

    });


    const handleSave = () => {
      emit('saved', props.selectedComponent);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
        table_VM
    };
  }
});
</script>

<style scoped>
</style>