<template>
  <div>
    <b-form-checkbox v-model="extended">{{$t("Extended")}}</b-form-checkbox>
    <div v-if="extended">
      <div v-for="(item, specialHoursKey) in specialHours" :key="specialHoursKey" class="row form-group">
        <div class="col-6">
          <b-form-datepicker
              v-model="item.startDate"
              size="sm"
              class="date-picker-min-width"
              :max="item.endDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-6">
          <b-form-datepicker
              v-model="item.endDate"
              size="sm"
              class="date-picker-min-width"
              :min="item.endDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-6">
          <b-form-select v-model="item.repeatCondition" :options="repeatOptions"></b-form-select>
        </div>
        <div class="col-6">
          <b-form-select v-if="item.repeatCondition===1" v-model="item.repeatDay" :options="onceAWeekOptions"></b-form-select>
          <b-form-select v-if="item.repeatCondition===2" v-model="item.repeatDate" :options="onceAMonthOptions"></b-form-select>
          <b-form-datepicker
              v-if="item.repeatCondition===3"
              v-model="item.repeatDate"
              size="sm"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-12">
          <div v-for="(range, rangeKey) in item.ranges" :key="rangeKey" class="row">
            <div class="col-3">
              <b-form-timepicker
                  class="special-hours-time"
                  v-model="range.from"
                  label-no-time-selected="-:-"
                  size="sm"
                  minutes-step="5"
              ></b-form-timepicker>
            </div>
            <div class="col-3">
              <b-form-timepicker
                  class="special-hours-time"
                  v-model="range.to"
                  label-no-time-selected="-:-"
                  size="sm"
                  minutes-step="5"
              ></b-form-timepicker>
            </div>
          </div>
          <span @click="addRangeToItem(item)">+</span>
        </div>
      </div>
      <div @click="addSpecialHoursItem">+</div>
      <b-button @click="saveAvailabilitySpecialHours">{{ $t('Save availability') }}</b-button>
    </div>
    <div v-else>
      <div class="row mb-2" v-for="(period, periodKey) in specialHoursForCurrentView" :key="periodKey">
        <div class="col">
          <b-form-datepicker
              v-model="period.startDate"
              size="sm"
              :max="period.endDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col">
          <b-form-datepicker
              v-model="period.endDate"
              size="sm"
              :min="period.startDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
      </div>
      <div v-if="selectedPeriodKey">
        <div
            v-for="(hours, dayOfWeek) in specialHoursForCurrentView[selectedPeriodKey].specialHours"
            :key="dayOfWeek"
            class="row mb-2">
          <div class="col-4">
            {{hours.dayOfWeek}}
          </div>
          <div class="col-2">
            <b-form-checkbox
                v-model="hours.available"
            ></b-form-checkbox>
          </div>
          <div class="col-3">
            <b-form-timepicker
                v-model="hours.from"
                label-no-time-selected="-:-"
                size="sm"
                :disabled="!hours.available"
                minutes-step="5"
            ></b-form-timepicker>
          </div>
          <div class="col-3">
            <b-form-timepicker
                v-model="hours.to"
                label-no-time-selected="-:-"
                size="sm"
                :disabled="!hours.available"
                minutes-step="5"
            ></b-form-timepicker>
          </div>
        </div>
      </div>
      <b-button @click="savePeriods">{{ $t('Save availability') }}</b-button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import SpecialHoursHelper from '@/helpers/SpecialHoursHelper';

