<template>
  <AppForm :formModel="formModel" @onFormSubmit="onSubmit">
    <template v-slot:formFooter>
      <b-button type="submit" variant="success">{{$t("views_booking.Checkout")}}</b-button>
      <b-button type="button" @click="generateTimeLink" variant="secondary">{{$t("views_booking.Share time")}}</b-button>

    </template>
  </AppForm>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AppFormModel from "../../../models/AppFormModel";
import AppFormInput from "@/models/AppFormInput";
import AppForm from "../../components/AppForm";
import {required, email, minLength} from "vuelidate/lib/validators";
import SpecialHoursHelper from '@/helpers/SpecialHoursHelper';
import EventsLocalStorageProvider from "../../../providers/localStorage/EventsLocalStorageProvider";
import AppFormSelect from "../../../models/AppFormSelect";
import AppFormPhone from "../../../models/AppFormPhone";
import ClientLocalStorageProvider from "../../../providers/localStorage/ClientLocalStorageProvider";
import ClientApiProvider from "../../../providers/api/ClientApiProvider";
import Vue from 'vue'

let eventsLocalStorageProvider = new EventsLocalStorageProvider();
let clientLocalStorageProvider = new ClientLocalStorageProvider();
let clientApiProvider = new ClientApiProvider();

export default {
  name: "CreateBooking",
  components: {AppForm},
  props: {
    bookingStart: Date
  },
  created() {
    if (this.isUserLogged() && this.getCompany().user.id === this.getUserData().id) {
      this.formModel.model.newClient = false;
      let newProperties = {
        newClient: new AppFormInput(
            "checkbox",
            this.$t('views_booking.New client'),
            null,
            null,
            {wrapClass: 'form-group col-12'}
        )
      };
      Object.assign(newProperties, this.formModel.form);
      Vue.set(this.formModel, 'form', newProperties);
    }
    if (this.getSelectedSchedule()) {
      // add user contact details if user is not logged in
      // add booking duration if it's not predefined
      if (!this.getSelectedSchedule().bookingDuration) {
        let durationMinutesRound = 5;
        let durationOptions = [];
        let minDuration = Math.round((this.getSelectedSchedule().minBookingTime / durationMinutesRound)) * durationMinutesRound;
        minDuration = minDuration ? minDuration : durationMinutesRound;

        let maxDuration = Math.round((this.getSelectedSchedule().maxBookingTime / durationMinutesRound)) * durationMinutesRound;
        for (let i = minDuration; i < maxDuration; i += durationMinutesRound) {
          let text = '';
          if (i < 60) {
            text = this.$t('views_booking.{min} minutes', {min: i});
          } else if (i >= 60) {
            let hours = parseInt(i / 60);
            let minutes = (i - (hours * 60));
            text = this.$t('views_booking.{hs} hour(s) {min} minutes', {hs: hours, min: minutes});
            if (!minutes) {
              text = this.$t('views_booking.{hs} hour(s)', {hs: hours});
            }
          }
          durationOptions.push({
            value: i,
            text: text
          });
        }
        this.formModel.form.duration = new AppFormSelect(
            "select",
            this.$t('views_booking.Duration:'),
            this.$t('views_booking.Select duration'),
            {
              required: this.$t('views_booking.This value should not be blank'),
            },
            null,
            null,
            durationOptions
        );
        this.formModel.model.duration = minDuration;
      } else {
        this.formModel.model.duration = this.getSelectedSchedule().bookingDuration;
      }
      this.formModel.model.schedule = this.getSelectedSchedule().id;

      if (this.bookingStart) {
        this.formModel.model.startDate = this.bookingStart;
        this.formModel.model.startTime = this.bookingStart.sformat('HH:MM');
      }
    }
    if (this.isUserLogged()) {
      this.formModel.model.userName = this.getUserData().fullName;
      this.formModel.model.userPhone = this.getUserData().phone;
    } else {
      let clientId = clientLocalStorageProvider.getCompanyClientId(this.getCompany().id);
      if (clientId) {
        // Keep it as it is. Using this endpoint we can check if client has existing account
        clientApiProvider.getClient(
            clientId,
            (data) => {
              this.formModel.model.userName = data.name;
              this.formModel.model.userPhone = data.phone;
            },
            (data, statusCode) => {
              if(statusCode === 403) {
                this.$emit('existing-client-exception', data);
              } else if(statusCode === 404) {
                clientLocalStorageProvider.deleteCompanyClientId(this.getCompany().id);
              }
            }
        )
      }
    }
  },
  data: function () {
    return {
      formModel: new AppFormModel(
          {
            startDate: '',
            startTime: '',
            customerComment: '',
            userName: '',
            userPhone: '',
            duration: 0,
          },
          {
            startDate: new AppFormInput(
                "datepicker",
                this.$t('views_booking.Event date:'),
                this.$t('views_booking.Event date'),
                {
                  required: this.$t('views_booking.This value should not be blank')
                },
                {wrapClass: 'col-6'}
            ),
            startTime: new AppFormInput(
                "timepicker",
                this.$t('views_booking.Event time:'),
                this.$t('views_booking.Enter event time'),
                {
                  required: this.$t('views_booking.This value should not be blank'),
                },
                {wrapClass: 'col-6'}
            ),
            userName: new AppFormInput(
                "text",
                this.$t('views_booking.Your name:'),
                this.$t('views_booking.Enter your name'),
                {
                  required: this.$t('views_booking.This value should not be blank'),
                }
            ),
            userPhone: new AppFormPhone(
                "phone",
                this.$t('views_booking.Your phone number:'),
                this.$t('views_booking.Enter your contact phone number'),
                {
                  required: this.$t('views_booking.This value should not be blank'),
                  phone: this.$t('views_booking.Phone number is not valid'),
                }
            ),
            customerComment: new AppFormInput(
                "textarea",
                this.$t('views_booking.Additional details:'),
                this.$t('views_booking.Enter additional details'),
                {
                  required: this.$t('views_booking.This value should not be blank'),
                }
            ),
          },
          null,
          {
            model: {
              startDate: {required,},
              startTime: {required,},
              userName: {required},
              userPhone: {required},
            }
          }
      )
    };
  },
  methods: {
    ...mapGetters('company', {
      getCompany: 'getModel',
    }),
    ...mapGetters('account', {
      isUserLogged: 'isUserLogged',
      getUserData: 'getUserData'
    }),
    ...mapActions('events', {
      createEvent: 'create'
    }),
    ...mapGetters('schedule', {
      getSelectedSchedule: 'getModel',
    }),
    generateTimeLink() {
      if (this.formModel.model.startDate && this.formModel.model.startTime) {
        let start = new Date(this.formModel.model.startDate);
        let startTimeMinutes = SpecialHoursHelper.timeStringToMinutes(this.formModel.model.startTime);
        let hours = parseInt(startTimeMinutes / 60);
        start.setHours(hours);
        start.setMinutes(startTimeMinutes - (hours * 60));
        let path = this.$router.resolve(
            {
              name: 'company_vue',
              params: {
                id: this.getCompany().id
              },
              query: {
                schedule: this.getSelectedSchedule().id,
                time: start.sformat('isoDateTime')
              }
            }
        ).href;
        // !! The bellow shows what I may want.
        alert(window.location.origin + "/" + path);
      }
    },
    bookingTimeValidation(bookingFormModel) {
      let validationResult = 0;
      let bookingDate = new Date(bookingFormModel.model.startDate);
      let startTimeMinutes = SpecialHoursHelper.timeStringToMinutes(bookingFormModel.model.startTime);
      let duration = parseInt(bookingFormModel.model.duration);
      for (let specialHours of this.getSelectedSpecialHours()) {
        if (
            bookingDate >= specialHours.startDate && bookingDate <= specialHours.endDate &&
            (
                specialHours.repeatCondition === 0 ||
                (specialHours.repeatCondition === 1 && (bookingDate.getDay() - 1) === specialHours.repeatDay) ||
                (specialHours.repeatCondition === 2 && specialHours.repeatDate.getDate() === bookingDate.getDate()) ||
                (specialHours.repeatCondition === 3 && specialHours.repeatDate.getMonth() === bookingDate.getMonth() && specialHours.repeatDate.getDate() === bookingDate.getDate())
            )
        ) {
          validationResult = 1;
          for (let range of specialHours.ranges) {
            let fromMinutes = SpecialHoursHelper.timeStringToMinutes(range.from);
            let toMinutes = SpecialHoursHelper.timeStringToMinutes(range.to);
            if (
                fromMinutes <= startTimeMinutes &&
                toMinutes >= startTimeMinutes
            ) {
              validationResult = 2;
              if ((startTimeMinutes + duration) <= toMinutes) {
                validationResult = 3;
              }
            }
          }
        }
      }

      return validationResult;
    },
    onSubmit(bookingFormModel) {
      if (!bookingFormModel.errors.invalid) {
        let start = new Date(bookingFormModel.model.startDate);
        let startTimeMinutes = SpecialHoursHelper.timeStringToMinutes(bookingFormModel.model.startTime);
        let hours = parseInt(startTimeMinutes / 60);
        start.setHours(hours);
        start.setMinutes(startTimeMinutes - (hours * 60));
        let end = new Date(start.getTime() + bookingFormModel.model.duration * 60000);
        bookingFormModel.model.start = start.timestamp();
        bookingFormModel.model.end = end.timestamp();

        if (!this.isUserLogged()) {
          let clientId = clientLocalStorageProvider.getCompanyClientId(this.getCompany().id);
          if (clientId) {
            bookingFormModel.model.client = clientId;
          }
        }

        this.createEvent({
          data: bookingFormModel.model,
          successCallback: (data) => {
            if (!this.isUserLogged()) {
              eventsLocalStorageProvider.addMyEvent(data);
              clientLocalStorageProvider.setClientId(this.getCompany().id, data.client.id);
            }
            this.$emit('onFormSubmit', data);
            this.$root.$bvToast.toast(this.$t('views_booking.Booking successfully created'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000
            });
            this.$root.$emit('bv::hide::modal', 'modal-booking');
          },
          failCallback: (data, statusCode) => {
            if (statusCode === 403 && !this.isUserLogged()) {
              this.$emit('existing-client-exception', data);
            } else {
              if ('errors' in data) {
                for (let error of data.errors) {
                  if (error.source === 'start') {
                    data.errors.push({source: 'startDate', title: error.title});
                    data.errors.push({source: 'startTime', title: error.title});
                  }
                }
              }
              bookingFormModel.handleResponseErrors(data);
            }
          }
        });
      }
    },
  }
}
</script>

<style scoped>

</style>
