<template>
  <b-container class="pt-3">
    <b-breadcrumb :items="getBreadcrumbItems()"></b-breadcrumb>
    <ScheduleForm :scheduleModel="scheduleModel" />
  </b-container>
</template>

<script>

import ScheduleForm from "./ScheduleForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
import Vue from 'vue'

export default {
  name: "ScheduleSettings",
  components: {ScheduleForm},
  data() {
    return {
      scheduleModel: {
        company: null,
        acceptBookingCondition: 0,
        available: false,
        bookingCondition: 0,
        bookingDuration: 30,
        description: "",
        enabled: true,
        maxBookingTime: 0,
        minBookingTime: 0,
        name: "",
        acceptBookingTime: 0,
        timeBetweenBookings: 0,
      }
    };
  },
  created() {
    let idSchedule = this.$route.params.id;
    if (idSchedule != 0) {
      this.loadSchedule({
        id: idSchedule,
        successCallback: (data) => {
          let breadcrumbItems = [];
          breadcrumbItems.push({text: this.$t('layouts_main.Home'), to: {name: 'home'}});
          breadcrumbItems.push({text: data.company.name, to: {name: 'company'}});
          breadcrumbItems.push({text: data.name});
          this.setBreadcrumbItems(breadcrumbItems);
          data.company = data.company.id;
          this.scheduleModel = data;
        }
      });
    } else if (this.getCompany()) {
      this.scheduleModel.company = this.getCompany().id;
      let breadcrumbItems = [];
      breadcrumbItems.push({text: this.$t('layouts_main.Home'), to: {name: 'home'}});
      breadcrumbItems.push({text: this.getCompany().name, to: {name: 'company'}});
      breadcrumbItems.push({text: this.$t('views_schedule.New schedule')});
      this.setBreadcrumbItems(breadcrumbItems);
    } else {
      this.$router.push({name: 'my_company'});
    }
  },
  methods: {
    ...mapActions('schedule', {
      loadSchedule: 'loadMyOne',
    }),
    ...mapGetters('dashboard', {
      getBreadcrumbItems: 'getBreadcrumbItems'
    }),
    ...mapMutations('dashboard', {
      setBreadcrumbItems: 'setBreadcrumbItems',
    }),
    ...mapGetters('company', {
      getCompany: 'getModel',
    }),
  }
}
</script>

<style scoped>

</style>