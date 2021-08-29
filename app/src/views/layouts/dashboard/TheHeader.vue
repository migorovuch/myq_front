<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="toggleSidebarMobile"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="toggleSidebarDesktop"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="mr-4 ml-auto">
      <LanguageSelect />
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumb :items="getBreadcrumbItems()" class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import {CHeader, CToggler, CHeaderBrand, CHeaderNav, CHeaderNavItem, CHeaderNavLink, CIcon, CSubheader, CBreadcrumb} from '@coreui/vue';
import {mapMutations, mapActions, mapGetters} from "vuex";
import i18n from "../../../plugins/i18n";
import LanguageSelect from "../../components/LanguageSelect";

export default {
  name: 'TheHeader',
  components: {
    LanguageSelect,
    TheHeaderDropdownAccnt,
    CHeader, CToggler, CHeaderBrand, CHeaderNav, CHeaderNavItem, CHeaderNavLink, CIcon, CSubheader, CBreadcrumb
  },
  methods: {

    ...mapMutations('dashboard', {
      toggleSidebarDesktop: 'toggleSidebarDesktop',
      toggleSidebarMobile: 'toggleSidebarMobile'
    }),
    ...mapGetters('dashboard', {
      getBreadcrumbItems: 'getBreadcrumbItems'
    }),
  }
}
</script>
