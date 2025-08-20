<template>
    <div class="row no-wrap">
        <q-input class="q-ma-none col" outlined v-model="search_Item.selectedVariable.label" type="text" disable></q-input>
        <q-select
        class="q-ma-none"
        color="accent" 
        outlined label-color="accent"
        option-disable="inactive"
        v-model="search_Item.qSelect.value"
        :options="search_Item.qSelect.list"
        option-value="id"
        :option-label="'type'"
        name="type"
        emit-value
        map-options
        @input="onQSelectItemValueChanged"
        >
        </q-select>
        <q-input class="q-ma-none col" outlined v-model="search_Item.qInput.name" type="text"></q-input>
        <q-btn outline dense flat icon="close" @click="onRemove"/>
    </div>
</template>

<script>
import search_Item from "./view_models/search_item";
export default {
    props:{
        search_Item: {
            type: Object,
            default: search_Item
        },
    },
    methods: {
        onQSelectItemValueChanged(){
            var context = this;
            this.$emit(context.search_Item.qSelect.actionName, context.qSelect);
        },
        onRemove(){
            var context = this;
            this.$emit("onRemove", 
            context.search_Item);
        }
    }
}
</script>
