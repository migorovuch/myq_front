<template>
  <div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
    >
      <template v-slot:available>
        <div class="row" v-if="idSchedule">
          <div class="mt-2 pt-lg-4 col-lg-6 col-xs-12 form-group">
            <input
                type="checkbox"
                :id="'input-available'"
                class="apple-switch"
                :key="'form-checkbox-available'"
                v-model="formModel.model.available"/>
            <label :for="'input-available'">{{formModel.form.available.label}}</label>
          </div>
          <div class="col-lg-6 col-xs-12 pt-lg-4 form-group">
            <b-button v-if="!formModel.model.available" variant="success" v-b-modal.modal-specal-hours>
              <b-icon icon="clock" class="mr-2"/>
              {{ $t('Select availability') }}
            </b-button>
          </div>
        </div>
      </template>
      <template v-slot:formFooter>
        <div class="form-group text-right">
          <b-button type="submit" variant="success">{{$t("Save")}}</b-button>
        </div>
      </template>
    </AppForm>
    {{idSchedule}}
    <CompanyCalendar
        v-if="idSchedule"
        :with-events="false"/>
    <b-modal id="modal-specal-hours"
             v-if="idSchedule"
             hide-footer :title="$t('Availability')">
      <SpecialHoursForm :id-schedule="idSchedule" v-on:form:save="refreshAvailability"></SpecialHoursForm>
    </b-modal>
  </div>
</template>

<script>
  import AppFormModel from "../../../models/AppFormModel";
  import AppFormInput from "../../../models/AppFormInput";
  import AppForm from "../../components/AppForm";
  import SpecialHoursForm from "../specialHours/SpecialHoursForm";
  import CompanyCalendar from "../../components/CompanyCalendar";
  import {mapActions, mapGetters} from "vuex";
  import {required} from "vuelidate/lib/validators";
  import AppFormSelect from "../../../models/AppFormSelect";
  import Vue from 'vue'

  export default {
    name: "ScheduleForm",
    components: {AppForm, CompanyCalendar, SpecialHoursForm},
    data() {
      return {
        formModel: new AppFormModel(
            {
              acceptBookingCondition: 0,
              available: false,
              bookingCondition: 0,
              bookingDuration: 30,
              description: "",
              enabled: true,
              maxBookingTime: 0,
              minBookingTime: 0,
              name: "",
              acceptBookingTime: 0,
              timeBetweenBookings: 0,
            },
            {
              name: new AppFormInput(
                  "text",
                  this.$t('Name:'),
                  this.$t('Enter name'),
                  {
                    required: this.$t('This value should not be blank'),
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('Available for booking:'),
                  null,
                  {},
                  {wrapClass: 'mt-2 pt-lg-4 col-lg-3'}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('Always availabl:'),
                  null,
                  {},
                  {wrapClass: 'col-lg-6'}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('Min Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('Max Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              bookingCondition: new AppFormSelect(
                  "select",
                  this.$t('Booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  [
                    {value: 0, text: this.$t('All users')},
                    {value: 1, text: this.$t('Authorized only')},
                  ]
              ),
              acceptBookingCondition: new AppFormSelect(
                  "select",
                  this.$t('Accept booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  [
                    {value: 0, text: this.$t('Mark bookings as New')},
                    {value: 1, text: this.$t('Accept all bookings')},
                    {value: 3, text: this.$t('Accept only from approved users')},
                    {value: 4, text: this.$t('Accept only after pay advance')},
                  ]
              ),
              acceptBookingTime: new AppFormInput(
                  "number",
                  this.$t('Accept booking time:'),
                  'minutes',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              timeBetweenBookings: new AppFormInput(
                  "number",
                  this.$t('Time between bookings:'),
                  'minutes',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
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
    created() {
      if (this.idSchedule && this.idSchedule != 0) {
        this.loadSchedule({
          id: this.idSchedule,
          successCallback: (data) => {
            Vue.set(this.formModel, 'model', data);
          }
        });
      }
    },
    methods: {
      ...mapGetters('schedule', {
        getSchedule: 'getModel',
      }),
      ...mapActions('schedule', {
        loadSchedule: 'loadMyOne',
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
        if (this.idSchedule && this.idSchedule != 0) {
          this.updateSchedule({
            id: this.idSchedule,
            data: formModel.model,
            successCallback: (data) => {
              this.$root.$bvToast.toast(this.$t('Successfully saved'), {
                toaster: 'b-toaster-bottom-left',
                appendToast: true,
                autoHideDelay: 4000
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
              Vue.set(this.formModel, 'model', data);
              this.$router.push({name: 'company_schedule_item', params: {id: data.id}})
              this.$root.$bvToast.toast(this.$t('Successfully saved'), {
                toaster: 'b-toaster-bottom-left',
                appendToast: true,
                autoHideDelay: 4000
              });
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
