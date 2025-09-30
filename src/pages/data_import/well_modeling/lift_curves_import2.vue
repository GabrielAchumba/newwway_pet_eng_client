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
          />
          <q-btn 
            color="accent" 
            label="Submit" 
            @click="submitFile"
            class="text-forecolor2"
            :disabled="!fileContent.length"
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
          />
        </div>
      </div>
      
      <q-list class="file-content-list bg-card-bg rounded-borders" dense>
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
        <q-item v-if="!fileContent.length" class="text-center text-forecolor1">
          <q-item-section>
            <q-icon name="description" size="48px" color="secondary" class="q-mb-sm" />
            <div>No file selected. Click "Browse" to select a .tpd file.</div>
          </q-item-section>
        </q-item>
      </q-list>
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
  name: 'TPDFileViewer2',
  data() {
    return {
      filePath: '',
      fileContent: [],
      selectedLine: null,
      fileInfo: {
        name: '',
        size: 0,
        lastModifiedDate: null
      }
    }
  },
  methods: {
    browseFile() {
      // Trigger the hidden file input
      this.$refs.fileInput.click();
    },
    
    handleFileSelect(event) {
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
      this.readFileContent(file);
    },
    
    readFileContent(file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          // Split content by lines and filter out empty lines if needed
          this.fileContent = content.split('\n').filter(line => line.trim() !== '');
          
          this.$q.notify({
            color: 'positive',
            message: `Successfully loaded ${this.fileContent.length} lines`,
            icon: 'check_circle',
            position: 'top'
          });
        } catch (error) {
          console.error('Error reading file:', error);
          this.$q.notify({
            color: 'negative',
            message: 'Error reading file content',
            icon: 'error',
            position: 'top'
          });
        }
      };
      
      reader.onerror = () => {
        this.$q.notify({
          color: 'negative',
          message: 'Error reading file',
          icon: 'error',
          position: 'top'
        });
      };
      
      reader.readAsText(file);
    },
    
    submitFile() {
      if (!this.fileContent.length) {
        this.$q.notify({
          color: 'negative',
          message: 'No file content to submit',
          icon: 'warning'
        });
        return;
      }
      
      // Simulate file submission
      // In a real application, this would send the data to your backend
      console.log('Submitting file content:', this.fileContent);
      
      this.$q.notify({
        color: 'positive',
        message: 'File submitted successfully',
        icon: 'check',
        position: 'top'
      });
      
      // You could add actual API call here:
      // this.submitToBackend();
    },
    
    submitToBackend() {
      // Example of how you might submit to a backend
      /*
      this.$axios.post('/api/tpd-files', {
        filename: this.fileInfo.name,
        content: this.fileContent.join('\n')
      })
      .then(response => {
        this.$q.notify({
          color: 'positive',
          message: 'File uploaded successfully',
          icon: 'check'
        });
      })
      .catch(error => {
        this.$q.notify({
          color: 'negative',
          message: 'Upload failed',
          icon: 'error'
        });
      });
      */
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
      this.selectedLine = index;
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    copyToClipboard() {
      if (!this.fileContent.length) return;
      
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
        authStore.setStateData("pageTitle", "Import Wel - Lift Curves"); 
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
  scrollbar-width: thin; /*none;  Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border: 1px solid #e0e0e0;
}

.file-content-list::-webkit-scrollbar {
 display: block; /* none;   Chrome, Safari and Opera */
 width: 8px; /* Width of the scrollbar */
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
</style>