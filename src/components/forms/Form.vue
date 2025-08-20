<template>
    <div>
        <!-- <q-scroll-area style="height: 80vh; max-width: 100%;"> -->
        <div class="row q-pa-none" :style="customStyle">
             <q-card class="col-12 bg-primary">
                <q-bar 
                v-if="isFormTitle"
                class="bg-info text-primary">
                    <div class="text-center">{{ formData.title }}</div>
                    <q-space/>
                    <q-btn 
                    v-if="isCloseForm"
                    dense flat icon="close" class="bg-info text-primary" @click="closeFormDialog"/>
                </q-bar>

                <q-separator />

                <!-- <q-card-section> -->

                   <q-form class="q-pa-none">

                     <div
                     class="q-pa-sm"
                      v-for="qToggle in formData.qToggles" 
                      :key="qToggle.label">
                       <q-toggle
                        v-if="qToggle.visible"
                        :label="qToggle.label"
                        v-model="qToggle.name"
                        color="accent"
                        false-value="Disagreed"
                        true-value="Agreed"
                        @input="onToggle"
                      />
                     </div>

                    <div
                      class="q-pa-sm"
                      v-for="qSelect in formData.qSelects" 
                      :key="qSelect.label">
                      <span v-if="qSelect.visible">
                        <p class="q-ma-none">{{ qSelect.label }}</p>
                      <q-select
                        class="q-ma-none"
                        color="accent" 
                        outlined label-color="accent"
                        option-disable="inactive"
                        v-model="qSelect.value"
                        :options="qSelect.list"
                        option-value="id"
                        :option-label="'type'"
                        name="type"
                        emit-value
                        map-options
                        @input="onQSelectItemValueChanged(qSelect)"
                        >
                      </q-select></span>
                    </div>

                    <div
                      class="q-pa-sm"
                      v-for="GroupedCheckBox in formData.GroupedCheckBoxes" 
                      :key="GroupedCheckBox.label">
                      <q-expansion-item
                        v-if="GroupedCheckBox.isGroupedCheckBox"
                          class="col-12 q-pa-sm bg-primary text-accent"
                          v-model="GroupedCheckBox.isExpanded"
                          :label="GroupedCheckBox.label"
                          dense
                          dense-toggle
                          expand-separator>
                          <!-- <q-scroll-area
                            :visible="visible"
                            style="height: 350px;" 
                          > -->
                            <q-option-group
                              class="text-accent bg-primary"
                              :options="GroupedCheckBox.list"
                              type="checkbox"
                              v-model="GroupedCheckBox.group"
                              @input="GroupedCheckBoxClicked"
                              color="accent"
                            />
                          <!-- </q-scroll-area> -->
                      </q-expansion-item>
                    </div>


                    <div
                      class="q-pa-sm"
                      v-for="table in formData.tables" 
                      :key="table.id">
                      <TableEditable
                      :table_VM="table"
                      @cellButtonAction="cellButtonAction($event)"
                      @setCellBackground="setCellBackground($event)"
                      @importCollection="importCollection"/>
                    </div>

                    <div class="q-pa-sm"
                      v-for="qParagraph in formData.qParagraphs" 
                      :key="qParagraph.label">
                      <div class="row">
                        <!-- <p class="col-12 q-pa-md">{{ qParagraph.label }}:</p> -->
                        <div class="col-12 q-pa-sm text-center text-h5" >{{ qParagraph.title }}</div>
                        <p class="col-12 q-pa-sm" style="white-space: pre-line">{{ qParagraph.name }}</p>
                      </div>
                    </div>

                    <div class="q-pa-sm"
                      v-for="qLink in formData.qLinks" 
                      :key="qLink.label">
                      <div class="row">
                       
                       <!-- <div class="col-12">
                         <q-pdfviewer
                          v-model="show"
                          type="pdfjs"
                          :src="pdfUrl(qLink.href)"
                          content-class="absolute"
                        />
                       </div> -->

                         <!--  <embed 
                          class="col-12"
                          style="height:60vh"
                          id="pdfframe" :src="pdfUrl(qLink.href)"
                          /> -->

                          <embed 
                          class="col-12"
                          style="height:100vh"
                          id="pdfframe" :src="pdfUrl(qLink.href)"
                          />

    <!-- 
                        <iframe
                          ref="myFrame"
                          class="col-12 q-pa-sm"
                          style="height:800px;"
                          :src="pdfUrl(qLink.href)"/> -->
                        <!-- <div id="pdf"
                        class="col-12 q-pa-sm">
                            <object 
                            width="100%" 
                            height="650" 
                            type="application/pdf" 
                            :data="pdfUrl(qLink.href)" 
                            id="pdf_content" 
                            style="pointer-events: none;">
                                <p>Insert your error message here, if the PDF cannot be displayed.</p>
                            </object>
                        </div> -->
                        <!-- <a class="col-12 q-pa-sm" :href="qLink.href" :target="qLink.target">
                          {{ qLink.label }}
                          </a> -->
                      </div>
                    </div>

                    <div class="q-pa-sm"
                      v-for="qImage in formData.qImages" 
                      :key="qImage.label">
                      <div class="row">
                       <div class="col-12 q-pa-sm img">
                        <q-img 
                            :src="qImage.imageUrl"
                            spinner-color="accent"
                            class="rounded-borders"/>
                      </div>
                      </div>
                    </div>

                    <div class="q-pa-sm"
                      v-for="qInput in formData.qInputs" 
                      :key="qInput.label">
                      <span
                      v-if="qInput.visible">
                      <p class="q-ma-none">{{ qInput.label }}</p>
                      <q-input class="q-ma-none bg-primary text-accent" 
                      outlined
                      v-model="qInput.name" 
                      :type="qInput.type" >
                          <template 
                            v-if="qInput.Template.visible" 
                            v-slot:append>
                            <q-icon :name="qInput.Template.iconName" 
                            class="bg-primary text-accent"
                            @click="qInputTemplateAction(qInput.Template)"/>
                          </template>
                      </q-input></span>
                    </div>

                    <div class="q-pa-sm"
                      v-for="qEditor in formData.qEditors" 
                      :key="qEditor.label">
                      <span><p class="q-ma-none">{{ qEditor.label }}</p>
                      <q-editor class="q-ma-none"
                      min-height="5rem"
                      v-model="qEditor.name"
                      :dense="qEditor.dense"
                      :toolbar="[
                        [
                          {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            list: 'only-icons',
                            options: ['left', 'center', 'right', 'justify']
                          },
                          {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            options: ['left', 'center', 'right', 'justify']
                          }
                        ],
                        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                        ['token', 'hr', 'link', 'custom_btn'],
                        ['print', 'fullscreen'],
                        [
                          {
                            label: $q.lang.editor.formatting,
                            icon: $q.iconSet.editor.formatting,
                            list: 'no-icons',
                            options: [
                              'p',
                              'h1',
                              'h2',
                              'h3',
                              'h4',
                              'h5',
                              'h6',
                              'code'
                            ]
                          },
                          {
                            label: $q.lang.editor.fontSize,
                            icon: $q.iconSet.editor.fontSize,
                            fixedLabel: true,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                              'size-1',
                              'size-2',
                              'size-3',
                              'size-4',
                              'size-5',
                              'size-6',
                              'size-7'
                            ]
                          },
                          {
                            label: $q.lang.editor.defaultFont,
                            icon: $q.iconSet.editor.font,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                              'default_font',
                              'arial',
                              'arial_black',
                              'comic_sans',
                              'courier_new',
                              'impact',
                              'lucida_grande',
                              'times_new_roman',
                              'verdana'
                            ]
                          },
                          'removeFormat'
                        ],
                        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                        ['undo', 'redo'],
                        ['viewsource']
                      ]"
                      :fonts="{
                        arial: 'Arial',
                        arial_black: 'Arial Black',
                        comic_sans: 'Comic Sans MS',
                        courier_new: 'Courier New',
                        impact: 'Impact',
                        lucida_grande: 'Lucida Grande',
                        times_new_roman: 'Times New Roman',
                        verdana: 'Verdana'
                      }">
                      </q-editor></span>
                    </div>

                    <div class="q-pa-sm text-left"
                      v-for="qFile in formData.qFiles" 
                      :key="qFile.label">
                      <span>
                        <p class="q-ma-none">{{ qFile.label }}</p>
                          <q-input class="q-ma-none"
                          @change="onFileSelected"
                          outlined 
                          v-model="qFile.name" 
                          :type="qFile.type">
                          </q-input>
                      </span>

                      <div class="row">
                        <div
                        class="q-pa-sm col-12 text-left"
                        v-if="qFile.showTextFilePreview">
                          <p class="text-left q-pa-sm">{{ qFile.imagePreview }}</p>
                        </div>
                         <embed 
                         class="q-pa-sm col-12"
                           v-show="qFile.showDocumentPreview"
                          :src="qFile.imagePreview"
                          />
                          <q-img 
                              v-bind:src="qFile.imagePreview" 
                              v-show="qFile.showPreview"
                              spinner-color="accent"
                              class="rounded-borders q-pa-sm col-12"/>
                        <div class="col-12 q-pa-sm">
                          <video 
                          id="video-preview" 
                          v-bind:src="qFile.imagePreview" 
                          controls 
                          autoplay controlsList="nodownload" oncontextmenu="return false;"
                          v-show="qFile.showVideoPreview"/>
                        </div>
                      </div>
                    </div>


                    <div class="q-pa-sm"
                      v-for="qColor in formData.qColors" 
                      :key="qColor.label">
                      <span><p class="q-ma-none">{{ qColor.label }}</p>
                      <q-input class="q-ma-none"
                      @change="onColorSelected"
                      outlined 
                      v-model="qColor.name" 
                      :type="qColor.type" >
                      </q-input></span>
                    </div>

                    <div
                      class="q-pa-md"
                      v-for="qDate in formData.qDates" 
                      :key="qDate.label">
                      <span><p class="q-ma-none">{{ qDate.label }}</p>
                      <q-input 
                      class="q-ma-none"
                      filled 
                      v-model="qDate.name" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="qDate.name">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="accent" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input></span>
                    </div>

                    <div  
                     v-for="qList in formData.qLists" 
                    :key="qList.label"
                    class="q-pa-sm">
                     <span>
                        <q-input class="q-ma-none bg-primary text-accent"
                        outlined 
                        bordered
                        v-model="qList.listBoxSearchModel" 
                        type="text" >
                        <template v-slot:prepend>
                          <q-icon 
                          v-if="qList.isAddVisible"
                          name="add" 
                          @click="qListAddItemAction(qList)"/>
                        </template>
                            <template  
                              v-slot:append>
                              <q-icon name="search" 
                              class="bg-primary text-accent"
                              @click="qListTemplateAction(qList)"/>
                            </template>
                        </q-input>

                        <q-list
                        bordered>
                          <q-item  
                          v-for="item in qList.items" 
                          :key="item.label"
                          class="q-pa-sm" 
                          clickable 
                          v-ripple
                          @click="listBoxItemClickAction(item)">
                            <!-- <q-item-section avatar>
                              <q-avatar color="accent" text-color="primary" size="md" square>
                                {{ item.letter }}
                              </q-avatar>
                            </q-item-section> -->

                            <q-item-section>
                              <q-item-label v-html="item.name"></q-item-label>
                              <q-item-label caption v-html="item.address"></q-item-label>
                            </q-item-section>

                            <q-item-section side top>
                              <q-icon 
                              v-if="qList.isMenuListVisible"
                              name="more_vert" 
                              color="accent">
                              <q-menu fit>
                                <q-list dense class="text-accent text-caption bg-primary">
                                    <q-item
                                    v-for="qBtn in qList.qBtns" 
                                    :key="qBtn.label"
                                    class="bg-primary text-accent"
                                    clickable
                                    @click="ListItemHandler(qBtn.name, item)">
                                        <q-item-section>
                                            {{ qBtn.label }}
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                </q-menu>
                              </q-icon>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </span>

                    </div>
                  </q-form>

               <!--  </q-card-section> -->

                 <!-- <q-separator /> -->

                   <div 
                   v-if="rightDrawerOpen"
                   class="row q-pa-sm">
                      <!-- <q-space /> -->
                      <div 
                        v-for="qBtn in formData.qBtns" 
                        :key="qBtn.label"
                        class="col-12 text-center q-pa-sm">
                        <q-btn 
                        v-if="qBtn.isError"
                        class="bg-secondary text-primary"
                        style="width:95%"
                        :label="qBtn.label"
                        :disabled="qBtn.btnDisabled"
                        type="button"
                        no-caps
                        @click="ClickAction(qBtn.name, formData)"
                      >  
                        <q-menu 
                          v-if="qBtn.isShowMenuList"
                          fit>
                          <Menu
                          :menuList="qBtn.list"
                          @subMenuItemEvent="subMenuItemEvent"/>
                        </q-menu>
                      </q-btn>
                      <q-btn 
                        v-else
                        class="bg-info text-primary"
                        style="width:95%"
                        :label="qBtn.label"
                        :disabled="qBtn.btnDisabled"
                        type="button"
                        no-caps
                        @click="ClickAction(qBtn.name, formData)"
                      >
                        <q-menu 
                          v-if="qBtn.isShowMenuList"
                          fit>
                          <Menu
                          :menuList="qBtn.list"
                          @subMenuItemEvent="subMenuItemEvent"/>
                        </q-menu>
                      </q-btn>
                      </div>
                  </div>

                  <div 
                   v-if="!rightDrawerOpen"
                   class="row q-pa-sm">
                      <q-space />
                      <div 
                        v-for="qBtn in formData.qBtns" 
                        :key="qBtn.label"
                        class="text-center q-pa-sm">
                        <q-btn 
                        v-if="qBtn.isError"
                        class="bg-secondary text-primary"
                        :label="qBtn.label"
                        :disabled="qBtn.btnDisabled"
                        type="button"
                        no-caps
                        @click="ClickAction(qBtn.name, formData)"
                      >  
                        <q-menu 
                          v-if="qBtn.isShowMenuList"
                          fit>
                          <Menu
                          :menuList="qBtn.list"
                          @subMenuItemEvent="subMenuItemEvent"/>
                        </q-menu>
                      </q-btn>
                      <q-btn 
                        v-else
                        class="bg-info text-primary"
                        style="width:95%"
                        :label="qBtn.label"
                        :disabled="qBtn.btnDisabled"
                        type="button"
                        no-caps
                        @click="ClickAction(qBtn.name, formData)"
                      >
                        <q-menu 
                          v-if="qBtn.isShowMenuList"
                          fit>
                          <Menu
                          :menuList="qBtn.list"
                          @subMenuItemEvent="subMenuItemEvent"/>
                        </q-menu>
                      </q-btn>
                      </div>
                  </div>

                  <div 
                   class="row q-pa-sm">
                    <div class="col-12 q-pa-sm"
                        v-for="qFab in formData.qFabs" 
                        :key="qFab.label">
                      <q-fab
                        v-model="qFab.activate"
                        :label="qFab.label"
                        :vertical-actions-align="qFab.verticalActionsAlign"
                        color="accent"
                        padding="none xl"
                        icon="keyboard_arrow_down"
                        direction="up"
                      >
                        <q-fab-action
                        v-for="qFabAction in qFab.qFabActions" 
                        :key="qFabAction.label" 
                        color="accent" 
                        @click="onFabActionClick(qFabAction)" 
                        :icon="qFabAction.icon" 
                        :label="qFabAction.label" />
                      </q-fab>
                    </div>
                   </div>
                

             </q-card>
        </div>
        <!-- </q-scroll-area> -->
    </div>
