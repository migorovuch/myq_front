<template>
  <AppForm :formModel="formModel" @onFormSubmit="onSubmit">
    <template v-slot:formFooter>
      <b-button type="submit" variant="primary">{{$t("Checkout")}}</b-button>
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

let eventsLocalStorageProvider = new EventsLocalStorageProvider();

export default {
  name: "CreateBooking",
  components: {AppForm},
  created() {
    // add user contact details if user is not logged in
    if (!this.isUserLogged()) {
      this.formModel.form.userName = new AppFormInput(
          "text",
          this.$t('Your name:'),
          this.$t('Enter your name'),
          {
            required: this.$t('This value should not be blank'),
          }
      );
      this.formModel.form.userPhone = new AppFormInput(
          "text",
          this.$t('Your phone number:'),
          this.$t('Enter your contact phone number'),
          {
            required: this.$t('This value should not be blank'),
          }
      );
      this.formModel.validations.model.userName = {required};
      this.formModel.validations.model.userPhone = {required};
    }
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
          text = this.$t('{min} minutes', {min: i});
        } else if (i >= 60) {
          let hours = parseInt(i / 60);
          let minutes = (i - (hours * 60));
          text = this.$t('{hs} hour(s) {min} minutes', {hs: hours, min: minutes});
          if (!minutes) {
            text = this.$t('{hs} hour(s)', {hs: hours});
          }
        }
        durationOptions.push({
          value: i,
          text: text
        });
      }
      this.formModel.form.duration = new AppFormSelect(
          "select",
          this.$t('Duration:'),
          this.$t('Select duration'),
          {
            required: this.$t('This value should not be blank'),
          },
          null,
          durationOptions
      );
      this.formModel.model.duration = minDuration;
    } else {
      this.formModel.model.duration = this.getSelectedSchedule().bookingDuration;
    }
    this.formModel.model.schedule = this.getSelectedSchedule().id;

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
            duration: 0
          },
          {
            startDate: new AppFormInput(
                "datepicker",
                this.$t('Event date:'),
                this.$t('Enter event date'),
                {
                  required: this.$t('This value should not be blank')
                }
            ),
            startTime: new AppFormInput(
                "timepicker",
                this.$t('Event time:'),
                this.$t('Enter event time'),
                {
                  required: this.$t('This value should not be blank'),
                }
            ),
            customerComment: new AppFormInput(
                "textarea",
                this.$t('Additional details:'),
                this.$t('Enter additional details'),
                {
                  required: this.$t('This value should not be blank'),
                }
            ),
          },
          null,
          {
            model: {
              startDate: {
                required,
              },
              startTime: {
                required,
              },
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
      isUserLogged: 'isUserLogged'
    }),
    ...mapActions('events', {
      createEvent: 'create'
    }),
    ...mapGetters('schedule', {
      getSelectedSchedule: 'getModel',
    }),
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

        this.createEvent({
          data: bookingFormModel.model,
          successCallback: (data) => {
            eventsLocalStorageProvider.addMyEvent(data);
            this.$emit('onFormSubmit', data);
            this.$root.$bvToast.toast(this.$t('Booking successfully created'), {
              toaster: 'b-toaster-top-left',
              appendToast: true,
              autoHideDelay: 4000
            });
            this.$root.$emit('bv::hide::modal', 'modal-booking');
          },
          failCallback: (data) => {
            //{"title":"Validation failed with 1 error(s).","errors":[{"source":"start","title":"These dates are not allowed for booking"}]}
            for (let error of data.errors) {
              if (error.source === 'start') {
                data.errors.push({source:'startDate',title:error.title});
                data.errors.push({source:'startTime',title:error.title});
              }
            }
            bookingFormModel.handleResponseErrors(data);
          }
        });
      }
    },
  }
}
</script>

<style scoped>

</style>
