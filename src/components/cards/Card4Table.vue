<template>
  <div class="bg-primary">
        <div class="row text-center bg-primary flex flex-center">
            
            <div 
            v-for="(row) in rows" :key="row.id"
            class="col-12 q-pa-sm">
                <q-card>
                    <q-list dense>
                    <q-item v-for="col in columns.filter(col => col.name == 'actions')" :key="col.name">
                        <q-item-section side>
                            <q-btn
                                icon="menu"
                                flat
                                dense>
                                <q-menu fit>
                                <q-list dense class="text-accent text-caption bg-primary">
                                    <q-item
                                    class="bg-primary text-accent"
                                    clickable
                                    @click="cardClickHandler(col)">
                                        <q-item-section>
                                            Edit
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                    class="bg-primary text-accent"
                                    clickable
                                    @click="cardClickHandler(col)">
                                        <q-item-section>
                                            Delete
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                </q-menu>
                            </q-btn>
                        </q-item-section>
                    </q-item>
                    <q-item v-for="col in columns.filter(col => col.name !== 'actions')" :key="col.name">
                        <q-item-section class="text-left">
                        <q-item-label>{{ col.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section class="text-right text-accent">
                        <q-item-label>{{ row[col.name] }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    </q-list>
                </q-card>
            </div>

          <!-- </div> -->
        </div>
  </div>
</template>

<script>

    export default {
      props: {
          theme_color: {
              type: String,
              default: '#10731f',
          },
          rows: {
              type: Array,
              default: [],
          },
          columns: {
              type: Array,
              default: [],
          },
          cardClickEvent: {
              type: String,
              default: "",
          }
      },
      data(){
        return {
          page: 1,
          currentPage:1,
          nextPage: null,
          totalPages:5,
        }
      },
      methods:{
        hoverOver: function(index) {
          this['about_heading_color_' + index] = this.theme_color;
          this['about_heading_' + index] = ['animated', 'bounceIn'];              
        },
        hoverOutTimeout: function(index) {
          this['about_heading_color_' + index] = '#424242';
          setTimeout(() => {
            this['about_heading_' + index] = [];                
          }, 1000);              
        },
        cardClickHandler(card) {
              this.$emit(card.name, card); 
        },
        viewItem(selectedItem){
          this.$emit("updateItem", selectedItem);
        },
      },
      created(){
        var context = this;
        /* context.totalPages = Math.ceil(context.cardList.length/3);
        if(context.totalPages <= 0){
          context.totalPages = 1;
        } */
      }
    }
</script>

<style>
</style>