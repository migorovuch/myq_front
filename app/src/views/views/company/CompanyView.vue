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
    <div class="row">
      <div class="col">
        <CompanyCalendar :with-events="false" v-on:cell-click="createBooking" v-on:load-availability-callback="loadAvailabilityCallback"/>
      </div>
    </div>
    <b-button v-b-modal.modal-booking>{{ $t('Time booking') }}</b-button>
    <b-modal id="modal-booking" hide-footer :title="$t('Time booking')">
      <CreateBooking :booking-start="bookingStart"/>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";
import CreateBooking from "../booking/CreateBooking";

export default {
  name: "CompanyView",
  components: {CreateBooking, CompanyCalendar},
  data () {
    return {
      selectedSchedule: null,
      bookingStart: null,
      queryTime: null
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
            }
          }
        });
      }
    });
  },
  mounted() {
    if (this.$route.query && 'time' in this.$route.query) {
      this.queryTime = this.$route.query.time;
    }
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
    ...mapGetters('schedule', {
      getSchedule: 'getModel',
      getScheduleList: 'getList',
      getSelectedSchedule: 'getModel',
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
    ...mapGetters('availability', {
      getSpecialHoursForCurrentView: 'getSpecialHoursForCurrentView',
    }),
    loadAvailabilityCallback(data) {
      if (this.queryTime && 'schedule' in this.$route.query) {
        this.changeSelectedSchedule(this.$route.query.schedule);
        this.createBooking(new Date(this.queryTime));
        this.queryTime = null;
      }
    },
    createBooking(dateStart) {
      let specialHours = this.getSpecialHoursForCurrentView();
      if (specialHours && this.getSelectedSchedule() && specialHours.hasOwnProperty(dateStart.getDay())) {
        let bookingTimeMinutes = dateStart.getHours() * 60 + dateStart.getMinutes();
        let bookingDurationMinutes = this.getSelectedSchedule().bookingDuration ?
            this.getSelectedSchedule().bookingDuration :
            this.getSelectedSchedule().minBookingTime;
        let ranges = specialHours[dateStart.getDay()];
        ranges.sort(function(range1, range2) {
          if (range1.from > range2.from) {
            return 1;
          }
          if (range1.from < range2.from) {
            return -1;
          }
          return 0;
        });
        for (let range of ranges) {
          if (range.to - range.from >= bookingDurationMinutes) {
            if (range.from <= bookingTimeMinutes && range.to >= bookingTimeMinutes) {
              if (range.to < bookingTimeMinutes + bookingDurationMinutes) {
                dateStart = new Date(dateStart.getTime() - (bookingTimeMinutes + bookingDurationMinutes - range.to) * 60 * 1000);
                break;
              }
              break;
            } else if (range.from >= bookingTimeMinutes) {
              dateStart = new Date(dateStart.getTime() + ((range.from - bookingTimeMinutes) * 60 * 1000));
              break;
            }
          }
        }
      }
      this.bookingStart = dateStart;
      this.$bvModal.show('modal-booking');
    },
    changeSelectedSchedule(value) {
      let eventSchedule = null;
      for (let schedule of this.getScheduleList()) {
        if (schedule.id === value) {
          eventSchedule = schedule;
          break;
        }
      }
      this.selectSchedule(eventSchedule);
    }
  }
}
</script>

<style>
.vuecal__no-event {
  display: none;
}
</style>
