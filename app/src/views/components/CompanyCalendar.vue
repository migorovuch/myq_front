<template>
  <div>
    <VueCal
        ref="vuecal"
        :special-hours="getSpecialHoursForCurrentView()"
        :events="getEvents()"
        :time-from="getCalendarTimeFrom()"
        :time-to="getCalendarTimeTo()"
        :locale="$i18n.locale"
        :showWeekNumbers="false"
        events-count-on-month-view
        :disable-views="['years', 'year']"
        @cell-click="$emit('cell-click', $event, $refs.vuecal)"
        @view-change="calendarViewChange"
        @ready="calendarViewChange"
        :time-cell-height="100"
    >
      <template v-slot:event="{ event, view }">
        <div @click="$emit('event-click', event)" class="event-body">
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
      // TODO: move it to store
      specialHours: [],
    };
  },
  computed: {
    computedSchedule () {
      return this.getSchedule();
    },
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
      getCalendarTimeFrom: 'getCalendarTimeFrom',
      getCalendarTimeTo: 'getCalendarTimeTo',
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
            start: new Date(item.start).sformat('yyyy-mm-dd HH:MM:ss'),
            end: new Date(item.end).sformat('yyyy-mm-dd HH:MM:ss'),
            bookingData: item
          };
          events.push(event);
        });

        return events;
      }
      return [];
    },
    calendarViewChange(event) {
      this.setCalendarCurrentView(event);
      if (
          Object.keys(event).length &&
          this.getSchedule() !== null &&
          (event.view === 'week' || event.view === 'day')
      ) {
        let filter = {
          schedule: this.getSchedule().id,
          filterFrom: event.startDate.timestamp(),
          filterTo: event.endDate.timestamp(),
        };
        this.loadAvailability({
          filter: filter,
          successCallback: (data) => {
            this.$emit('load-availability-callback', data);
          }
        });
      }
      this.$emit('calendar-view-change', event);
    },
    logEvents(eventName, event) {
      this.$emit(eventName, event);
    },
    loadAvailabilityFromCache(event) {
      let successCallback = (data) => {

      };
      if (
          this.specialHours.hasOwnProperty(this.getSchedule().id) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.startDate.sformat('yyyy-mm-dd')) &&
          this.specialHours[this.getSchedule().id].hasOwnProperty(event.endDate.sformat('yyyy-mm-dd'))
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
.event-body {
  height: 100%;
}
</style>
