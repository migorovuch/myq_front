<template>
  <div>
    <div class="row">
      <div class="col-4">
        <AppForm
            :formModel="formModel"
            @onFormSubmit="onSubmit"
            @onFormReset="onReset"
        >
          <template v-slot:available>
            <b-form-checkbox
                :id="'input-available'"
                v-model="formModel.model.available"
                value="true"
                unchecked-value="false"
                :class="('available' in formModel.errors?'is-invalid':'') + ' mb-3'"
            >{{formModel.form.available.label}}</b-form-checkbox>
            <b-button v-b-modal.modal-specal-hours>{{ $t('Select availability') }}</b-button>
          </template>
          <template v-slot:formFooter>
            <b-button type="submit" variant="primary">{{$t("Save")}}</b-button>
          </template>
        </AppForm>
      </div>
      <div class="col-8">
        <VueCal
            :special-hours="specialHoursForCurrentView"
            :time-from="calendarTimeFrom"
            :time-to="calendarTimeTo"
            locale="en"
            @view-change="calendarViewChange"
            @ready="calendarViewChange"
        />
      </div>
    </div>
    <b-modal id="modal-specal-hours" hide-footer :title="$t('Availability')">
      <SpecialHoursForm :id-schedule="idSchedule"  v-on:form:save="calendarViewChange(calendarCurrentView)"></SpecialHoursForm>
    </b-modal>
  </div>
</template>

<script>
  import AppFormModel from "../../../models/AppFormModel";
  import AppFormInput from "../../../models/AppFormInput";
  import AppForm from "../../components/AppForm";
  import SpecialHoursForm from "./SpecialHoursForm";
  import VueCal from 'vue-cal'
  import 'vue-cal/dist/vuecal.css'
  import 'vue-cal/dist/i18n/uk.js';
  import {mapActions, mapGetters} from "vuex";

  export default {
    name: "Schedule",
    components: {AppForm, VueCal, SpecialHoursForm},
    data() {
      return {
        formModel: new AppFormModel(
            null,
            {
              name: new AppFormInput(
                  "text",
                  this.$t('Name:'),
                  this.$t('Enter name'),
                  {
                    required: this.$t('This value should not be blank'),
                  }
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('Available for booking:'),
                  null,
                  {}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('Always availabl:'),
                  null,
                  {}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('Booking duration:'),
                  'seconds',
                  {}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('Min Booking time:'),
                  'seconds',
                  {}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('Max Booking time:'),
                  'seconds',
                  {}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
                  {}
              ),
            },
            null,
            null
        ),
        calendarTimeFrom: 0,
        calendarTimeTo: 24 * 60,
        specialHoursForCurrentView: {},
        calendarCurrentView: {},
        idSchedule: parseInt(this.$route.params.id)
      };
    },
    created() {
      this.loadSchedule(this.$route.params.id);
      this.loadSpecialHours(this.$route.params.id);
      this.formModel.model = this.getSchedule();
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
      }),
      ...mapActions('schedule', {
        loadSchedule: 'loadOne'
      }),

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
      calculateSpecialHoursForCalendarCurrentView(specialHours, currentCalendarView) {
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
            // TODO: after deep copy using JSON.parse/stringify Date will get stringified
            if (!(period.startDate instanceof Date)) {
              period.startDate = new Date(period.startDate);
            }
            if (!(period.endDate instanceof Date)) {
              period.endDate = new Date(period.endDate);
            }
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
        Object.keys(result).forEach(specialHoursKey => {
          Object.keys(result[specialHoursKey]).forEach(timeKey => {
            result[specialHoursKey][timeKey].class = 'business-hours';
          });
        });

        return result;
      },
      /**
       * @param specialHoursForCurrentView - already formatted/prepared for calendar
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
        this.specialHoursForCurrentView = this.calculateSpecialHoursForCalendarCurrentView(this.getSpecialHours(), event);
        this.calculateCalendarFromTo(this.specialHoursForCurrentView, event);
      },
      onSubmit(formModel) {
        console.log(formModel);
      },
      onReset() {
      },
    }

  }
</script>

<style>
.business-hours {
  background-color: rgba(255, 255, 0, 0.2);
  border: solid rgba(255, 210, 0, 0.6);
  border-width: 2px 0;
}
</style>
