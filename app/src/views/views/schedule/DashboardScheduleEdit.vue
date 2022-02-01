<template>
  <ScheduleForm :scheduleModel="scheduleModel"/>
</template>

<script>

import ScheduleForm from "./ScheduleForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
import Vue from 'vue'

export default {
  name: "DashboardScheduleEdit",
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
    let breadcrumbItems = this.getBreadcrumbItems();
    if (idSchedule != 0) {
      this.loadSchedule({
        id: idSchedule,
        successCallback: (data) => {
          breadcrumbItems.push({text: data.name});

          data.company = data.company.id;
          this.scheduleModel = data;
        }
      });
    } else if (this.getCompany()) {
      this.scheduleModel.company = this.getCompany().id;
      breadcrumbItems.push({text: this.$t('views_schedule.New schedule')});
    } else {
      this.$router.push({name: 'dashboard_companies'});
    }
    this.setBreadcrumbItems(breadcrumbItems);
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