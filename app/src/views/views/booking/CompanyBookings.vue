<template>
  <div>
    <b-button :variant="!bookingsView?'success':'outline-primary'" @click="bookingsView=0">{{ $t("List") }}</b-button>
    <b-button :variant="bookingsView?'success':'outline-primary'" @click="bookingsView=1">{{ $t("Calendar") }}</b-button>
      <div class="row">
        <div class="col" v-if="scheduleOptions.length>1">
          <b-form-group :label="$t('Schedule')">
            <b-form-select :options="scheduleOptions || []" @change="changeSelectedSchedule" :model="filter.schedule"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group :label="$t('Filter from')">
            <b-form-datepicker
                v-model="filter.filterFrom"
                @input="applyBookingsFilter"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            ></b-form-datepicker>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group :label="$t('Filter to')">
            <b-form-datepicker
                v-model="filter.filterTo"
                @input="applyBookingsFilter"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            ></b-form-datepicker>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-group :label="$t('Title')">
            <b-form-input type="text" v-model="filter.title" @change="applyBookingsFilter" />
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group :label="$t('User name')">
            <b-form-input type="text" v-model="filter.userName" @change="applyBookingsFilter" />
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group :label="$t('Comment')">
            <b-form-input type="text" v-model="filter.customerComment" @change="applyBookingsFilter"/>
          </b-form-group>
        </div>
      </div>
    <b-button variant="danger" @click="resetFilter">{{ $t("Reset filter") }}</b-button>
    <template v-if="!bookingsView">
      <BookingsList :items="items" v-on:row-clicked="rowClicked"/>
      <div class="row">
        <div class="col">
          <b-form-group
              label="Sort"
              label-for="sort-by-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  @input="applyBookingsFilter"
                  :options="sortOptions"
                  class="w-75"
              >
              </b-form-select>
              <b-form-select
                  v-model="sortDesc"
                  :options="sortDescOptions"
                  @input="applyBookingsFilter"
                  size="sm"
                  class="w-25"
              >
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
              :label="$t('Per page')"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
          >
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                @input="applyBookingsFilter"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              @input="applyBookingsFilter"
              align="fill"
              size="sm"
              class="my-0"
          ></b-pagination>
        </div>
      </div>
    </template>
    <template v-else>
      <CompanyCalendar with-events="true" v-on:event-click="eventSelect" v-on:calendar-view-change="calendarViewChange"/>
    </template>
    <b-modal id="modal-booking" hide-footer :title="$t('Booking form')">
      <BookingForm v-on:onFormSubmit="onBookingFormSubmit" :selected-booking="selectedBooking"/>
    </b-modal>
  </div>
</template>

<script>
import BookingsList from "./BookingsList";
import {mapActions, mapGetters, mapMutations} from "vuex";
import CompanyCalendar from "../../components/CompanyCalendar";
import BookingForm from "./BookingForm";

