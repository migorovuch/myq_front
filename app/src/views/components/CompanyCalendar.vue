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
import {mapGetters} from "vuex";
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
      specialHoursForCurrentView: {},
      calendarCurrentView: {},
      idSchedule: parseInt(this.$route.params.id)
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
    ...mapGetters('events', {
      getEventsList: 'getList',
    }),
    ...mapGetters('schedule', {
      getSchedule: 'getModel',
    }),
    getEvents() {
      if (this.withEvents) {
        return this.getEventsList();
      }
      return [];
    },
    timeStringToMinutes(timeString) {
      let [h, m] = timeString.split(':');

      return h * 60 + parseInt(m);
    },
    minutesToTimeString(minutes) {
      if (Number.isInteger(minutes)) {
        let h = parseInt(minutes / 60);
        let m = parseInt(minutes % 60);

        return h + ':' + m;
      }

      return minutes;
    },
    calculateSpecialHoursForCalendarCurrentView(specialHours, events, currentCalendarView) {
      let result = {};
      if (currentCalendarView.view === 'week' || currentCalendarView.view === 'day') {
        let addRanges = (result, dayOfWeek, ranges) => {
          if (!(dayOfWeek in result)) {
            result[dayOfWeek] = [];
          }
          for (let range of ranges) {
            result[dayOfWeek].push({
              from: this.timeStringToMinutes(range.from),
              to: this.timeStringToMinutes(range.to)
            });
          }

          return result;
        };
        let addRepeatDateRanges = (result, period) => {
          let dayOfWeek = period.repeatDate.getDay();
          dayOfWeek = dayOfWeek ? dayOfWeek : 7;

          return addRanges(result, dayOfWeek, period.ranges);
        };
        for (let period of specialHours) {
          if (period.startDate <= currentCalendarView.endDate && period.endDate >= currentCalendarView.startDate) {
            switch (period.repeat) {
              case 0://every day
                for (let i = 1; i <= 7; i++) {
                  result = addRanges(result, i, period.ranges);
                }
                break;
              case 1://once a week
                // result = addRepeatDateRanges(result, period);
                result = addRanges(result, (parseInt(period.repeatDay) + 1), period.ranges);
                break;
              case 2://every month
                period.repeatDate.setMonth(currentCalendarView.startDate.getMonth());
                period.repeatDate.setFullYear(currentCalendarView.startDate.getFullYear());
                if (
                    period.repeatDate >= currentCalendarView.startDate &&
                    period.repeatDate <= currentCalendarView.endDate
                ) {
                  result = addRepeatDateRanges(result, period);
                }
                break;
              case 3://every year
                period.repeatDate.setFullYear(currentCalendarView.getFullYear());
                if (
                    period.repeatDate >= currentCalendarView.startDate
                    && period.repeatDate <= currentCalendarView.endDate
                ) {
                  result = addRepeatDateRanges(result, period);
                }
                break;
            }
          }
        }
      }
      //take away the time of events
      for (let event of events) {
        if (event.start <= currentCalendarView.endDate && event.end >= currentCalendarView.startDate) {
          let eventDay = event.start.getDay();
          if (eventDay in result) {
            let remove = [];
            for (let timeKey in result[eventDay]) {
              let time = result[eventDay][timeKey];
              let eventStart = (event.start.getHours() * 60 + event.start.getMinutes());
              let eventEnd = (event.end.getHours() * 60 + event.end.getMinutes());
              if (time.from >= eventStart && time.from <= eventEnd) {
                time.from = eventEnd;
              } else if (time.to <= eventEnd && time.to > eventStart) {
                time.to = eventStart;
              } else if (time.from < eventStart && time.to > eventEnd) {
                result[eventDay].push({from: eventEnd, to: time.to});
                time.to = eventStart;
              }
              if (time.from >= time.to) {
                remove.push(timeKey);
              }
            }
            for (let key of remove) {
              result[eventDay].splice(key, 1);
            }
          }
        }
      }
      Object.keys(result).forEach(specialHoursKey => {
        Object.keys(result[specialHoursKey]).forEach(timeKey => {
          result[specialHoursKey][timeKey].class = 'business-hours';
        });
      });

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
        let firstSpecialHours = specialHoursForCurrentView[Object.keys(specialHoursForCurrentView)[0]];
        if (Array.isArray(firstSpecialHours)) {
          firstSpecialHours = firstSpecialHours[0];
        }
        this.calendarTimeFrom = this.calendarTimeTo = firstSpecialHours.from;
        Object.keys(specialHoursForCurrentView).forEach(specialHoursKey => {
          let dailyHours = specialHoursForCurrentView[specialHoursKey];
          if (Array.isArray(dailyHours)) {
            Array.from(dailyHours).forEach(time => {
              if (time.from < this.calendarTimeFrom) {
                this.calendarTimeFrom = time.from;
              }
              if (time.to > this.calendarTimeTo) {
                this.calendarTimeTo = time.to;
              }
            });
          } else {
            if (dailyHours.from < this.calendarTimeFrom) {
              this.calendarTimeFrom = dailyHours.from;
            }
            if (dailyHours.to > this.calendarTimeTo) {
              this.calendarTimeTo = dailyHours.to;
            }
          }
        });
      }
    },
    calendarViewChange(event) {
      this.calendarCurrentView = event;
      this.specialHoursForCurrentView = this.calculateSpecialHoursForCalendarCurrentView(this.getSpecialHours(), this.getEvents(), event);
      this.calculateCalendarFromTo(this.specialHoursForCurrentView, event);
    },
  }
}
</script>

<style scoped>

</style>
