<template>
  <q-drawer
    :model-value="expanded"
    side="left"
    bordered
    show-if-above
    class="bg-white"
  >
    <q-scroll-area class="fit q-pa-md">
      <!-- Logo -->
      <div class="flex flex-center q-mb-md">
        <img :src="logoImage" alt="Company Logo" style="height: 24px; object-fit: contain;" />
      </div>

      <!-- <q-separator spaced /> -->

      <!-- Menu Items -->
      <q-list padding>
        <q-item
          v-for="(item, index) in menuItems"
          :key="index"
          clickable
          v-ripple
          class="q-py-sm q-px-sm"
          @click="navigateTo(item.route)"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" color="secondary" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-body2 text-grey-9">{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoImage from 'src/assets/logo/Logo.png'

const router = useRouter()

// You can replace these with Quasar icon names or use custom SVGs if needed.
const menuItems = [
    {name: 'Planners Dashboard', icon: 'storage', route: '/planners-dashboard'},
    { name: 'Economics Dashboard', icon: 'storage', route: '/economics-dashboard' },
    { name: 'Operations Dashboard', icon: 'storage', route: '/operations-dashboard' },
    { name: 'Data', icon: 'storage', route: '/data-input' },
    { name: 'Project', icon: 'folder', route: '/'  },
    { name: 'Drilling Sequence', icon: 'layers', route: '/'  },
    { name: 'Production Network', icon: 'share', route: '/'  },
    { name: 'Reservoir Analysis', icon: 'bar_chart', route: '/'  },
    { name: 'Well Modeling', icon: 'track_changes', route: '/'  },
    { name: 'Business Forecast', icon: 'work', route: '/'  },
    { name: 'Settings', icon: 'settings', route: '/'  }
]

// Props
defineProps({
  expanded: {
    type: Boolean,
    required: true
  }
})

function navigateTo(route) {
  if (route) {
    router.push(route)
  }
}
</script>