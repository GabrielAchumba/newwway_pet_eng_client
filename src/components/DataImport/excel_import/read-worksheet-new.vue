<template>
  <div class="read-worksheet-page">
    <div class="q-pa-sm read-worksheet-card">
      <span v-if="qSelect.visible">
        <div class="row items-center q-col-gutter-md">

          <!-- File Upload -->
          <div class="col-12 col-md-3">
            <label class="custom-file-upload">
              <input
                type="file"
                @change="onFileSelected"
                id="upload"
              />
              <q-icon name="cloud_upload" size="sm" class="upload-icon" />
              <span class="upload-text">Browse File</span>
            </label>
          </div>

          <div class="col-12 col-md-3">
            <!-- <input
                type="text"
                @change="onExcelDataStartRowChanged"
              /> -->

            <q-input
                v-model="excelDataStartRow"
                filled
                label="Data Start Row"
                type="text"
                stack-label
              />
          </div>

          <!-- Label -->
          <div class="col-12 col-md-2">
            <p class="q-ma-sm label-text">{{ qSelect.label }}</p>
          </div>


          <!-- Select -->
          <div class="col-12 col-md-4">
            <NSelect
              :qSelect="qSelect"
              @onQSelectItemValueChanged="onQSelectItemValueChanged($event)"
            />
          </div>
        </div>
      </span>
    </div>
  </div>
</template>


<script>
import NSelect from "../../drop_down/n-select.vue";

export default {
  components: {
    NSelect
  },
  props: {
    qSelect: {
      type: Object,
      default: () => ({})
    }
  },
  data(){
    return {
      excelDataStartRow: 0,
    }
  },
  methods: {
    onQSelectItemValueChanged(_qSelect) {
      this.$emit("onQSelectItemValueChanged", _qSelect);
    },
    onFileSelected(event) {
      const files = event.target.files;
      const selectedFile = files[0];
      this.$emit("onFileSelected", { selectedFile });
    },
    // onExcelDataStartRowChanged(value) {
    //   this.$emit("onExcelDataStartRowChanged", value);
    // },
  },
  watch: {
    excelDataStartRow(val) {
      this.$emit("onExcelDataStartRowChanged", val);
    }
  }
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.read-worksheet-page {
  background-color: white;
  min-height: 100%;
  overflow-y: auto;

  /* Hide scrollbar but allow scroll */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
}

.read-worksheet-card {
  background-color: $primary;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 12px;
}

.label-text {
  font-weight: 600;
  font-size: 1rem;
  color: $secondary;
}

.custom-file-upload {
  background-color: $secondary;
  color: $primary;
  padding: 6px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust($secondary, $lightness: 10%);
  }

  input[type="file"] {
    display: none;
  }

  .upload-icon {
    margin-right: 6px;
    color: $primary;
  }

  .upload-text {
    white-space: nowrap;
  }
}
</style>