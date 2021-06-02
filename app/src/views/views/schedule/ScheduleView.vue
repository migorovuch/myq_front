<template>
  <div>
    <CompanyCalendar />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";

export default {
  name: "ScheduleView",
  components: {CompanyCalendar},
  data() {
    return {
      idSchedule: this.$route.params.id
    };
  },
  created() {
    this.loadSchedule(this.idSchedule);
    this.loadSpecialHours(this.idSchedule);
    this.loadEvents(this.idSchedule);
  },
  methods: {
    ...mapGetters('specialHours', {
      getSpecialHours: 'getList',
    }),
    ...mapActions('specialHours', {
      loadSpecialHours: 'load'
    }),
    ...mapGetters('events', {
      getEvents: 'getList',
    }),
    ...mapActions('events', {
      loadEvents: 'load'
    }),
    ...mapGetters('schedule', {
      getSchedule: 'getModel',
    }),
    ...mapActions('schedule', {
      loadSchedule: 'loadOne'
    }),
  }
}
</script>

<style scoped>

</style>
