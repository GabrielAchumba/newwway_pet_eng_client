<template>
  <q-drawer
    side="left"
    bordered
    show-if-above
    class="bg-white auto-size-drawer hide-scrollbar"
    :width="leftDrawerWidth"
  >
  <!-- :model-value="expanded" -->
    <div class="drawer-inner column">

      <!-- Scrollable menu area -->
      <div class="menu-container q-pa-sm">
        <q-list 
        padding 
        class="menu-list column items-center">
          <q-item
            v-for="(item, index) in menuItems"
            :key="index"
            clickable
            v-ripple
            class="menu-item column items-center q-my-sm"
            @click="navigateTo(item.route)"
          >
            <q-icon
              :name="item.icon"
              color="secondary"
              :size="expanded ? '32px' : '20px'"
            />

            <q-item-label
              v-if="expanded"
              class="text-caption text-grey-9 q-mt-xs text-center"
            >
              <span v-for="(word, index) in splitLabel(item.name)" :key="index">
                {{ word }}<br v-if="index !== splitLabel(item.name).length - 1">
              </span>
            </q-item-label>

          </q-item>
        </q-list>
      </div>

      <!-- (optional) footer area — put logout / small controls here -->
      <!-- <div class="drawer-footer q-pa-sm">
      </div> -->
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import logoImage from 'src/assets/logo/Logo.png'

const router = useRouter()
const contentRef = ref(null)
const drawerWidth = ref(120) // measured width in px (number)

// configuration: tweak to your taste
const paddingForDrawer = 10     // extra px to add for spacing/padding
const minExpanded = 100        // minimum width when expanded
const minCollapsed = 48        // minimum width when collapsed (icons-only)
const maxWidth = 420           // max width clamp

const menuItems = [
  {name: 'Assets Group', icon: 'storage', route: '/asset-groups'},
  {name: 'Planners Dashboard', icon: 'storage', route: '/planners-dashboard'},
  {name: 'Economics Dashboard', icon: 'storage', route: '/economics-dashboard'},
  {name: 'Operations Dashboard', icon: 'storage', route: '/operations-dashboard'},
  {name: 'Assets', icon: 'storage', route: '/assets-landing'},
  {name: 'Data', icon: 'storage', route: '/data-input'},
  {name: 'DCA', icon: 'folder', route: '/dca-landing'},
  {name: 'Drilling Sequence', icon: 'layers', route: '/'},
  {name: 'Production Network', icon: 'share', route: '/'},
  {name: 'Reservoir Analysis', icon: 'bar_chart', route: '/'},
  {name: 'Well Modeling', icon: 'track_changes', route: '/'},
  {name: 'Business Forecast', icon: 'work', route: '/'},
  {name: 'Settings', icon: 'settings', route: '/'}
]

// defineProps({
//   expanded: {
//     type: Boolean,
//     required: true
//   }
// })

const props = defineProps({
  expanded: { type: Boolean, required: true },
  leftDrawerWidth: { type: Number, required: true }
})

function measureWidth() {
  if (!contentRef.value) return
  // get bounding width of the content (includes padding inside contentRef)
  const rect = contentRef.value.getBoundingClientRect()
  let measured = Math.ceil(rect.width) + paddingForDrawer

  // choose min depending on expanded state
  const min = props.expanded ? minExpanded : minCollapsed
  measured = Math.max(measured, min)
  measured = Math.min(measured, maxWidth)

  drawerWidth.value = measured
}

let ro = null
onMounted(() => {
  // measure after first render
  nextTick(() => measureWidth())

  // observe changes to content size
  if (window.ResizeObserver && contentRef.value) {
    ro = new ResizeObserver(() => measureWidth())
    ro.observe(contentRef.value)
  } else {
    // fallback: listen to window resize
    window.addEventListener('resize', measureWidth)
  }
})

// re-measure when expanded toggles (labels appear/disappear)
watch(() => props.expanded, async () => {
  await nextTick()
  measureWidth()
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  window.removeEventListener('resize', measureWidth)
})

function navigateTo(route) {
  if (route) {
    router.push(route)
  }
}

function formatLabel(name) {
  const words = name.trim().split(/\s+/)
  if (words.length === 2) {
    return `${words[0]}<br>${words[1]}`
  }
  return name
}

function splitLabel(name) {
  return name?.split(' ') || [];
}
</script>

<style scoped>

.auto-size-drawer .q-drawer__content {
  width: inherit !important;
}

.hide-scrollbar {
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrollbar */
}

/* Hide scrollbar for WebKit browsers (Chrome, Safari) */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* .drawer-content {
  display: inline-block;
} */

.drawer-inner {
  /* display: flex;
  flex-direction: column; */
  display: inline-block;
  width: max-content; /* ensures container fits content exactly */
  white-space: nowrap;
  flex: 0 0 auto; 
  height: 100%;  
}


/* make the drawer inner area a vertical flex layout */
.drawer-inner {
  /* display: flex;
  flex-direction: column; */
  display: inline-block;
  width: max-content; /* ensures container fits content exactly */
  white-space: nowrap;
  flex: 0 0 auto; 
  height: 100%;  
}

/* logo stays at top - no special styles required */

/* menu container grows and scrolls when content overflows */
.menu-container {
  display: inline-block;
  width: max-content; /* ensures container fits content exactly */
  white-space: nowrap;
  flex: 0 0 auto;              /* take remaining height */
  overflow-y: auto;            /* enable vertical scroll */
  -webkit-overflow-scrolling: touch;
  padding-right: 6px;          /* small right padding so items don't touch edge when scrollbar hidden */
   scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

/* hide scrollbar visually (works in modern browsers) */
.menu-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* item layout and transition */
/* .menu-item {
  width: 100%;
  max-width: 120px; 
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  user-select: none;
} */

.menu-item {
  width: fit-content;
  min-width: auto;
   /* width: fit-content !important; shrink to children */
  max-width: none !important;    /*  remove default constraints */
  align-items: center;
  justify-content: center;
  padding: 8px; /* optional */
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  user-select: none;
}


.menu-list {
  width: fit-content;
  padding: 0;
  /* gap: 4px;  spacing between items */
}

/* center icon + label */
.menu-item .q-icon {
  display: block;
  margin: 0 auto;
}

/* optional: hover/focus visual */
.menu-item:hover {
  transform: translateY(-2px);
}

/* footer (optional) */
.drawer-footer {
  flex: 0 0 auto;
  border-top: 1px solid rgba(0,0,0,0.04);
}
</style>