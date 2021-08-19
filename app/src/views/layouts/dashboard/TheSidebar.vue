<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => setSidebarShow(value)"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="setSidebarMinimize(!minimize)"
    />
  </CSidebar>
</template>

<script>
import Vue from 'vue'
import {CSidebar, CSidebarNav, CSidebarNavItem, CSidebarBrand, CIcon, CRenderFunction, CSidebarMinimizer} from '@coreui/vue';
// import nav from './_nav'
import {mapGetters, mapMutations} from "vuex";
Vue.component('CSidebarNav', CSidebarNav);
Vue.component('CSidebarNavItem', CSidebarNavItem);

export default {
  name: 'TheSidebar',
  // nav,
  components: {CSidebar, CSidebarBrand, CIcon, CRenderFunction, CSidebarMinimizer},
  computed: {
    show() {
      return this.getSidebarShow()
    },
    minimize() {
      return this.getSidebarMinimize()
    },
    nav() {
      return [
        {
          _name: 'CSidebarNav',
          _children: [
            {
              _name: 'CSidebarNavItem',
              name: this.$t('layouts_dashboard.Dashboard'),
              to: '/dashboard',
              icon: 'cil-list',
            },
            {
              _name: 'CSidebarNavItem',
              name: this.$t('layouts_dashboard.Users'),
              to: this.$router.resolve({name: 'dashboard_users'}).route.path,
              icon: 'cil-list',
            },
            {
              _name: 'CSidebarNavItem',
              name: this.$t('layouts_dashboard.Companies'),
              to: this.$router.resolve({name: 'dashboard_companies'}).route.path,
              icon: 'cil-list',
            },
            {
              _name: 'CSidebarNavItem',
              name: this.$t('layouts_dashboard.Schedules'),
              to: this.$router.resolve({name: 'dashboard_schedules'}).route.path,
              icon: 'cil-list',
            },
            {
              _name: 'CSidebarNavItem',
              name: this.$t('layouts_dashboard.Bookings'),
              to: this.$router.resolve({name: 'dashboard_bookings'}).route.path,
              icon: 'cil-list',
            },
          ]
        }
      ]
    },
  },
  methods: {
    ...mapGetters('dashboard', {
      getSidebarShow: 'getSidebarShow',
      getSidebarMinimize: 'getSidebarMinimize'
    }),
    ...mapMutations('dashboard', {
      setSidebarShow: 'setSidebarShow',
      setSidebarMinimize: 'setSidebarMinimize',
    })
  }
}
</script>
