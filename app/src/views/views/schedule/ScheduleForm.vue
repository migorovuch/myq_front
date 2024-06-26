<template>
  <div class="form-group">
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
    >
      <template v-slot:available>
        <div class="row">
          <div class="mt-2 pt-lg-4 col-lg-6 col-xs-12 form-group">
            <input
                type="checkbox"
                :id="'input-available'"
                class="apple-switch"
                :key="'form-checkbox-available'"
                v-model="formModel.model.available"/>
            <label :for="'input-available'">{{formModel.form.available.label}}</label>
          </div>
          <div class="col-lg-6 col-xs-12 pt-lg-4 form-group" v-if="idSchedule && idSchedule != 0">
            <b-button v-if="!formModel.model.available" variant="success" v-b-modal.modal-specal-hours>
              <b-icon icon="clock" class="mr-2"/>
              {{ $t('views_schedule.Select availability') }}
            </b-button>
          </div>
        </div>
      </template>
      <template v-slot:bookingDuration>
        <div class="row">
          <div :class="(definedDuration ? 'col-sm-6' : 'col-sm-12')+' col-12 col-lg-3 mt-2 pt-lg-4 '">
            <input
                type="checkbox"
                id="input-defined-duration"
                class="apple-switch"
                min="0"
                :key="'form-checkbox-available'"
                v-model="definedDuration"/>
            <label for="input-defined-duration">{{ $t('views_schedule.Defined duration') }}</label>
            <b-tooltip target='input-defined-duration' triggers="hover">
              {{$t('views_schedule.Preset specific booking duration or define time range and customer can select duration themself')}}
            </b-tooltip>
          </div>
          <div class="col-12 col-sm-6 col-lg-3" v-if="definedDuration">
            <b-form-group
                id="bookingDuration-input-group"
                :label="formModel.form.bookingDuration.label"
                label-for="input-bookingDuration"
            >
              <b-form-input
                  id="input-bookingDuration"
                  v-model="formModel.model.bookingDuration"
                  :type="formModel.form.bookingDuration.type"
                  min="0"
                  :class="('bookingDuration' in formModel.errors?'is-invalid':'')"
                  :placeholder="((formModel.form.bookingDuration.placeholder !== '')?formModel.form.bookingDuration.placeholder:formModel.form.bookingDuration.label)"
              ></b-form-input>
              <div class="invalid-feedback" v-if="('bookingDuration' in formModel.errors)">{{formModel.errors.bookingDuration}}</div>
              <b-tooltip target='input-bookingDuration' triggers="hover">
                {{formModel.form.bookingDuration.title}}
              </b-tooltip>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6 col-lg-3" v-if="!definedDuration">
            <b-form-group
                id="minBookingTime-input-group"
                :label="formModel.form.minBookingTime.label"
                label-for="input-minBookingTime"
            >
              <b-form-input
                  id="input-minBookingTime"
                  v-model="formModel.model.minBookingTime"
                  :type="formModel.form.minBookingTime.type"
                  min="0"
                  :class="('minBookingTime' in formModel.errors?'is-invalid':'')"
                  :placeholder="((formModel.form.minBookingTime.placeholder !== '')?formModel.form.minBookingTime.placeholder:formModel.form.minBookingTime.label)"
              ></b-form-input>
              <div class="invalid-feedback" v-if="('minBookingTime' in formModel.errors)">{{formModel.errors.minBookingTime}}</div>
              <b-tooltip target='input-minBookingTime' triggers="hover">
                {{formModel.form.minBookingTime.title}}
              </b-tooltip>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-6 col-lg-3" v-if="!definedDuration">
            <b-form-group
                id="maxBookingTime-input-group"
                :label="formModel.form.maxBookingTime.label"
                label-for="input-maxBookingTime"
            >
              <b-form-input
                  id="input-maxBookingTime"
                  v-model="formModel.model.maxBookingTime"
                  :type="formModel.form.maxBookingTime.type"
                  :class="('maxBookingTime' in formModel.errors?'is-invalid':'')"
                  :placeholder="((formModel.form.maxBookingTime.placeholder !== '')?formModel.form.maxBookingTime.placeholder:formModel.form.maxBookingTime.label)"
              ></b-form-input>
              <div class="invalid-feedback" v-if="('maxBookingTime' in formModel.errors)">{{formModel.errors.maxBookingTime}}</div>
              <b-tooltip target='input-maxBookingTime' triggers="hover">
                {{formModel.form.maxBookingTime.title}}
              </b-tooltip>
            </b-form-group>
          </div>
        </div>
      </template>
      <template v-slot:minBookingTime></template>
      <template v-slot:maxBookingTime></template>
      <template v-slot:formFooter>
        <div class="form-group text-right">
          <b-button type="submit" variant="success">{{$t("views_schedule.Save")}}</b-button>
        </div>
      </template>
    </AppForm>
    <CompanyCalendar
        v-if="idSchedule"
        :with-events="false"/>
    <b-modal
        id="modal-specal-hours"
        hide-footer
        :title="$t('views_schedule.Availability')">
      <SpecialHoursForm v-if="idSchedule" :id-schedule="idSchedule" v-on:form:save="refreshAvailability"></SpecialHoursForm>
    </b-modal>
  </div>
</template>

