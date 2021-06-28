<template>
  <div>
    <VueCal
        :special-hours="getSpecialHoursForCurrentView()"
        :events="getEvents()"
        :time-from="calendarTimeFrom"
        :time-to="calendarTimeTo"
        locale="uk"
        events-on-month-view="short"
        :disable-views="['years', 'year']"
        @view-change="calendarViewChange"
        @ready="calendarViewChange"
    >
      <template v-slot:event="{ event, view }">
        <div @click="$emit('event-click', event)">
          <div class="vuecal__event-title" v-html="event.title" />
          <small class="vuecal__event-time">
            <span>{{ event.start.sformat("HH:MM") }}</span>-<span>{{ event.end.sformat("HH:MM") }}</span>
          </small>
          <div class="vuecal__event-content" v-if="event.content" v-html="event.content" />
        </div>
      </template>
    </VueCal>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/uk.js';

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
      // TODO: move it to store
      specialHours: [],
    };
  },
  computed: {
    computedSchedule () {
      return this.getSchedule();
    }
  },
  watch: {
    computedSchedule (newValue) {
      this.calendarViewChange(this.getCalendarCurrentView());
    }
  },
  methods: {
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
      getCalendarCurrentView: 'getCalendarCurrentView',
      getSpecialHoursForCurrentView: 'getSpecialHoursForCurrentView',
    }),
    ...mapMutations('availability', {
      setCalendarCurrentView: 'setCalendarCurrentView',
    }),
    getEvents() {
      if (this.withEvents) {
        let events = [];
        Object.keys(this.getEventsList()).forEach(itemKey => {
          let item = this.getEventsList()[itemKey];
          let event = {
            title: item.title,
            start: new Date(item.start).toFormatString(),
            end: new Date(item.end).toFormatString(),
            bookingData: item
          };
          events.push(event);
        });

        return events;
      }
      return [];
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
      this.setCalendarCurrentView(event);
      if (
          Object.keys(event).length &&
          this.getSchedule() !== null &&
          (event.view === 'week' || event.view === 'day')
      ) {
        this.loadAvailability({
          filter: {
            schedule: this.getSchedule().id,
            filterFrom: event.startDate.timestamp(),
            filterTo: event.endDate.timestamp(),
          },
          successCallback: () => this.calculateCalendarFromTo(this.getSpecialHoursForCurrentView(), event)
        });
      }
      this.$emit('calendar-view-change', event);
    },
    logEvents(eventName, event) {
      this.$emit(eventName, event);
    },
    loadAvailabilityFromCache(event) {
      let successCallback = (data) => {
        this.calculateCalendarFromTo(this.specialHoursForCurrentView, event);
      };
      if (
          this.specialHours.hasOwnProperty(this.getSchedule().id) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.startDate.toFormatString(1)) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.endDate.toFormatString(1))
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
