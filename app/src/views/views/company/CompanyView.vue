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
    <b-button v-b-modal.modal-booking>{{ $t('Time booking') }}</b-button>
    <b-modal id="modal-booking" hide-footer :title="$t('Time booking')">
      <BookingForm />
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";
import BookingForm from "../booking/BookingForm";

export default {
  name: "CompanyView",
  components: {BookingForm, CompanyCalendar},
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
          filter: {company:data[0].id},
          successCallback: (data) => {
            if (data.length) {
              this.selectedSchedule = data[0].id;
              this.selectSchedule(data[0]);
              this.loadSpecialHours({
                filter: {schedule:this.selectedSchedule},
                successCallback: (data) => {
                  this.loadSelectedSpecialHours(data);
                }
              });
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
    ...mapMutations('schedule', {
      selectSchedule: 'loadOne',
    }),
    ...mapGetters('company', {
      getCompany: 'getModel',
    }),
    ...mapActions('company', {
      loadCompany: 'loadOne'
    }),
    ...mapMutations('events', {
      loadSelectedSchedule: 'loadSelectedSchedule',
      loadSelectedSpecialHours: 'loadSelectedSpecialHours'
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
        successCallback: (data) => {
          this.loadSelectedSpecialHours(data);
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
