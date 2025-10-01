<template>
  <q-page class="bg-primary">
    <!-- Top Section - File Controls -->
    <div class="row items-center q-pa-md bg-primary">
      <div class="col-grow">
        <q-input
          v-model="filePath"
          label="File Path"
          readonly
          outlined
          dense
          class="file-path-input"
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="folder" color="accent" />
          </template>
        </q-input>
      </div>
      <div class="col-auto q-pl-md">
        <q-btn-group rounded>
          <input
            ref="fileInput"
            type="file"
            accept=".tpd"
            style="display: none"
            @change="handleFileSelect"
          />
          <q-btn 
            color="secondary" 
            label="Browse" 
            @click="browseFile"
            class="text-forecolor2"
            :disabled="isLoading"
          />
          <q-btn 
            color="accent" 
            label="Submit" 
            @click="submitFile"
            class="text-forecolor2"
            :disabled="!fileContent.length || isLoading"
          />
        </q-btn-group>
      </div>
    </div>

    <!-- File Info Card -->
    <div v-if="fileInfo.name" class="q-px-md q-pb-md">
      <q-card class="bg-card-bg">
        <q-card-section class="q-pa-sm">
          <div class="row items-center">
            <div class="col">
              <div class="text-caption text-forecolor1">Selected File: {{ fileInfo.name }}</div>
              <div class="text-caption text-forecolor1">Size: {{ formatFileSize(fileInfo.size) }}</div>
              <div class="text-caption text-forecolor1">Last Modified: {{ fileInfo.lastModifiedDate ? fileInfo.lastModifiedDate.toLocaleString() : 'Unknown' }}</div>
            </div>
            <div class="col-auto">
              <q-btn 
                flat 
                round 
                icon="close" 
                color="negative" 
                size="sm"
                @click="clearFile"
                :disabled="isLoading"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="q-px-md q-pb-md">
      <q-banner :class="statusType" class="text-white rounded-borders">
        <template v-slot:avatar>
          <q-icon :name="statusIcon" />
        </template>
        {{ statusMessage }}
      </q-banner>
    </div>

    <!-- Bottom Section - File Content -->
    <div class="row">
      <div class="file-content-container bg-primary q-px-md col-md-6 col-sm-12 col-xs-12">
        <div class="row items-center q-pb-sm">
          <div class="col">
            <div class="text-h6 text-secondary">File Content</div>
          </div>
          <div class="col-auto">
            <q-badge color="accent" class="q-mr-sm">
              Lines: {{ fileContent.length }}
            </q-badge>
            <q-btn
              flat
              round
              icon="content_copy"
              color="secondary"
              size="sm"
              @click="copyToClipboard"
              title="Copy all content to clipboard"
              :disabled="!fileContent.length || isLoading"
            />
          </div>
        </div>
        
        <!-- Loading Overlay -->
        <div class="relative-position">
          <q-list 
            class="file-content-list bg-card-bg rounded-borders" 
            dense
            :class="{ 'loading-overlay': isLoading }"
          >
            <q-item 
              v-for="(line, index) in fileContent" 
              :key="index"
              class="file-line-item"
              :class="{ 
                'selected-line': selectedLine === index,
                'comment-line': line.trim().startsWith('#'),
                'header-line': line.trim() === 'TPDData'
              }"
              @click="selectLine(index)"
            >
              <q-item-section side>
                <div class="line-number text-forecolor1">{{ index + 1 }}</div>
              </q-item-section>
              <q-item-section>
                <div 
                  class="text-forecolor1 text-monospace line-content"
                  :class="{
                    'text-accent': line.trim().startsWith('#'),
                    'text-secondary font-weight-bold': line.trim() === 'TPDData',
                    'text-positive': isDataLine(line)
                  }"
                >{{ line }}</div>
              </q-item-section>
            </q-item>
            
            <!-- Empty state -->
            <q-item v-if="!fileContent.length && !isLoading" class="text-center text-forecolor1">
              <q-item-section>
                <q-icon name="description" size="48px" color="secondary" class="q-mb-sm" />
                <div>No file selected. Click "Browse" to select a .tpd file.</div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Custom Loading Spinner (Solution if Quasar spinner doesn't work) -->
          <div v-if="isLoading" class="custom-loading-overlay">
            <div class="custom-spinner-container">
              <div class="custom-spinner"></div>
              <div class="loading-text text-accent">{{ loadingMessage }}</div>
            </div>
          </div>

          <!-- Quasar Loading Spinner (keep as fallback) -->
          <!-- <q-inner-loading
            :showing="isLoading && useQuasarSpinner"
            :label="loadingMessage"
            label-class="text-accent"
            label-style="font-size: 1.1em"
          >
            <q-spinner-gears
              size="50px"
              color="accent"
            />
          </q-inner-loading> -->
        </div>
      </div>
      <div class="q-pa-md col-md-6 col-sm-12 col-xs-12">
        <div class="q-pa-md">
          <WellTypeSelector 
            @well-type-changed="handleWellTypeChange"
          />
        </div>
        <div class="q-pa-md">
          <SensitivityVariablesTable
            @value-changed="handleSensitivityChange"
          />
        </div>
        
      </div>
    </div>
  </q-page>
</template>

<script>
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { useAssetGroupsStore } from 'src/store/modules/assetGroupsStore';
import { createLiftCurves} from 'src/api_services/well_modeling';
import SensitivityVariablesTable from './sensitivity_variables.vue';
import WellTypeSelector from './well_type_selector.vue'

// Import Quasar components explicitly
import { QSpinnerGears, QInnerLoading } from 'quasar';

const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();
const assetGroupsStore = useAssetGroupsStore();

export default {
  name: 'TPDFileViewer',
  components: {
    QSpinnerGears,
    QInnerLoading,
    SensitivityVariablesTable,
    WellTypeSelector
  },
  data() {
    return {
      filePath: '',
      fileContent: [],
      SensitivityVariable1Name: 'Water Cut',
      SensitivityVariable2Name: 'Gas Oil Ratio',
      SensitivityVariable3Name: 'First Node Pressure',
      wellType: 'Oil Producer',
      selectedLine: null,
      fileInfo: {
        name: '',
        size: 0,
        lastModifiedDate: null
      },
      isLoading: false,
      loadingMessage: 'Loading file content...',
      statusMessage: '',
      statusType: 'bg-positive',
      statusIcon: 'info',
      useQuasarSpinner: false // Set to false to use custom spinner
    }
  },
  methods: {
    handleWellTypeChange(selectedValue) {
      console.log('Selected Well Type:', selectedValue)
      this.wellType = selectedValue;
      // Handle the well type change here
      // You can make API calls, update state, etc.
    },
    handleSensitivityChange(eventData) {
      console.log('Sensitivity variable changed:', eventData)

      switch(eventData.variable){
        case 'Sensitivity Variable 1':
          this.SensitivityVariable1Name = eventData.newValue;
          console.log("this.SensitivityVariable1Name :", this.SensitivityVariable1Name);
          break;
        case 'Sensitivity Variable 2':
          this.SensitivityVariable2Name = eventData.newValue;
          console.log("this.SensitivityVariable2Name :", this.SensitivityVariable2Name);
          break;
        case 'Sensitivity Variable 3':
          this.SensitivityVariable3Name = eventData.newValue;
          console.log("this.SensitivityVariable3Name :", this.SensitivityVariable3Name);
          break;
      }

    },
    browseFile() {
      this.$refs.fileInput.click();
    },
    
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.name.toLowerCase().endsWith('.tpd')) {
        this.showStatus('Please select a .tpd file', 'negative', 'warning');
        return;
      }
      
      this.fileInfo = {
        name: file.name,
        size: file.size,
        lastModifiedDate: file.lastModified ? new Date(file.lastModified) : null
      };
      
      this.filePath = file.name;
      await this.readFileContent(file);
    },
    
    async readFileContent(file) {
      this.isLoading = true;
      this.loadingMessage = 'Reading file content...';
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            this.fileContent = content.split('\n').filter(line => line.trim() !== '');
            
            setTimeout(() => {
              this.isLoading = false;
              this.showStatus(`Successfully loaded ${this.fileContent.length} lines`, 'positive', 'check_circle');
              resolve();
            }, 500);
            
          } catch (error) {
            console.error('Error reading file:', error);
            this.isLoading = false;
            this.showStatus('Error reading file content', 'negative', 'error');
            reject(error);
          }
        };
        
        reader.onerror = () => {
          this.isLoading = false;
          this.showStatus('Error reading file', 'negative', 'error');
          reject(new Error('File reading error'));
        };
        
        reader.readAsText(file);
      });
    },
    
    async submitFile() {
        const AssetGroupId = assetGroupsStore.selectedAssetGroup.id;
        console.log("AssetGroupId: ", AssetGroupId);
        const drainagePointId = assetGroupsStore.activeDrainagePoint.id;
        const now = new Date();
        const liftCurveName = `${assetGroupsStore.activeDrainagePoint.assetGroupName}_${now.toISOString()}`;
        console.log("assetGroupsStore.activeDrainagePoint: ", assetGroupsStore.activeDrainagePoint);
        console.log("liftCurveName: ", liftCurveName);

      if (AssetGroupId == -1) {
        this.showStatus('No asset group selected', 'negative', 'warning');
        return;
      }

      if (drainagePointId == -1) {
        this.showStatus('No drainage point selected', 'negative', 'warning');
        return;
      }

      const payload = {  
            liftCurvesFileContent: this.fileContent,
            drainagePointId,
            AssetGroupId,
            liftCurveName,
            SensitivityVariable1Name: this.SensitivityVariable1Name,
            SensitivityVariable2Name: this.SensitivityVariable2Name,
            SensitivityVariable3Name: this.SensitivityVariable3Name,
            wellType: this.wellType
        }

        console.log(payload)

      if (!this.fileContent.length) {
        this.showStatus('No file content to submit', 'negative', 'warning');
        return;
      }
      
      this.isLoading = true;
      this.loadingMessage = 'Submitting file...';
     
      
      try {
        

        const response = await createLiftCurves(payload);
        
        console.log('Submitting file content:', response);
        this.showStatus('File submitted successfully', 'positive', 'check');
      } catch (error) {
        this.showStatus('Error submitting file', 'negative', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    clearFile() {
      this.filePath = '';
      this.fileContent = [];
      this.fileInfo = {
        name: '',
        size: 0,
        lastModifiedDate: null
      };
      this.selectedLine = null;
      this.statusMessage = '';
      this.$refs.fileInput.value = '';
    },
    
    selectLine(index) {
      if (!this.isLoading) {
        this.selectedLine = index;
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    copyToClipboard() {
      if (!this.fileContent.length || this.isLoading) return;
      
      const text = this.fileContent.join('\n');
      navigator.clipboard.writeText(text).then(() => {
        this.showStatus('Content copied to clipboard', 'positive', 'content_copy');
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showStatus('Content copied to clipboard', 'positive', 'content_copy');
      });
    },
    
    isDataLine(line) {
      return /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*$/.test(line.trim());
    },
    
    showStatus(message, type = 'info', icon = 'info') {
      this.statusMessage = message;
      this.statusType = this.getStatusClass(type);
      this.statusIcon = icon;
      
      if (type === 'positive') {
        setTimeout(() => {
          if (this.statusMessage === message) {
            this.statusMessage = '';
          }
        }, 5000);
      }
    },
    
    getStatusClass(type) {
      const classes = {
        positive: 'bg-positive',
        negative: 'bg-negative',
        warning: 'bg-warning',
        info: 'bg-info'
      };
      return classes[type] || 'bg-info';
    }
  },
  async created() {
    var context = this;
    authStore.setStateData("showSpinner", false);
    authStore.setStateData("isError", false);
    authStore.setStateData("errorMessages", "");
    authStore.setStateData("pageTitle", "Import Well - Lift Curves"); 
    propertyGridStore.SetIsPropertyGridActivated(false);
    assetsExplorerStore.SetIsAssetsExplorerActivated(true);
  }
}
</script>

<style scoped>
.file-path-input {
  max-width: 500px;
}

.file-content-container {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.file-content-list {
  height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  -ms-overflow-style: none;
  border: 1px solid #e0e0e0;
  position: relative;
}

.file-content-list.loading-overlay {
  opacity: 0.6;
  pointer-events: none;
}

.file-content-list::-webkit-scrollbar {
  display: block;
  width: 8px;
}

.file-content-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.file-content-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.file-content-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.file-line-item {
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  min-height: 32px;
  padding: 4px 8px;
}

.file-line-item:hover {
  background-color: #f8f9fa;
}

.selected-line {
  background-color: #F8FAFC !important;
  border-left: 3px solid #E2372D;
}

.comment-line {
  background-color: #f8f9fa;
}

.header-line {
  background-color: #e3f2fd;
}

.line-number {
  min-width: 40px;
  text-align: right;
  font-size: 0.8rem;
  opacity: 0.7;
}

.line-content {
  font-size: 0.85rem;
  word-break: break-all;
}

.text-monospace {
  font-family: 'Courier New', monospace;
}

.relative-position {
  position: relative;
}

/* Custom Loading Spinner Styles */
.custom-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  z-index: 1000;
}

.custom-spinner-container {
  text-align: center;
  padding: 20px;
}

.custom-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #E2372D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-text {
  font-size: 1.1em;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Status banner styles */
.bg-positive {
  background-color: #21BA45 !important;
}

.bg-negative {
  background-color: #E2372D !important;
}

.bg-warning {
  background-color: #F2C037 !important;
}

.bg-info {
  background-color: #31CCEC !important;
}

/* Custom color classes */
:deep(.text-forecolor1) {
  color: #475569;
}

:deep(.text-forecolor2) {
  color: white;
}

:deep(.bg-card-bg) {
  background-color: #F0F4F8;
}

:deep(.bg-primary) {
  background-color: #FFFFFF;
}

:deep(.text-secondary) {
  color: #0A1D3F;
}

:deep(.text-accent) {
  color: #E2372D;
}

:deep(.text-positive) {
  color: #21BA45;
}

:deep(.text-negative) {
  color: #E2372D;
}

/* Quasar loading spinner customization */
:deep(.q-inner-loading) {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}
</style>