<template>
  <div>
    <div v-if="getCompany()" class="text-left">
      <div class="row">
        <div class="col-2" v-if="getCompany().logo">
          <div class="comapny-logo">
            <img :src="'http://q.localhost/media/'+getCompany().logo" alt="Company logo">
          </div>
        </div>
        <div class="col">
          <h1>{{getCompany().name}}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col form-group" v-if="getCompany().phone"><a :href="'tel:'+getCompany().phone">{{ getCompany().phone }}</a></div>
        <div class="col form-group" v-if="getCompany().email"><a :href="'mailto:'+getCompany().email">{{ getCompany().email }}</a></div>
        <div class="col form-group" v-if="getCompany().address">
          <a :href="getCompany().addressLink" v-if="getCompany().addressLink" target="_blank">{{ getCompany().address }}</a>
          <span v-else>{{ getCompany().address }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col text-left">{{getCompany().description}}</div>
      </div>
      <div class="row" v-if="getSchedule()">
        <div class="col text-left">{{getSchedule().description}}</div>
      </div>
      <div class="row">
        <div class="col-6 col-lg-3 mt-3" v-if="scheduleOptions.length>1">
          <b-form-select :options="scheduleOptions" @change="changeSelectedSchedule" :model="selectedSchedule" :value="selectedSchedule"></b-form-select>
        </div>
        <div :class="(scheduleOptions.length>1?'text-right offset-lg-6':'offset-lg-9 offset-6') + ' col-6 col-lg-3 mt-3 mb-3 text-right'">
          <b-button v-b-modal.modal-booking variant="success">{{ $t('views_company.Time booking') }}</b-button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <CompanyCalendar :with-events="false" v-on:cell-click="createBooking" v-on:load-availability-callback="loadAvailabilityCallback"/>
      </div>
    </div>
    <b-modal id="modal-booking" hide-footer :title="$t('views_company.Time booking')">
      <CreateBooking :booking-start="bookingStart" @existing-client-exception="existingClientException"/>
    </b-modal>
    <b-modal id="modal-existing-account" hide-footer :title="$t('views_company.Account misunderstanding')">
      <div class="d-block text-center text-danger">
        {{$t('views_company.Looks like you already have an account! Do you want to login and continue as existing user or book as new client?')}}
      </div>
      <div class="text-right mt-4">
        <b-button v-b-modal.modal-login variant="success">
          <span>{{ $t('views_company.Sign in') }}</span>
        </b-button>
        <b-button @click="continueAsNewClient" variant="outline-success">
          {{ $t('views_company.Continue as new client') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";
import CreateBooking from "../booking/CreateBooking";
import ClientLocalStorageProvider from "../../../providers/localStorage/ClientLocalStorageProvider";

let clientLocalStorageProvider = new ClientLocalStorageProvider();

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
          filter: {company:data.data[0].id},
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
      loadCompany: 'loadPublicOne'
    }),
    ...mapGetters('availability', {
      getSpecialHoursForCurrentView: 'getSpecialHoursForCurrentView',
      getCalendarCurrentView: 'getCalendarCurrentView',
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
      if (
          specialHours &&
          this.getSelectedSchedule() &&
          specialHours.hasOwnProperty(dateStart.getDay()) &&
          specialHours[dateStart.getDay()].length &&
          (this.getCalendarCurrentView().view === 'week' || this.getCalendarCurrentView().view === 'day')
      ) {
        let bookingTimeMinutes = dateStart.getHours() * 60 + dateStart.getMinutes();
        let bookingDurationMinutes = this.getSelectedSchedule().bookingDuration ?
            this.getSelectedSchedule().bookingDuration :
            this.getSelectedSchedule().minBookingTime;
        let ranges = specialHours[dateStart.getDay()];
        ranges.sort(function (range1, range2) {
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
        this.bookingStart = dateStart;
        this.$bvModal.show('modal-booking');
      }
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
    },
    existingClientException(data) {
      console.log('existingClientException', data);
      this.$bvModal.hide('modal-booking');
      this.$bvModal.show('modal-existing-account');
    },
    continueAsNewClient() {
      clientLocalStorageProvider.deleteCompanyClientId(this.getCompany().id)
      this.$bvModal.hide('modal-existing-account');
    }
  }
}
</script>

<style>
.vuecal__no-event {
  display: none;
}
</style>
