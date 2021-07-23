<template>
  <b-nav-item-dropdown variant="none" right>
    <template #button-content>
      <div :class="'mr-2 app__flag '+$i18n.locale "></div>{{$i18n.locale}}
    </template>
    <b-dropdown-item v-for="(lang, langKey) in languages" :key="langKey" @click="changeLang(lang)">
      <div :class="'mr-2 app__flag '+lang "></div>{{lang}}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: "LanguageSelect",
  data () {
    return {
      languages: process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',')
    };
  },
  methods: {
    changeLang(selectedLang) {
      this.$i18n.locale = selectedLang;
    }
  }
}
</script>

<style scoped>

</style>