export default {
  name: "CompanyBookings",
  components: {BookingForm, CompanyCalendar, BookingsList},
  data() {
    let sortOptions = [
      {text: this.$t('Event time'), value: 'start'},
      {text: this.$t('Status'), value: 'status'},
      {text: this.$t('User'), value: 'userName'},
      {text: this.$t('Schedule'), value: 'schedule'},
    ];
    let sortDescOptions = [
      {text: this.$t('Ascending'), value: 'ASC'},
      {text: this.$t('Descending'), value: 'DESC'},
    ];
    return {
      bookingsView: 0,
      items: [],
      selectedSchedule: null,
      selectedBooking: null,
      filter: {
        comapny: null,
        schedule: null,
        title: null,
        userName: null,
        filterFrom: null,
        filterTo: null,
        customerComment: null,
      },
      sortBy: 'start',
      sortDesc: 'DESC',
      sortOptions,
      sortDescOptions,
      perPage: 20,
      pageOptions: [5, 20, 50, 100],
      currentPage: 1,
      totalRows: 100
    };
  },
  computed: {
    scheduleOptions() {
      let options = [];
      for (let schedule of this.getScheduleList()) {
        options.push({value: schedule.id, text: schedule.name, selected: this.filter.schedule === schedule.id});
      }

      return options;
    },
  },
  created() {
    this.loadMyCompany({
      successCallback: (company) => {
        if (Object.keys(company).length !== 0) {
          this.filter.company = company.id;
          this.loadScheduleList({
            filter: {company:company.id},
            successCallback: (data) => {
              if (data.length) {
                this.filter.schedule = data[0].id;
                this.selectSchedule(data[0]);
                this.applyBookingsFilter();
              }
            }
          });
        }
      }
    });
  },
  methods: {
    ...mapGetters('company', {
      getCompany: 'getModel'
    }),
    ...mapActions('company', {
      loadMyCompany: 'loadMyCompany',
    }),
    ...mapGetters('events', {
      getEventsList: 'getList',
    }),
    ...mapActions('events', {
      loadEvents: 'load',
      updateEvent: 'update',
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
    ...mapActions('availability', {
      loadAvailability: 'load'
    }),
    getEventsFilter() {
      let filter = {};
      for (let filterKey in this.filter) {
        if (this.filter[filterKey]) {
          filter[filterKey] = this.filter[filterKey];
        }
      }
      if (filter.hasOwnProperty('filterFrom') && typeof filter.filterFrom === 'string') {
        filter.filterFrom = new Date(filter.filterFrom).timestamp();
      }
      if (filter.hasOwnProperty('filterTo') && typeof filter.filterTo === 'string') {
        filter.filterTo = new Date(filter.filterTo).timestamp();
      }
      if (filter.hasOwnProperty('userName')) {
        filter.userName = "%"+filter.userName+"%";
      }
      if (filter.hasOwnProperty('customerComment')) {
        filter.customerComment = "%"+filter.customerComment+"%";
      }
      if (filter.hasOwnProperty('title')) {
        filter.title = "%"+filter.title+"%";
      }
      filter.sort = {};
      filter.sort[this.sortBy] = this.sortDesc;
      filter['page'] = {
        limit: this.perPage,
        offset: (this.currentPage - 1) * this.perPage
      };

      return filter;
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
      this.filter.schedule = value;
      this.applyBookingsFilter();
    },
    applyBookingsFilter() {
      this.loadEvents({
        filter: this.getEventsFilter(),
        successCallback: (data) => {
          this.items = data.data;
          this.totalRows = data.total;
        }
      });
    },
    resetFilter() {
      for (let filterKey in this.filter) {
        if (filterKey !== 'schedule' && filterKey !== 'company') {
          this.filter[filterKey] = null;
        }
      }

      this.applyBookingsFilter();
    },
    calendarViewChange(calendarView) {
      let views = ['month', 'week', 'day'];
      if (views.includes(calendarView.view)) {
        this.filter.filterFrom = calendarView.startDate.sformat('yyyy-mm-dd');
        this.filter.filterTo = calendarView.endDate.sformat('yyyy-mm-dd');
        this.applyBookingsFilter();
      }
    },
    eventSelect(event) {
      this.selectedBooking = event.bookingData;
      let startDate = new Date(this.selectedBooking.start);
      let dateEnd = new Date(this.selectedBooking.end);
      this.selectedBooking.startDate = startDate.sformat('yyyy-mm-dd');
      this.selectedBooking.startTime = startDate.sformat('HH:MM');
      this.selectedBooking.endTime = dateEnd.sformat('HH:MM');
      this.selectedBooking.scheduleId = this.selectedBooking.schedule.id;
      this.selectedBooking.scheduleList = this.scheduleOptions;
      this.$bvModal.show('modal-booking');
    },
    rowClicked(item, index, event) {
      this.eventSelect(item);
    },
    onBookingFormSubmit(formModel) {
      let start = new Date(formModel.model.startDate + ' ' + formModel.model.startTime);
      let end = new Date(formModel.model.startDate + ' ' + formModel.model.endTime);
      let model = {
        start: start.timestamp(),
        end: end.timestamp(),
        id: formModel.model.id,
        schedule: formModel.model.scheduleId,
        status: formModel.model.status,
        title: formModel.model.title
      };
      this.updateEvent({
        id: model.id,
        data: model,
        successCallback: (data) => {
          if (this.bookingsView) {
            this.loadAvailability({
              filter: {
                schedule: this.getSchedule().id,
                filterFrom: new Date(this.filter.filterFrom).timestamp(),
                filterTo: new Date(this.filter.filterTo).timestamp(),
              }
            });
          }
          this.applyBookingsFilter();
          this.$root.$bvToast.toast(this.$t('Successfully saved'), {
            toaster: 'b-toaster-top-left',
            appendToast: true,
            autoHideDelay: 4000
          });
        },
        failCallback: (data) => {
          for (let error of data.errors) {
            if (error.source === 'start') {
              data.errors.push({source:'startDate',title:error.title});
              data.errors.push({source:'startTime',title:error.title});
            }
          }
          formModel.handleResponseErrors(data);
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
