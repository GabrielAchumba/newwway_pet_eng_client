<template>
  <div class="bg-primary">
    <q-bar 
      v-if="isTableQbar"
      class="col-12 bg-info text-primary">
          <q-space></q-space>
          <q-btn  
              icon="disabled_by_default"
              flat
              class="text-capitalize"
              @click="closeTableDialog">
          </q-btn>
    </q-bar>

    <q-table 
      :rows="table_VM.rows"
      :title="table_VM.title"
      :columns="table_VM.columns" 
      row-key="name" 
      binary-state-sort
      :separator="table_VM.separator"
      :filter="filter"
      :filter-method="customFilter"  
      :loading="loading"
      :wrap-cells="autoWidth"
      class="screenwide q-ma-sm bg-primary"
      bordered
      >

         <template v-slot:top-left>
            <q-input borderless dense debounce="300" v-model="search" placeholder="Search" class="col">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
        </template>

        <template v-slot:top-right>
             <q-icon 
             v-if="table_VM.isImport"
              class="col"
              name="add" 
              @click="createItem"
              size="20px">
              <q-tooltip>
                Import Table
              </q-tooltip>
            </q-icon>

            <q-icon 
            v-if="table_VM.isExport"
              class="col"
              name="table_view" 
              @click="exportTable"
              size="20px">
              <q-tooltip>
                Export Table
              </q-tooltip>
            </q-icon>
        </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-secondary text-primary"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">

              <q-tr 
              v-if="props.row.isActive"
              :props="props">
                <q-td key="sn" :props="props">
                   {{ props.row.sn}}
                </q-td>

                <q-td key="actions" :props="props">
                    <div class="row q-pa-md text-center">
                       <q-toggle
                          v-model="checkBoxModels[props.row.sn-1]"
                          color="accent"
                          false-value="Disagreed"
                          true-value="Agreed"
                        />
                        <q-icon 
                        name="edit"
                        @click="updateItem(props.row)"
                        size="sm"/>
                        <q-icon 
                        name="delete" 
                        @click="deleteItem(props.row)"
                        size="sm" />
                    </div>
                </q-td>

                <!-- <q-td key="route" :props="props">
                    <a href="#" @click="linkClick(props.row)">{{ props.row['route']}}</a>
                </q-td> -->

                <q-td 
                class="bg-info text-primary"
                v-for="column in removekeys()" :key="column.name"
                :props="props">{{ props.row[column.name] }}</q-td>
              </q-tr>

              <q-tr 
              v-else
              :props="props">
                <q-td key="sn" :props="props">
                   {{ props.row.sn}}
                </q-td>
                <q-td key="actions" :props="props">
                    <div class="row q-pa-sm text-center">
                        <q-toggle
                          v-model="checkBoxModels[props.row.sn-1]"
                          color="accent"
                          false-value="Disagreed"
                          true-value="Agreed"
                        />
                        <q-icon 
                        name="edit"
                        @click="updateItem(props.row)"
                        size="sm"/>
                        <q-icon 
                        name="delete" 
                        @click="deleteItem(props.row)"
                        size="sm" />
                    </div>
                </q-td>

                <!-- <q-td key="route" :props="props">
                    <a href="#" @click="linkClick(props.row)">{{ props.row['route']}}</a>
                </q-td> -->

                <q-td 
                v-for="column in removekeys()" :key="column.name"
                :props="props">{{ props.row[column.name] }}</q-td>
              </q-tr>
          </template>
    </q-table>

  </div>
</template>

