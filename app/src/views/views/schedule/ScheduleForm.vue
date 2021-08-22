<template>
  <div>
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
      <template v-slot:formFooter>
        <div class="form-group text-right">
          <b-button type="submit" variant="success">{{$t("views_schedule.Save")}}</b-button>
        </div>
      </template>
    </AppForm>
    <CompanyCalendar
        v-if="idSchedule"
        :with-events="false"/>
    <b-modal id="modal-specal-hours"
             v-if="idSchedule"
             hide-footer :title="$t('views_schedule.Availability')">
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
  import {mapActions, mapGetters, mapMutations} from "vuex";
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
              company: null,
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
                  {wrapClass: 'mt-2 pt-lg-4 col-lg-3'}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('views_schedule.Always availabl(24/7):'),
                  null,
                  {},
                  {wrapClass: 'col-lg-6'}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Min Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Max Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              bookingCondition: new AppFormSelect(
                  "select",
                  this.$t('views_schedule.Booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
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
                  {wrapClass: 'col-lg-3'}
              ),
              timeBetweenBookings: new AppFormInput(
                  "number",
                  this.$t('views_schedule.Time between bookings:'),
                  this.$t('views_schedule.minutes'),
                  {},
                  {wrapClass: 'col-lg-3'}
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
    created() {
      if (this.idSchedule && this.idSchedule != 0) {
        this.loadSchedule({
          id: this.idSchedule,
          successCallback: (data) => {
            data.company = data.company.id;
            Vue.set(this.formModel, 'model', data);
            let breadcrumbItems = this.getBreadcrumbItems();
            breadcrumbItems.push({text: data.name});
            this.setBreadcrumbItems(breadcrumbItems);
          }
        });
      } else if (this.getCompany()) {
        let data = this.formModel.model;
        data.company = this.getCompany().id;
        Vue.set(this.formModel, 'model', data);
        let breadcrumbItems = this.getBreadcrumbItems();
        breadcrumbItems.push({text: this.$t('views_schedule.New schedule')});
        this.setBreadcrumbItems(breadcrumbItems);
      } else {
        if (this.isAdmin()) {
          this.$router.push({name: 'dashboard_companies'});
        } else {
          this.$router.push({name: 'my_company'});
        }
      }
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
      ...mapGetters('dashboard', {
        getBreadcrumbItems: 'getBreadcrumbItems'
      }),
      ...mapMutations('dashboard', {
        setBreadcrumbItems: 'setBreadcrumbItems',
      }),
      onSubmit(formModel) {
        if (this.idSchedule && this.idSchedule != 0) {
          this.updateSchedule({
            id: this.idSchedule,
            data: formModel.model,
            successCallback: (data) => {
              this.$root.$bvToast.toast(this.$t('views_schedule.Successfully saved'), {
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