export default {
  name: "SpecialHoursForm",
  props: {
    idSchedule: String,
  },
  data () {
    let onceAMonthOptions = [];
    for (let i=1;i<=31;i++) {
      onceAMonthOptions.push({value: i, text: i});
    }
    return {
      extended: false,
      selectedPeriodKey: 0,
      specialHoursForCurrentView: [],
      specialHours: [],
      repeatOptions: [
        {value: 0, text: this.$t('Every day')},
        {value: 1, text: this.$t('Once a week')},
        {value: 2, text: this.$t('Once a month')},
        {value: 3, text: this.$t('Once a year')},
      ],
      onceAWeekOptions: [
        {value: 0, text: this.$t('Monday')},
        {value: 1, text: this.$t('Tuesday')},
        {value: 2, text: this.$t('Wednesday')},
        {value: 3, text: this.$t('Thursday')},
        {value: 4, text: this.$t('Friday')},
        {value: 5, text: this.$t('Saturday')},
        {value: 6, text: this.$t('Sunday')},
      ],
      onceAMonthOptions
    };
  },
  created() {
    this.specialHours = this.getSpecialHours();
    if (this.specialHours && this.specialHours.length) {
      let firstSpecialHours = this.specialHours[Object.keys(this.specialHours)[0]];
      this.selectedPeriodKey = this.periodKeyFromSpecialHours(firstSpecialHours);
      this.specialHoursForCurrentView = this.specialHoursToPeriods(this.specialHours);
    }
  },
  methods: {
    ...mapGetters('specialHours', {
      getSpecialHours: 'getList',
    }),
    ...mapActions('specialHours', {
      loadSpecialHours: 'load',
      saveSpecialHours: 'saveList'
    }),
    periodKeyFromSpecialHours(specialHours) {
      if (typeof specialHours.startDate === 'string') {
        specialHours.startDate = new Date(specialHours.startDate);
      }
      if (typeof specialHours.endDate === 'string') {
        specialHours.endDate = new Date(specialHours.endDate);
      }
      return specialHours.startDate.getTime() + "_" + specialHours.endDate.getTime();
    },
    getNextDayOfWeek(date, dayOfWeek) {
      var resultDate = new Date(date.getTime());
      resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

      return resultDate;
    },
    // special hours to periods for current view
    specialHoursToPeriods(specialHours) {
      let defaultSpecialHours = () => {
        return {
          0: {id: null, from: '10:00', to: '18:00', available: true, dayOfWeek: this.$t('Monday')},
          1: {id: null, from: '10:00', to: '18:00', available: true, dayOfWeek: this.$t('Tuesday')},
          2: {id: null, from: '10:00', to: '18:00', available: true, dayOfWeek: this.$t('Wednesday')},
          3: {id: null, from: '10:00', to: '18:00', available: true, dayOfWeek: this.$t('Thursday')},
          4: {id: null, from: '10:00', to: '18:00', available: true, dayOfWeek: this.$t('Friday')},
          5: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('Saturday')},
          6: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('Sunday')},
        }
      };
      let date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      let defaultPeriod = () => {
        return {
          startDate: new Date(),
          endDate: date,
          specialHours: defaultSpecialHours()
        }
      };
      let periods = {};
      for (let specialHoursItem of specialHours) {
        if (specialHoursItem.repeatCondition === 1) {
          let periodKey = this.periodKeyFromSpecialHours(specialHoursItem);
          if (!(periodKey in periods)) {
            periods[periodKey] = defaultPeriod();
            periods[periodKey].startDate = specialHoursItem.startDate;
            periods[periodKey].endDate = specialHoursItem.endDate;
          }
          let dayOfWeek = specialHoursItem.repeatDay;
          periods[periodKey].specialHours[dayOfWeek].id = specialHoursItem.id;
          for (let range of specialHoursItem.ranges) {
            if (SpecialHoursHelper.timeStringToMinutes(range.from) < SpecialHoursHelper.timeStringToMinutes(periods[periodKey].specialHours[dayOfWeek].from)) {
              periods[periodKey].specialHours[dayOfWeek].from = range.from;
            }
            if (SpecialHoursHelper.timeStringToMinutes(range.to) > SpecialHoursHelper.timeStringToMinutes(periods[periodKey].specialHours[dayOfWeek].to)) {
              periods[periodKey].specialHours[dayOfWeek].to = range.to;
            }
          }
        }
      }
      if (!Object.keys(periods).length) {
        periods[this.periodKeyFromSpecialHours(defaultPeriod)] = defaultPeriod;
      }

      return periods;
    },
    periodsToSpecialHours(periods) {
      let specialHours = [];
      let d = new Date();
      let idSchedule = this.idSchedule;
      d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);

      Object.keys(periods).forEach(periodKey => {
        let period = periods[periodKey];
        Object.keys(period.specialHours).forEach(specialHoursKey => {
          let periodDay = period.specialHours[specialHoursKey];
          let nextDayOfWeek = this.getNextDayOfWeek(d, specialHoursKey)
          specialHours.push({
            id: periodDay.id,
            schedule: idSchedule,
            ranges: [{from: periodDay.from, to: periodDay.to}],
            startDate: period.startDate.toFormatString(),
            endDate: period.endDate.toFormatString(),
            repeatCondition: 1,
            repeatDate: nextDayOfWeek.toFormatString(),
            repeatDay: specialHoursKey,
            available: periodDay.available,
          });
        });
      });

      return specialHours;
    },
    savePeriods() {
      let specialHours = this.periodsToSpecialHours(this.specialHoursForCurrentView);
      //merge originalSpecialHours and create specialHours
      let originalSpecialHours = [];
      for (let currentSpecialHours of this.getSpecialHours()) {
        if (currentSpecialHours.repeatCondition !== 1) {
          originalSpecialHours.push(currentSpecialHours);
        }
      }
      for (let currentSpecialHours of specialHours) {
        if (
            currentSpecialHours.id ||
            (currentSpecialHours.available && !currentSpecialHours.id)
        ) {
          originalSpecialHours.push(currentSpecialHours);
        }
      }
      this.specialHours = originalSpecialHours;
      this.saveSpecialHours({data: originalSpecialHours});
      this.$emit('form:save', this.specialHours);
    },
    saveAvailabilitySpecialHours() {
      // datepicker return string value, so before save need to convert it to Date
      console.log(this.specialHours);
      for (let specialHoursItem of this.specialHours) {
        if (typeof specialHoursItem.startDate !== String) {
          specialHoursItem.startDate = specialHoursItem.startDate.toFormatString();
        }
        if (typeof specialHoursItem.endDate !== String) {
          specialHoursItem.endDate = specialHoursItem.endDate.toFormatString();
        }
        specialHoursItem.schedule = this.idSchedule;
      }
      this.saveSpecialHours({
        data: this.specialHours,
        successCallback: (data) => {
          this.specialHoursForCurrentView = this.specialHoursToPeriods(data);
        }
      });
      this.$emit('form:save', this.specialHours);
    },
    addRangeToItem(specialHoursItem) {
      specialHoursItem.ranges.push({from: '09:00', to: '18:00'});
    },
    addSpecialHoursItem() {
      let idSchedule = this.idSchedule;
      this.specialHours.push({
        id: null,
        schedule: idSchedule,
        ranges: [{from: '09:00', to: '18:00'}],
        startDate: new Date(),
        endDate: new Date(),
        repeatCondition: 1,
        repeatDay: 0,
        repeatDate: new Date(),
      });
    },
  }
}
</script>

<style scoped>

</style>
