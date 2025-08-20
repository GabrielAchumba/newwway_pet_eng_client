<template>
    <div class="row bg-primary  text-accent" style="min-width: 300px;">
        <div class="col-12 q-pa-sm">   
            <q-list>
                <q-item 
                v-for="item in menuList" :key="item.label"
                clickable v-ripple
                @click="listItemClickAction(item)">
                    <q-item-section avatar>
                    <q-icon color="accent" 
                    :name="item.iconName" />
                    </q-item-section>

                    <q-item-section>{{ item.label}}</q-item-section>
                </q-item>

            </q-list>
        </div>


    </div>
</template>

<script>

export default {
    computed:{
         isCreateWellDesign(){
            return this.$store.getters['wellDesignStore/isCreateWellDesign'];
        },
    },
    props:{
        menuList: {
            type: Array,
            default: () => []
        }
    },
    data () {
    return {
      menuList1: [
          {
              label: "New",
              iconName: "create_new_folder",
              actionName:"newEvent",
          },
          {
              label: "Open",
              iconName: "folder_open",
              actionName:"openEvent",
          },
          {
              label: "Save Project",
              iconName: "save",
              actionName:"saveEvent",
          }
      ],
       menuList2: [
          {
              label: "Save Project As",
              iconName: "save_alt",
              actionName:"saveAsEvent",
          },
          {
              label: "Recent Projects",
              iconName: "reorder",
              actionName:"recentProjectsEvent",
          },
          {
              label: "All Projects",
              iconName: "reorder",
              actionName:"allProjectsEvent",
          },
          {
              label: "Exit",
              iconName: "disabled_by_default"
          }
      ]
    }
  },
  methods:{
      listItemClickAction(qTab){
          this.$emit(qTab.actionName, qTab)
      }
  }
}
</script>

<style scoped>

</style>