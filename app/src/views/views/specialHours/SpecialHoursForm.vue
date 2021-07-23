<template>
  <div>
    <div class="form-group">
      <input
          type="checkbox"
          id="extended-configs"
          class="apple-switch"
          v-model="extended"/>
      <label for="extended-configs">{{$t("views_schedule.Extended configuration")}}</label>
    </div>
    <div v-if="extended">
      <div v-for="(item, specialHoursKey) in specialHours" :key="specialHoursKey" v-if="!item.deleted" class="row form-group">
        <div class="col-5 form-group">
          <b-form-datepicker
              v-model="item.startDate"
              size="sm"
              class="date-picker-min-width"
              :max="item.endDate"
              :disabled="!item.available"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-5 form-group">
          <b-form-datepicker
              v-model="item.endDate"
              size="sm"
              class="date-picker-min-width"
              :min="item.endDate"
              :disabled="!item.available"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-2 form-group">
          <b-icon class="mt-2" icon="trash-fill" aria-hidden="true" variant="danger" @click="removeSpecialHoursItem(item, specialHoursKey)"></b-icon>
          <label class="d-none">
            <b-icon v-if="item.available" class="mt-2" icon="square" aria-hidden="true" variant="danger"></b-icon>
            <b-icon v-else class="mt-2" icon="square" aria-hidden="true" variant="danger"></b-icon>
            <input
                type="checkbox"
                class="d-none"
                v-model="item.available"/>
          </label>
        </div>
        <div class="col-6 form-group">
          <b-form-select :disabled="!item.available" v-model="item.repeatCondition" :value="item.repeatCondition" :options="repeatOptions"></b-form-select>
        </div>
        <div class="col-6 form-group">
          <b-form-select :disabled="!item.available" v-if="item.repeatCondition===1" v-model="item.repeatDay" :value="item.repeatDay" :options="onceAWeekOptions"></b-form-select>
          <b-form-select :disabled="!item.available" v-if="item.repeatCondition===2" v-model="item.repeatDateMonth" :value="item.repeatDateMonth" :options="onceAMonthOptions"></b-form-select>
          <b-form-datepicker
              :disabled="!item.available"
              v-if="item.repeatCondition===3"
              v-model="item.repeatDate"
              size="sm"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col-12">
          <div v-for="(range, rangeKey) in item.ranges" :key="rangeKey" class="row">
            <div class="col-4 form-group">
              <b-form-timepicker
                  class="special-hours-time"
                  v-model="range.from"
                  label-no-time-selected="-:-"
                  size="sm"
                  :disabled="!item.available"
                  minutes-step="5"
              ></b-form-timepicker>
            </div>
            <div class="col-4 form-group">
              <b-form-timepicker
                  class="special-hours-time"
                  v-model="range.to"
                  label-no-time-selected="-:-"
                  size="sm"
                  :disabled="!item.available"
                  minutes-step="5"
              ></b-form-timepicker>
            </div>
            <div class="col-2" v-if="rangeKey!==0">
              <b-icon class="mt-2" @click="removeRangeFromItem(item, rangeKey)" icon="trash-fill" aria-hidden="true" variant="danger"></b-icon>
            </div>
          </div>
          <div class="row">
            <div class="offset-8 col-1">
              <b-icon
                  @click="addRangeToItem(item)"
                  class="mt-2"
                  icon="patch-plus"
                  aria-hidden="true"
                  variant="success">
              </b-icon>
            </div>
          </div>
        </div>
      </div>
      <b-button @click="addSpecialHoursItem" variant="outline-success">
        <b-icon icon="calendar-plus" aria-hidden="true" class="mr-1"></b-icon><span>{{ $t('views_schedule.Add special hours') }}</span>
      </b-button>
      <b-button @click="saveAvailabilitySpecialHours" variant="success">{{ $t('views_schedule.Save availability') }}</b-button>
    </div>
    <div v-else>
      <div class="row mb-2" v-for="(period, periodKey) in specialHoursForCurrentView" :key="periodKey" @click="selectedPeriodKey=periodKey">
        <div class="col">
          <b-form-datepicker
              @shown="selectedPeriodKey=periodKey"
              v-model="period.startDate"
              :size="selectedPeriodKey===periodKey?'md':'sm'"
              :max="period.endDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
        <div class="col">
          <b-form-datepicker
              @shown="selectedPeriodKey=periodKey"
              v-model="period.endDate"
              :size="selectedPeriodKey===periodKey?'md':'sm'"
              :min="period.startDate"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          ></b-form-datepicker>
        </div>
      </div>
      <div v-if="selectedPeriodKey">
        <div
            v-for="(hours, dayOfWeek) in specialHoursForCurrentView[selectedPeriodKey].specialHours"
            :key="dayOfWeek"
            class="row form-group">
          <div class="col-lg-4 col-xs-12">
            <label :for="'available'+dayOfWeek" class="d-block">{{hours.dayOfWeek}}</label>
          </div>
          <div class="col-2">
            <b-form-checkbox
                :id="'available'+dayOfWeek"
                v-model="hours.available"
            ></b-form-checkbox>
          </div>
          <div class="col-lg-3 col-5">
            <b-form-timepicker
                v-model="hours.from"
                label-no-time-selected="-:-"
                size="sm"
                :disabled="!hours.available"
                minutes-step="5"
            ></b-form-timepicker>
          </div>
          <div class="col-lg-3 col-5">
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
      <b-button @click="addPeriod" variant="outline-success">
        <b-icon icon="calendar-plus" aria-hidden="true" class="mr-1"></b-icon><span>{{ $t('views_schedule.Add period') }}</span>
      </b-button>
      <b-button @click="savePeriods" variant="success">{{ $t('views_schedule.Save availability') }}</b-button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import SpecialHoursHelper from '@/helpers/SpecialHoursHelper';
