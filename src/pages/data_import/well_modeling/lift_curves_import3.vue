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
          <!-- Hidden file input -->
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

    <!-- Bottom Section - File Content -->
    <div class="file-content-container bg-primary q-px-md">
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

        <!-- Loading Spinner -->
        <q-inner-loading
          :showing="isLoading"
          label="Loading file content..."
          label-class="text-accent"
          label-style="font-size: 1.1em"
        >
          <q-spinner-gears
            size="50px"
            color="accent"
          />
        </q-inner-loading>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useAuthStore } from 'src/store/modules/authStore';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';

const authStore = useAuthStore();
const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();

export default {
  name: 'TPDFileViewer',
  data() {
    return {
      filePath: '',
      fileContent: [],
      selectedLine: null,
      fileInfo: {
        name: '',
        size: 0,
        lastModifiedDate: null
      },
      isLoading: false
    }
  },
  methods: {
    browseFile() {
      // Trigger the hidden file input
      this.$refs.fileInput.click();
    },
    updateLoader(_isLoading){
        var context = this;
        console.log(_isLoading)
        this.isLoading = _isLoading;
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check if it's a .tpd file
      if (!file.name.toLowerCase().endsWith('.tpd')) {
        this.$q.notify({
          color: 'negative',
          message: 'Please select a .tpd file',
          icon: 'warning',
          position: 'top'
        });
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

        var context = this;
      this.isLoading = true;
      
      // Use a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            // Split content by lines and filter out empty lines if needed
            this.fileContent = content.split('\n').filter(line => {

                context.updateLoader(true);
                const filteredResponse = line.trim() !== '';;
                return filteredResponse
            });
            
            // Simulate processing time for large files
            setTimeout(() => {
              this.isLoading = false;
              this.$q.notify({
                color: 'positive',
                message: `Successfully loaded ${this.fileContent.length} lines`,
                icon: 'check_circle',
                position: 'top'
              });
              resolve();
            }, 500);
            
          } catch (error) {
            console.error('Error reading file:', error);
            this.isLoading = false;
            this.$q.notify({
              color: 'negative',
              message: 'Error reading file content',
              icon: 'error',
              position: 'top'
            });
            reject(error);
          }
        };
        
        reader.onerror = () => {
          this.isLoading = false;
          this.$q.notify({
            color: 'negative',
            message: 'Error reading file',
            icon: 'error',
            position: 'top'
          });
          reject(new Error('File reading error'));
        };
        
        reader.readAsText(file);
      });
    },
    
    async submitFile() {
      if (!this.fileContent.length) {
        this.$q.notify({
          color: 'negative',
          message: 'No file content to submit',
          icon: 'warning'
        });
        return;
      }
      
      this.isLoading = true;
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate file submission
        console.log('Submitting file content:', this.fileContent);
        
        this.$q.notify({
          color: 'positive',
          message: 'File submitted successfully',
          icon: 'check',
          position: 'top'
        });
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: 'Error submitting file',
          icon: 'error',
          position: 'top'
        });
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
      // Reset the file input
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
        this.$q.notify({
          color: 'positive',
          message: 'Content copied to clipboard',
          icon: 'content_copy',
          position: 'top'
        });
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        this.$q.notify({
          color: 'positive',
          message: 'Content copied to clipboard',
          icon: 'content_copy',
          position: 'top'
        });
      });
    },
    
    isDataLine(line) {
      // Check if line contains numeric data (simplified check)
      return /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*$/.test(line.trim());
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

/* Custom color classes using your theme */
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

/* Loading spinner customization */
:deep(.q-inner-loading) {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}
</style>