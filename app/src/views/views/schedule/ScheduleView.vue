<template>
  <div>
    <div class="row" v-if="scheduleOptions.length>1">
      <div class="col">
        <b-form-select :options="scheduleOptions" @change="changeSelectedSchedule" :model="selectedSchedule"></b-form-select>
      </div>
    </div>
    <div class="row" v-if="getSpecialHours()">
      <div class="col">
        <CompanyCalendar :with-events="false"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
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
  computed: {
    scheduleOptions() {
      let options = [];
      for (let schedule of this.getScheduleList()) {
        options.push({value: schedule.id, text: schedule.name});
      }

      return options;
    }
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
    ...mapMutations('schedule', {
      selectSchedule: 'loadOne',
    }),
    changeSelectedSchedule(value) {
      let eventSchedule = null;
      for (let schedule of this.getScheduleList()) {
        if (schedule.id === value) {
          eventSchedule = schedule;
          break;
        }
      }
      this.selectSchedule(eventSchedule);
      this.loadSpecialHours({
        filter: {schedule:value},
        idSchedule: value,
      });
    }
  }
}
</script>

<style scoped>

</style>
