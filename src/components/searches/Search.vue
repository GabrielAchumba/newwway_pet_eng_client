<template>
    <div class="row no-wrap bg-accent">
       <!--  <q-btn class="bg-accent text-primary" icon="menu" unelevated outlined/>
        <q-input dense outlined square v-model="search" placeholder="Search" class="col bg-accent" />
        <q-btn class="bg-accent text-primary" icon="search" unelevated outlined/> -->
        
        
          <q-input class="q-ma-none bg-primary text-accent"
            outlined 
            v-model="search" 
            type="text">
            <template 
                v-slot:before>
                <q-icon name="menu" 
                class="bg-primary text-accent" />
            </template>
            <template 
                v-slot:append>
                <q-icon name="search" 
                class="bg-primary text-accent" />
            </template>
          </q-input>
    </div>
</template>

<script>

export default {
    data(){
        return {
            search: "",
        }
    }
}
</script>