import Vue from 'vue'

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
        {value: 0, text: this.$t('views_schedule.Every day')},
        {value: 1, text: this.$t('views_schedule.Once a week')},
        {value: 2, text: this.$t('views_schedule.Once a month')},
        {value: 3, text: this.$t('views_schedule.Once a year')},
      ],
      onceAWeekOptions: [
        {value: 0, text: this.$t('views_schedule.Monday')},
        {value: 1, text: this.$t('views_schedule.Tuesday')},
        {value: 2, text: this.$t('views_schedule.Wednesday')},
        {value: 3, text: this.$t('views_schedule.Thursday')},
        {value: 4, text: this.$t('views_schedule.Friday')},
        {value: 5, text: this.$t('views_schedule.Saturday')},
        {value: 6, text: this.$t('views_schedule.Sunday')},
      ],
      onceAMonthOptions
    };
  },
  created() {
    this.loadSpecialHours({
      filter: {schedule: this.idSchedule},
      successCallback: (data) => {
        this.specialHours = data;
        if (this.specialHours && this.specialHours.length) {
          this.prepareSpecialHours(this.specialHours);
          let firstSpecialHours = this.specialHours[Object.keys(this.specialHours)[0]];
          this.selectedPeriodKey = this.periodKeyFromSpecialHours(firstSpecialHours);
          this.specialHoursForCurrentView = this.specialHoursToPeriods(this.specialHours);
        }
      }
    });
  },
  methods: {
    ...mapGetters('specialHours', {
      getSpecialHours: 'getList',
    }),
    ...mapActions('specialHours', {
      loadSpecialHours: 'load',
      saveSpecialHours: 'saveList'
    }),
    prepareSpecialHours(specialHours) {
      for (let specialHoursItem of specialHours) {
        specialHoursItem.deleted = false;
        if (typeof specialHoursItem.startDate === 'string') {
          specialHoursItem.startDate = new Date(specialHoursItem.startDate);
        }
        if (typeof specialHoursItem.endDate === 'string') {
          specialHoursItem.endDate = new Date(specialHoursItem.endDate);
        }
        if (typeof specialHoursItem.repeatDate === 'string') {
          specialHoursItem.repeatDate = new Date(specialHoursItem.repeatDate);
          specialHoursItem.repeatDateMonth = specialHoursItem.repeatDate.getDate();
        }
        for (let range of specialHoursItem.ranges) {
          range.from = SpecialHoursHelper.timeStringToDate(range.from).sformat('HH:MM');
          range.to = SpecialHoursHelper.timeStringToDate(range.to).sformat('HH:MM');
        }
      }
    },
    periodKeyFromSpecialHours(specialHours) {
      return specialHours.startDate.sformat('yyyymmdd') + "_" + specialHours.endDate.sformat('yyyymmdd');
    },
    getNextDayOfWeek(date, dayOfWeek) {
      var resultDate = new Date(date.getTime());
      resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

      return resultDate;
    },
    getDefaultSpecialHours() {
      return {
        0: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Monday')},
        1: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Tuesday')},
        2: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Wednesday')},
        3: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Thursday')},
        4: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Friday')},
        5: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Saturday')},
        6: {id: null, from: '10:00', to: '18:00', available: false, dayOfWeek: this.$t('views_schedule.Sunday')},
      }
    },
    getDefaultPeriod(){
      let date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return {
        startDate: new Date(),
        endDate: date,
        specialHours: this.getDefaultSpecialHours()
      }
    },
    // special hours to periods for current view
    specialHoursToPeriods(specialHours) {
      let periods = {};
      for (let specialHoursItem of specialHours) {
        if (specialHoursItem.repeatCondition === 1) {
          let periodKey = this.periodKeyFromSpecialHours(specialHoursItem);
          if (!(periodKey in periods)) {
            periods[periodKey] = this.getDefaultPeriod();
            periods[periodKey].startDate = specialHoursItem.startDate;
            periods[periodKey].endDate = specialHoursItem.endDate;
          }
          let dayOfWeek = specialHoursItem.repeatDay;
          Object.assign(periods[periodKey].specialHours[dayOfWeek], specialHoursItem);
          let firstRange = specialHoursItem.ranges[0];
          periods[periodKey].specialHours[dayOfWeek].from = firstRange.from;
          periods[periodKey].specialHours[dayOfWeek].to = firstRange.to;
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
        let defaultPeriod = this.getDefaultPeriod();
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
            deleted: false,
            schedule: idSchedule,
            ranges: [{from: periodDay.from, to: periodDay.to}],
            startDate: period.startDate,
            endDate: period.endDate,
            repeatCondition: 1,
            repeatDate: nextDayOfWeek,
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
      this.saveAvailabilitySpecialHours();
    },
    saveAvailabilitySpecialHours() {
      let specialHours = [];
      // datepicker return string value, so before save need to convert it to Date
      for (let specialHoursItem of this.specialHours) {
        if (specialHoursItem.repeatCondition == 2 && specialHoursItem.repeatDateMonth) {
          if (!specialHoursItem.repeatDate) {
            specialHoursItem.repeatDate = new Date();
          }
          specialHoursItem.repeatDate.setDate(specialHoursItem.repeatDateMonth);
        }
        let newItem = {
          id: specialHoursItem.id,
          deleted: specialHoursItem.deleted,
          schedule: this.idSchedule,
          startDate: new Date(specialHoursItem.startDate).timestamp(),
          endDate: new Date(specialHoursItem.endDate).timestamp(),
          repeatCondition: specialHoursItem.repeatCondition,
          repeatDate: new Date(specialHoursItem.repeatDate).timestamp(),
          repeatDay: specialHoursItem.repeatDay,
          available: specialHoursItem.available,
          ranges:[]
        };
        for (let range of specialHoursItem.ranges) {
          newItem.ranges.push({
            from: SpecialHoursHelper.timeStringToDate(range.from, false).sformat('UTC:HH:MM'),
            to: SpecialHoursHelper.timeStringToDate(range.to, false).sformat('UTC:HH:MM')
          });
        }
        specialHours.push(newItem);
      }
      this.saveSpecialHours({
        data: specialHours,
        successCallback: (data) => {
          this.specialHours = data;
          this.prepareSpecialHours(this.specialHours);
          let firstSpecialHours = this.specialHours[Object.keys(this.specialHours)[0]];
          this.selectedPeriodKey = this.periodKeyFromSpecialHours(firstSpecialHours);
          this.specialHoursForCurrentView = this.specialHoursToPeriods(this.specialHours);
          this.$emit('form:save', this.specialHours);
        }
      });
    },
    addRangeToItem(specialHoursItem) {
      specialHoursItem.ranges.push({from: '09:00', to: '18:00'});
    },
    removeRangeFromItem(specialHoursItem, rangeKey) {
      Vue.delete(specialHoursItem.ranges, rangeKey);
    },
    addPeriod() {
      this.addSpecialHoursItem();
      this.specialHoursForCurrentView = this.specialHoursToPeriods(this.specialHours);
    },
    addSpecialHoursItem() {
      let idSchedule = this.idSchedule;
      this.specialHours.push({
        id: null,
        deleted: false,
        available: true,
        schedule: idSchedule,
        ranges: [{from: '09:00', to: '18:00'}],
        startDate: new Date(),
        endDate: new Date(),
        repeatCondition: 1,
        repeatDay: 0,
        repeatDate: new Date(),
      });
    },
    removeSpecialHoursItem(specialHours, specialHoursKey) {
      if (specialHours.id) {
        let tmpItem = this.specialHours[specialHoursKey];
        tmpItem.deleted = true;
        Vue.set(this.specialHours, specialHoursKey, tmpItem);
      } else {
        Vue.delete(this.specialHours, specialHoursKey);
      }
    },
  }
}
</script>

<style scoped>

</style>
