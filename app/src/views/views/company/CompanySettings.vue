<template>
  <div>
    <div class="row">
      <div class="col">
        <b-button v-b-modal.company-settings>{{$t("Company settings")}}</b-button>
        <b-button :to="{name:'company_bookings'}">{{$t("Bookings")}}</b-button>
        <b-button :to="{name:'company_schedule'}">{{$t("Schedule")}}</b-button>
      </div>
    </div>
    <b-modal id="company-settings" hide-footer :title="$t('Company settings')">
      <CompanyForm/>
    </b-modal>
  </div>
</template>

<script>
  import CompanyForm from "./CompanyForm";

  export default {
    name: "CompanySettings",
    components: {CompanyForm}
  }
</script>

<style scoped>

</style>
