<template>
  <div>
    <VueCal
        :special-hours="specialHoursForCurrentView"
        :events="getEvents()"
        :time-from="calendarTimeFrom"
        :time-to="calendarTimeTo"
        locale="uk"
        @view-change="calendarViewChange"
        @ready="calendarViewChange"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/uk.js';
import SpecialHoursHelper from '../../helpers/SpecialHoursHelper';

export default {
  name: "CompanyCalendar",
  components: {VueCal},
  props: {
    withEvents: true
  },
  data() {
    return {
      calendarTimeFrom: 0,
      calendarTimeTo: 24 * 60,
      specialHoursForCurrentView: {},
      specialHours: [],
      calendarCurrentView: {},
    };
  },
  computed: {
    computedSpecialHours () {
      return this.getSpecialHours()
    }
  },
  watch: {
    computedSpecialHours (newValue) {
      this.calendarViewChange(this.calendarCurrentView);
    }
  },
  methods: {
    ...mapGetters('specialHours', {
      getSpecialHours: 'getList',
    }),
    ...mapActions('events', {
      loadEvents: 'load'
    }),
    ...mapGetters('events', {
      getEventsList: 'getList',
    }),
    ...mapGetters('schedule', {
      getSchedule: 'getModel',
    }),
    ...mapActions('availability', {
      loadAvailability: 'load'
    }),
    ...mapGetters('availability', {
      getAvailability: 'getList',
    }),
    getEvents() {
      if (this.withEvents) {
        return this.getEventsList();
      }
      return [];
    },
    calculateSpecialHoursForCalendarCurrentView(availability, currentCalendarView) {
      let result = {};
      for (let d = new Date(currentCalendarView.startDate); d <= currentCalendarView.endDate; d.setDate(d.getDate() + 1)) {
        let key = d.toFormatString(false);
        if (availability.hasOwnProperty(key)) {
          let dayOfWeek = d.getDay();
          if(!result.hasOwnProperty(dayOfWeek)) {
            result[dayOfWeek] = [];
          }
          for (let range of availability[key]) {
            let from = SpecialHoursHelper.timeStringToDate(range.from);
            let to = SpecialHoursHelper.timeStringToDate(range.to);
            result[dayOfWeek].push(
                {
                  from: from.getHours() * 60 + from.getMinutes(),
                  to: to.getHours() * 60 + to.getMinutes(),
                  class: 'business-hours'
                }
            );
          }
        }
      }

      return result;
    },
    /**
     * @param specialHoursForCurrentView - already formatted/prepared for calendar
     * @param currentCalendarView
     */
    calculateCalendarFromTo(specialHoursForCurrentView, currentCalendarView) {
      if (
          specialHoursForCurrentView &&
          Object.keys(specialHoursForCurrentView).length !== 0 &&
          specialHoursForCurrentView.constructor === Object &&
          (currentCalendarView.view === 'week' || currentCalendarView.view === 'day')
      ) {
        this.calendarTimeFrom = null;
        this.calendarTimeTo = null;
        Object.keys(specialHoursForCurrentView).forEach(dayOfWeek => {
          let dailyHours = specialHoursForCurrentView[dayOfWeek];
          Array.from(dailyHours).forEach(time => {
            if (time.from < this.calendarTimeFrom || this.calendarTimeFrom === null) {
              this.calendarTimeFrom = time.from;
            }
            if (time.to > this.calendarTimeTo || this.calendarTimeTo === null) {
              this.calendarTimeTo = time.to;
            }
          });
        });

        if (this.calendarTimeFrom === null) {
          this.calendarTimeFrom = 9 * 60;
        }
        if (this.calendarTimeTo === null) {
          this.calendarTimeTo = 18 * 60;
        }
      }
    },
    calendarViewChange(event) {
      this.calendarCurrentView = event;
      if (
          Object.keys(event).length &&
          this.getSchedule() !== null &&
          (event.view === 'week' || event.view === 'day')
      ) {
        this.loadAvailabilityFromCache(event)
      }
    },
    loadAvailabilityFromCache(event) {
      let successCallback = (data) => {
        this.specialHoursForCurrentView = this.calculateSpecialHoursForCalendarCurrentView(data, event);
        this.calculateCalendarFromTo(this.specialHoursForCurrentView, event);
      };
      if (
          this.specialHours.hasOwnProperty(this.getSchedule().id) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.startDate.toFormatString(false)) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.endDate.toFormatString(false))
      ) {
        successCallback(this.specialHours[this.getSchedule().id]);
      } else {
        this.loadAvailability({
          filter: {
            schedule: this.getSchedule().id,
            filterFrom: event.startDate.timestamp(),
            filterTo: event.endDate.timestamp(),
          },
          successCallback: (data) => {
            successCallback(data);
            if (!this.specialHours.hasOwnProperty(this.getSchedule().id)) {
              this.specialHours[this.getSchedule().id] = {}
            }
            Object.assign(this.specialHours[this.getSchedule().id], data);
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