</template>

<script>
    /* import { fromPath } from "pdf2pic";

    const options = {
      density: 100,
      saveFilename: "untitled",
      savePath: "./images",
      format: "png",
      width: 600,
      height: 600
    }; */

    import { form } from "./FormVM";
    import ContextMenu from "../menus/context-menu.vue";
    import ContextMenuItem from "../menus/context-menu-item.vue";
    import TableEditable from "../tables/TableEditable.vue";
    import Menu from "../menus/Menu.vue";

    export default {
        computed:{
          /* setIsResponsive(){
            const width = window.innerWidth;
            if(width < 700) return true;
            else return false;
          }, */
          listBoxStyle(){
              const width = window.innerWidth - 20;
              return {
              //height: `100vh`,
              width: `${width}px`,
              }
          },
        },
        components:{
          ContextMenu,
          ContextMenuItem,
          TableEditable,
          Menu
        },
        props: {
            isFormTitle:{
              type: Boolean,
              default: true
            },
            isResponsive:{
              type: Boolean,
              default: false
            },
            formData: {
              type: Object,
              default: form,
            },
            visible: {
              type: Boolean,
              default: true,
            },
            setIsResponsive:{
              type: Boolean,
              default: false,
            },
            isCloseForm:{
              type: Boolean,
              default: false,
            },
            rightDrawerOpen: {
                type: Boolean,
                default: false
            },
            customStyle: {
              type: String,
              default: "max-height:80vh;"
            }
        },
        data(){
          return {
            show: true,
            listBoxSearchTemplate:{ sn: 0, iconName: "search", visible: true},
            borderless: false,
          }
        },
        methods: {
          linkClick(row){
            this.$emit("linkClick", row)
          },
          onEmbededContextMenu(e){
            alert("cannot save");
            return false; 
           
          },
          pdfUrl(fileUrl){
          
            // return //`${fileUrl}#zoom=85&toolbar=0&navpanes=0`
            /* const pageToConvertAsImage = 1;
            const isBase64 = true;
            const res = fromPath(filePath, options).convert(pageToConvertAsImage, isBase64);
            console.log("res: ", res) */
            

            //`${fileUrl}#zoom=85&toolbar=0&navpanes=0`

            return `${fileUrl}#zoom=85&toolbar=0&navpanes=0`
          },
          onToggle(event){
            this.$emit("onToggle", event);
          },
          onFileSelected(event){
            //let video = document.getElementById('video-preview');
            console.log("event: ", event)
            var files = event.target.files;
            var selectedFile = files[0];
            console.log("selectedFile: ", selectedFile)

              this.$emit("onFileSelected", {
                selectedFile,
              })

              this.$emit("onFileSelected2", {
                selectedFile,
              })

                
          },
          onColorSelected(){

          },
          onQSelectItemValueChanged(qSelect){
            console.log("qSelect.actionName: ", qSelect.actionName)
            this.$emit(qSelect.actionName, qSelect);
          },
          cellButtonAction(payload){
            this.$emit(payload.actionName, payload);
          },
          setCellBackground(payload){
            this.$emit("setCellBackground", payload);
          },
          ClickAction(actionName, formData){
              var context = this;
              if(context.btnDisabled === true)context.btnDisabled = false;
              else context.btnDisabled = true;
              this.$emit(actionName, formData);
          },
          qInputTemplateAction(payload){
            this.$emit("qInputTemplateAction", payload);
          },
          qListTemplateAction(payload){
            this.$emit("qListTemplateAction", payload);
          },
          qListAddItemAction(payload){
            this.$emit("qListAddItemAction", payload);
          },
          handleAddEditableTable(payload) {
            this.$emit(payload.handleAddName, payload);
          },
          handleSubmitEditableTable(payload) {
            this.$emit(payload.tableVM.handleSubmitName, payload);
          },
          handleEditEditableTable(payload) {
            this.$emit(payload.tableVM.handleEditName, payload);
          },
          handleDeleteEditableTable(payload) {
            this.$emit(payload.tableVM.handleDeleteName, payload);
          },
          ListItemHandler(actionName, qListItem){
            console.log("actionName: ", actionName)
            console.log("qListItem: ", qListItem)
            this.$emit(actionName, qListItem);
          },
          disableRightclick(evt){
            var context = this;
            console.log("evt")
            if(evt.button == 2){
                return false;    
            }
          },
          closeFormDialog(){
            this.$emit("closeFormDialog")
          },
        subMenuItemEvent(payload){
          this.$emit(payload.dialogActionName)

            /* if(payload.isDialog){
                this.$emit(payload.dialogActionName)
            }else{
                this.$store.commit('authenticationStore/AddOutputTab', {
                    name: payload.name,
                    route: payload.route
                });
                this.$store.commit("authenticationStore/ToggleRibbonVisibility");
            } */
        },
        listBoxItemClickAction(payload){
          this.$emit("listBoxItemClickAction", payload);
        },
        GroupedCheckBoxClicked(evt){
          console.log("evt: ", evt)
            this.$emit("groupedCheckBoxClicked", evt);
        },
        onFabActionClick(qFabAction){
          this.$emit("onFabActionClick", qFabAction);
        },
        importCollection(){
          this.$emit("importCollection")
        }
        },
        created(){
          var context = this;
         //window.addEventListener("mousedown", this.disableRightclick);
        }
    }
</script>

<style>
        .embed-cover {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        
          opacity: 0.25;
        }

        .wrapper {
          position: relative;
          /* overflow: hidden;
          overscroll-behavior: contain; */
        }

  .pdf-container {
    display: none;
  }
a:link, a:visited {
  background-color: white;
  color: black;
  border: 2px solid green;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

a:hover, a:active {
  background-color: green;
  color: white;
}

img {
    max-width: 100%;
    max-height: 100%;
}

video{
		max-width: 100%;
    max-height: 100%;
}
</style>
