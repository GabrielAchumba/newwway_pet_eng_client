<template>
    <div>
        <div class="row q-pa-none">
            
            <q-card class="col-12">
                <q-bar class="bg-accent text-primary">
                    <div class="text-h6 text-primary text-center">Search</div>
                    <q-space/>
                    <q-btn dense flat 
                    icon="close" class="bg-accent text-primary" @click="closeDialog">
                    </q-btn>
                </q-bar>
                <q-separator />
                <q-card-section class="bg-primary text-accent">
                    <div
                      class="q-pa-sm">
                      <span>
                        <p class="q-ma-none">{{ search_vm.qSelect.label }}</p>
                        <div class="row no-wrap">
                        <q-select
                            class="q-ma-none col-11"
                            color="accent" 
                            outlined label-color="accent"
                            option-disable="inactive"
                            v-model="search_vm.qSelect.value"
                            :options="search_vm.qSelect.list"
                            option-value="id"
                            :option-label="'type'"
                            :name="search_vm.qSelect.value"
                            emit-value
                            map-options
                            >
                        </q-select>
                        <q-btn class="col-1" outline dense flat icon="add" @click="onAdd"/>
                        <q-btn class="col-1" outline dense flat icon="refresh" @click="refreshTableData"/>
                        </div>
                      </span>
                    </div>
                </q-card-section>
                
                <q-separator />
                <q-list bordered>
                     <q-item v-for="searchItem in search_vm.search_list" :key="searchItem.id" class="q-my-sm" clickable>
                        <textsearch
                        :search_Item="searchItem"
                        @onRemove="onRemove"/>
                     </q-item>
                </q-list>
                <q-separator />
                <q-card-actions align="right">
                   <div 
                   class="row q-pa-sm">
                      <q-space />
                      <q-btn class="q-ma-sm bg-accent text-primary"
                        label="Search"
                        type="button"
                        size="md"
                        icon="search"
                        no-caps
                        @click="searchAction"
                      />
                   </div>
                </q-card-actions>
            </q-card>
        </div>

    </div>
</template>

<script>
import textsearch from "./text-search.vue";
import { search_vm } from "./view_models/search-list-view-model";

export default {
    computed:{
        activeRows(){
            return this.$store.getters["authenticationStore/activeRows"];
        }
    },
    components: {
        textsearch,
    },
    data(){
        return {
            search_vm: search_vm,
            textEqualities: ["Equal To", "Not Equal To"],
            numbersIniqualities: ["Greater Than", "Less Than", "Not Equal To",
             "Equal To", "Less Than Or Equal To", "Greater Than Or Equal To"],
        }
    },
    methods:{
        onAdd(){
            var context = this;
            let selectedItem = context.search_vm.qSelect.list.find(o => o.value === context.search_vm.qSelect.value);
            console.log("selectedItem: ", selectedItem);
            if(selectedItem.dataType == "text"){
                const searchItem = {
                    qInput: { name: "" },
                    qSelect: { value: "", list: [], actionName: "" },
                    selectedVariable: { label: "", value: "" }
                };
                searchItem.qSelect.list = context.textEqualities.map((row, i) => {
                    return {
                        id: i,
                        value: i,
                        label: row,
                        type: row,
                    }
                })
                searchItem.qSelect.value = searchItem.qSelect.list[0];

                searchItem.id = context.search_vm.search_list.length + 1;
                searchItem.selectedVariable.label = selectedItem.label;
                searchItem.selectedVariable.value = selectedItem.value;
                searchItem.dataType = "text";
                context.search_vm.search_list.push(searchItem);
                
            }
            
            if(selectedItem.dataType == "number"){
                const searchItem = {
                    qInput: { name: "" },
                    qSelect: { value: "", list: [], actionName: "" },
                    selectedVariable: { label: "", value: "" }
                };
                searchItem.qSelect.list = context.numbersIniqualities.map((row, i) => {
                    return {
                        id: i,
                        value: i,
                        label: row,
                        type: row,
                    }
                })

                searchItem.qSelect.value = searchItem.qSelect.list[0];

                searchItem.id = context.search_vm.search_list.length + 1;
                searchItem.selectedVariable.label = selectedItem.label;
                searchItem.selectedVariable.value = selectedItem.value;
                searchItem.dataType = "number";
                context.search_vm.search_list.push(searchItem);
            }
             

        },
        onRemove(searchItem){
            var context = this;
            console.log("searchItem: ",searchItem)
            context.search_vm.search_list.splice(searchItem.id-1, 1);
            var i = 0;
            for(i = 0; i < context.search_vm.search_list.length; i++){
                context.search_vm.search_list[i].id = i+1;
            }
        },
        filterByText(newRows, inequality, variableName, variableValue){
            let rows = [];
            for(const activeRow of newRows){
                switch(inequality){
                    case "Equal To":
                        if(activeRow[variableName] === variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Not Equal To":
                        if(activeRow[variableName] !== variableValue){
                            rows.push(activeRow);
                        }
                        break;
                }
            }

            return rows;

        },
        filterByNumber(newRows, inequality, variableName, variableValue){
            let rows = [];
            for(const activeRow of newRows){
                switch(inequality){
                    case "Equal To":
                        if(activeRow[variableName] === variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Not Equal To":
                        if(activeRow[variableName] !== variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Greater Than":
                        if(activeRow[variableName] > variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Greater Than Or Equal To":
                        if(activeRow[variableName] >= variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Less Than":
                        if(activeRow[variableName] < variableValue){
                            rows.push(activeRow);
                        }
                        break;
                    case "Less Than Or Equal To":
                        if(activeRow[variableName] <= variableValue){
                            rows.push(activeRow);
                        }
                        break;
                }
            }

            return rows;

        },
        searchAction(){
            var context = this;
            let newRows = context.activeRows;
            for(const item of context.search_vm.search_list){
                console.log("item.qSelect: ", item.qSelect)
                const qSelectListItem = item.qSelect.list.find(o => o.value === item.qSelect.value.value);
                switch(qSelectListItem.dataType){
                    case "text":
                        console.log("qSelectListItem: ", qSelectListItem)
                        newRows = context.filterByText(newRows, qSelectListItem.label,
                         item.selectedVariable.value, item.qInput.name);
                        break;
                        
                    case "number":
                        console.log("qSelectListItem: ", qSelectListItem)
                       newRows = context.filterByNumber(newRows, qSelectListItem.label,
                         item.selectedVariable.value, Number(item.qInput.name));
                        break;
                }
            }

            console.log("newRows: ", newRows);
            this.$store.commit("authenticationStore/setNewRows", newRows)
            this.$store.commit("authenticationStore/setGlobalSearchDialog", false)
        },
        refreshTableData(){
            var context = this;
            const newRows = context.activeRows;
            this.$store.commit("authenticationStore/setNewRows", newRows)
        },
        closeDialog(){
            this.$store.commit("authenticationStore/setGlobalSearchDialog", false)
        }
    },
    created(){
        const context = this;
        context.search_vm.qSelect.list = this.$store.getters["authenticationStore/activeColumns"].map((row) => {
            return {
                id: row.name,
                value: row.name,
                label: row.label,
                type: row.label,
                dataType: row.type,
            }
        })

        context.search_vm.search_list = [];
        const newRows = context.activeRows;
        this.$store.commit("authenticationStore/setNewRows", newRows)
    }
}
</script>