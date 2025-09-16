const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/economics-dashboard', component: () => import('pages/dashboards/EconomicsDashbaord.vue')},
      { path: '/operations-dashboard', component: () => import('pages/dashboards/OperationsDashboard.vue')},
      { path: '/planners-dashboard', component: () => import('pages/dashboards/PlannerDashboard.vue')},
      { path: '/data-input', component: () => import('pages/data_input/DataEntryPage.vue')},
      { path: '/well-datum-input', component: () => import('src/pages/data_input/drilling/datum2.vue')},
      { path: '/import-well-names', component: () => import('src/pages/data_import/subsurface_assets/import_subsurface_assets.vue')},
      { path: '/assets-landing', component: () => import('src/pages/assets/landing.vue')},
      { path: '/import-subsurface-assets', component: () => import('src/pages/data_import/subsurface_assets/import_subsurface_assets.vue')},
      { path: '/subsurface-assets-landing', component: () => import('src/pages/visualization/DrillingWellSchematics.vue')},
      { path: '/drilling-well-schematics', component: () => import('src/pages/visualization/DrillingWellSchematics.vue')},
      { path: '/dca-landing', component: () => import('src/pages/decline_curve_analysis/landing.vue')},
      { path: '/dca-options', component: () => import('src/pages/decline_curve_analysis/dca_options.vue')},
      { path: '/dca-simulation', component: () => import('src/pages/decline_curve_analysis/dca_simulation.vue')},
      { path: '/dca-prediction-parameters', component: () => import('src/pages/decline_curve_analysis/dca_prediction_parameters.vue')},
      { path: '/dca-run-prediction', component: () => import('src/pages/decline_curve_analysis/dca_run_prediction.vue')},
      { path: '/dca-simulation-chart', component: () => import('src/pages/decline_curve_analysis/dca_simulation_chart.vue')},
      { path: '/asset-groups', component: () => import('src/pages/asset_groups/landing.vue')},
      { path: '/import-welltest-data', component: () => import('src/pages/data_import/well_test_history/import_welltest_data.vue')},
      //import_welltest_data
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