<script>
    import { exportFile } from 'quasar'
    import { tableVM } from "./TableVM";
    import CardList from "../cards/Card4Table.vue"
    import Search from "../searches/Search.vue";
    import { useAuthStore } from 'src/store/modules/authStore';

    const authStore = useAuthStore();

    function wrapCsvValue (val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')

      return `"${formatted}"`
    }


    export default {
        computed:{
          isMobile(){
            return authStore.isMobile;
          },
          rows(){ 
            return authStore.newRows;
          },
          setIsResponsive(){
            console.log("setIsResponsive called")
            if(window.innerWidth < 700) return true
            else return false;
          },
          filter() {
            var context = this;
            return {
              search: context.search,     
            }
          }
        },
        components:{
          CardList,
          Search,
        },
        props: {
          isTableQbar:{
              type: Boolean,
              default: false
          },
            isResponsive:{
              type: Boolean,
              default: false
            },
            table_VM:{
                type: Object,
                default: tableVM,
            },
            isHeader:{
              type:Boolean,
              default: true
            },
            tableRows:{
              type: Array,
              default: []
            }
        },
        data(){
          return {
            autoWidth: true,
            qToggleModel: "Disagreed",
            tableWidth: window.innerWidth < 700 ? `${window.innerWidth * 0.6}px`: "100%",
            cardWidth: window.innerWidth < 700 ? `${window.innerWidth * 0.7}px`: "100%",
            loading: false,
            rowCount: 10,
            windowResize: false,  
            search: '',
            checkBoxModels: [],
          }
        },
        methods: {
          closeTableDialog(){
            this.$emit("closeTableDialog")
          },
          customFilter(rows, terms){
            // rows contain the entire data
            // terms contains whatever you have as filter
            
            //console.log(terms,rows)
            
            var lowerSearch = terms.search ? terms.search.toLowerCase() : ""

            const filteredRows = rows.filter(
              (row, i) =>{
              
              //Gather search condition    

              
              //Assume true in case there is no search 
              let s1 = true
              
              //If search term exists, convert to lower case and see which rows contain it
              if(lowerSearch != ""){
                s1 = false
                //Get the values
                let s1_values = Object.values(row)
                //Convert to lowercase
                let s1_lower = s1_values.map(x => x.toString().toLowerCase())
              
                for (let val = 0; val<s1_lower.length; val++){
                  if (s1_lower[val].includes(lowerSearch)){
                    s1 = true
                    break
                  }
                }
              }

              return s1

              })

            return filteredRows
          },
            linkClick(row){
              this.$emit("linkClick", row)
            },
            removekeys(){
              var context = this;
              var columnsNew = []
              for(const column of context.table_VM.columns){
                  if(column.name != "actions" 
                  && column.name != "route"  
                  && column.name != "sn"){
                      columnsNew.push(column);
                  }
              }

              return columnsNew;
          },
          okayEvent(){
            var context = this;
            context.isFetchTableDialog = false
          },
          cancelEvent(){
            var context = this;
            context.isFetchTableDialog = false
          },
          createItem(){
              this.$emit("importCollection");
          },
          updateItem(selectedItem){
            var context = this;
            this.$emit(context.table_VM.updateItem, selectedItem);
          },
          deleteItem(selectedItem){
            var context = this
            this.$emit(context.table_VM.deleteItem, selectedItem);
          },
          deleteAllItems(){
            var context = this;
            this.$emit("deleteAllItems", context.checkBoxModels);
          },
          exportTable () {
            // naive encoding to csv format
            var context = this;
            const content = [context.table_VM.columns.map(col => wrapCsvValue(col.label))].concat(
              context.table_VM.rows.map(row => context.table_VM.columns.map(col => wrapCsvValue(
                typeof col.field === 'function'
                  ? col.field(row)
                  : row[ col.field === void 0 ? col.name : col.field ],
                col.format,
                row
              )).join(','))
            ).join('\r\n')

            const status = exportFile(
              'table-export.csv',
              content,
              'text/csv'
            )

            if (status !== true) {
              /* $q.notify({
                message: 'Browser denied file download...',
                color: 'negative',
                icon: 'warning'
              }) */
            }
          },
          onResize(e) {
            const width = window.innerWidth;
            var context = this;
            if(width < 700) {
              context.tableWidth = `${width * 0.6}px`;
              context.cardWidth = `${width * 0.7}px`;
              context.windowResize = true;
              console.log("windowResize: ", context.windowResize)
            }else{
              context.tableWidth = "100%"
              context.cardWidth = "100%"
              context.windowResize = false;
              console.log("windowResize: ", context.windowResize)
            }
          },
          onToggleAllTableRows(event){
            var context = this;
            console.log("event: ", event)
            for(let i = 0; i < context.checkBoxModels.length; i++){
              context.checkBoxModels[i] = event;
            }
          },

      },
      watch: {
          tableRows: function(val) {
              //console.log("val: ", val)
              if (val) {
                var context = this;
                context.checkBoxModels = [];
                context.checkBoxModels = context.rows.map((row) => {
                  return "Disagreed";
                })
              }
          }
      },
      mounted() {
        window.addEventListener("resize", this.onResize);
      },
      unmounted() {
        window.removeEventListener("resize", this.onResize);
      },
      created(){
        var context = this
        context.checkBoxModels = context.table_VM.rows.map((row) => {
          return "Disagreed";
        })
      }
    }
</script>

<style lang="scss" scoped>

.screenwide{
  max-width: 100% !important
}


.report-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-collapse: collapse;

    .q-table__top,
    .q-table__bottom {
    background-color: $primary;
    }

    .q-table__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: $primary;
    border: 1px solid rgba(0, 0, 0, 0.12);
    }

    .q-table__middle {
    flex: 1;
    overflow-y: auto;
    max-height: calc(100vh - 120px);
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: rgba($secondary, 0.2);
        border-radius: 4px;
    }
    }

    .q-table__grid-content {
    overflow-y: auto;
    }

    .q-table thead tr {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: $secondary;
    color: $primary;
    }

    .q-table tbody tr {
    background-color: $primary;
    }

    .q-table th, .q-table td {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    &:last-child {
        border-right: none;
    }
    }

    .q-table th {
    font-weight: 600;
    font-size: 14px;
    color: $primary;
    border-bottom: 2px solid rgba(0, 0, 0, 0.12);
    }

    .q-table td {
    font-size: 13px;
    color: $forecolor1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
}
	

/* .screenwide .q-table{
  max-width: 100% !important
}
	 */
</style>