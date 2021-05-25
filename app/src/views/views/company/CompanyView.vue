<template>
  <div>
    <div v-if="getCompany()">
      <div class="row">
        <div class="col">{{getCompany().name}}</div>
        <div class="col">{{getCompany().email}}</div>
        <div class="col">{{getCompany().phone}}</div>
        <div class="col">{{getCompany().address}}</div>
      </div>
      <div class="row">
        <div class="col">{{getCompany().description}}</div>
      </div>
      <div class="row" v-if="scheduleOptions.length>1">
        <div class="col">
          <b-form-select :options="scheduleOptions" @change="changeSelectedSchedule" :model="selectedSchedule"></b-form-select>
        </div>
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
import {mapActions, mapGetters} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";

export default {
  name: "CompanyView",
  components: {CompanyCalendar},
  data () {
    return {
      selectedSchedule: null,
    };
  },
  created() {
    this.loadCompany({
      id: this.$route.params.id,
      successCallback: (data) => {
        this.loadScheduleList({
          idCompany: data.id,
          successCallback: (data) => {
            if (data.length) {
              this.selectedSchedule = data[0].id;
              this.loadSpecialHours({idSchedule: this.selectedSchedule});
            }
          }
        });
      }
    });
  },
  computed: {
    scheduleOptions() {
      let options = [];
      for (let schedule of this.getScheduleList()) {
        options.push({value: schedule.id, text: schedule.name});
      }
      console.log(options);

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
    ...mapGetters('schedule', {
      getSchedule: 'getModel',
      getScheduleList: 'getList',
    }),
    ...mapActions('schedule', {
      loadSchedule: 'loadOne',
      loadScheduleList: 'load'
    }),
    ...mapGetters('company', {
      getCompany: 'getModel',
    }),
    ...mapActions('company', {
      loadCompany: 'loadOne'
    }),
    changeSelectedSchedule(value) {
      this.loadSpecialHours({idSchedule: value});
    }
  }
}
</script>

<style scoped>

</style>
