import { defineStore } from 'pinia'

export const usePropertyGridStore = defineStore('propertyGridStore', {
  state: () => ({
    isPropertyGridActivated: false,
    wellSchematics: {
      name: "",
      categories: [
      {
        name: 'Geometry',
        properties: [
          { name: 'Hole Section', type: 'text', value: 'My Application', default: 'My Application', readonly: true },
          { name: 'Drill Pipes', type: 'text', value: '1.0.0', default: '1.0.0', readonly: true },
          { name: 'Deviation Survey', type: 'text', value: 'Gabriel Achumba', default: 'Gabriel Achumba', readonly: true }
        ]
      },
      {
        name: 'Fluid',
        properties: [
          { name: 'Drill Mud', type: 'select', value: 'Light', options: ['Light', 'Dark', 'System'], default: 'Light', readonly: true },
          { name: 'Mud PVT', type: 'color', value: '#1976D2', default: '#1976D2', readonly: true },
          { name: 'Others', type: 'number', value: 14, default: 14, readonly: true }
        ]
      },
      {
        name: 'Miscellaneous',
        properties: [
          { name: 'Operations', type: 'boolean', value: true, default: true, readonly: true },
          { name: 'Common', type: 'number', value: 100, default: 100, readonly: true },
        ]
      }
    ]
    }
  }),

  actions: {
    setStateData(variableName, variableValue) {
      this[variableName] = variableValue;
    },
    SetIsPropertyGridActivated(payload) {
      this.isPropertyGridActivated = payload;
    }
  }
});