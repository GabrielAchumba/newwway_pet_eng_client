import { defineStore } from 'pinia'

export const useComponentsStore = defineStore('componentsStore', {
  state: () => ({
    isPropertyGridActivated: false
  }),

  actions: {
    SetIsPropertyGridActivated(payload) {
      this.isPropertyGridActivated = payload;
    }
  }
});