<script>
  import AppFormModel from "../../../models/AppFormModel";
  import AppFormInput from "../../../models/AppFormInput";
  import AppForm from "../../components/AppForm";
  import SpecialHoursForm from "../specialHours/SpecialHoursForm";
  import CompanyCalendar from "../../components/CompanyCalendar";
  import {mapActions, mapGetters, mapMutations} from "vuex";
  import {required} from "vuelidate/lib/validators";
  import AppFormSelect from "../../../models/AppFormSelect";
  import Vue from 'vue'

  export default {
    name: "ScheduleForm",
    components: {AppForm, CompanyCalendar, SpecialHoursForm},
    props: {
      scheduleModel: Object
    },
    watch: {
      scheduleModel(newValue) {
        Vue.set(this.formModel, 'model', newValue);
      }
    },
    data() {
      return {
        definedDuration: true,
        formModel: new AppFormModel(
            this.scheduleModel,
            {
              name: new AppFormInput(
                  "text",
                  this.$t('views_schedule.Name:'),
                  this.$t('views_schedule.Enter name'),
                  {
                    required: this.$t('views_schedule.This value should not be blank'),
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('views_schedule.Available for booking:'),
                  null,
                  {},
                  {wrapClass: 'mt-2 pt-lg-4 col-lg-3'},
                  this.$t('views_schedule.Disable or enable schedule')
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('views_schedule.Always available(24/7):'),
                  null,
                  {},
                  {wrapClass: 'col-lg-6'},
                  this.$t('views_schedule.Always available or only at special hours')
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-12'},
                  this.$t('views_schedule.Booking duration in minutes')
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Min Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'd-none'},
                  this.$t('views_schedule.Min booking duration in minutes')
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Max Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'd-none'},
                  this.$t('views_schedule.Max booking duration in minutes')
              ),
              bookingCondition: new AppFormSelect(
                  "select",
                  this.$t('views_schedule.Booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  this.$t('views_schedule.Who can book your time? You can accept booking from all app users or only from registered with approved email'),
                  [
                    {value: 0, text: this.$t('views_schedule.All users')},
                    {value: 1, text: this.$t('views_schedule.Authorized only')},
                  ]
              ),
              acceptBookingCondition: new AppFormSelect(
                  "select",
                  this.$t('views_schedule.Accept booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  this.$t('views_schedule.Default booking status'),
                  [
                    {value: 0, text: this.$t('views_schedule.Mark bookings as New')},
                    {value: 1, text: this.$t('views_schedule.Accept all bookings')},
                    {value: 3, text: this.$t('views_schedule.Accept only from approved users')},
                    {value: 4, text: this.$t('views_schedule.Accept only after pay advance')},
                  ]
              ),
              acceptBookingTime: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Accept booking time:'),
                  this.$t('views_schedule.minutes'),
                  {},
                  {wrapClass: 'col-lg-3'},
                  this.$t('views_schedule.Advance booking in minutes')
              ),
              timeBetweenBookings: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Time between bookings:'),
                  this.$t('views_schedule.minutes'),
                  {},
                  {wrapClass: 'col-lg-3'},
                  this.$t('views_schedule.Time between bookings in minutes (eg - you need to prepare your work place)')
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('views_schedule.Description:'),
                  this.$t('views_schedule.Enter description'),
                  {},
                  {wrapClass: 'col-lg-6'}
              ),
            },
            null,
            {
              model: {
                name: {required,},
              }
            }
        ),
        idSchedule: this.$route.params.id
      };
    },
    methods: {
      ...mapGetters('account', {
        isAdmin: 'isAdmin'
      }),
      ...mapGetters('schedule', {
        getSchedule: 'getModel',
      }),
      ...mapGetters('company', {
        getCompany: 'getModel',
      }),
      ...mapActions('schedule', {
        updateSchedule: 'update',
        createSchedule: 'create',
      }),
      ...mapActions('availability', {
        loadAvailability: 'load'
      }),
      ...mapGetters('availability', {
        getCalendarCurrentView: 'getCalendarCurrentView'
      }),
      onSubmit(formModel) {
        this.$emit('onFormSubmit', formModel);
        if (this.idSchedule && this.idSchedule != 0) {
          this.updateSchedule({
            id: this.idSchedule,
            data: formModel.model,
            successCallback: (data) => {
              this.$root.$bvToast.toast(this.$t('views_schedule.Successfully saved'), {
                toaster: 'b-toaster-bottom-left',
                appendToast: true,
                autoHideDelay: 4000,
                variant: 'success'
              });
            },
            failCallback: (data) => {
              formModel.handleResponseErrors(data);
            },
          });
        } else {
          this.createSchedule({
            data: formModel.model,
            successCallback: (data) => {
              this.idSchedule = data.id;
              data.company = data.company.id;
              Vue.set(this.formModel, 'model', data);
              if (this.isAdmin()) {
                this.$router.push({name: 'dashboard_companies_edit', params: {id: data.company}})
              } else {
                this.$router.push({name: 'company_schedule_item', params: {id: data.id}})
              }
              this.$root.$bvToast.toast(this.$t('views_schedule.Successfully saved'), {
                toaster: 'b-toaster-bottom-left',
                appendToast: true,
                autoHideDelay: 4000,
                variant: 'success'
              });
              this.$root.$bvToast.toast(this.$t('views_schedule.Now you can configure your availability'), {
                toaster: 'b-toaster-bottom-right',
                variant: 'info',
                appendToast: true,
                autoHideDelay: 40000
              });
              this.$root.$emit('bv::show::modal', 'modal-specal-hours');
            },
            failCallback: (data) => {
              formModel.handleResponseErrors(data);
            },
          });
        }
      },
      refreshAvailability() {
        let calendarCurrentView = this.getCalendarCurrentView();
        let filter = {
          schedule: this.idSchedule,
          filterFrom: calendarCurrentView.startDate.timestamp(),
          filterTo: calendarCurrentView.endDate.timestamp(),
        };
        this.loadAvailability({
          filter: filter
        });
      }
    }

  }
</script>

<style>

</style>
