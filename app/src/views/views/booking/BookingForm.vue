<template>
  <div>
    <div class="form-group">
      <div class="row">
        <div class="col-12">
          {{ $t("views_booking.User name") }}: {{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.fullName : selectedBooking.userName }}
        </div>
        <div class="col-12">
          {{ $t("views_booking.User phone") }}: <a :href="'tel:'+(selectedBooking.hasOwnProperty('user') ? selectedBooking.user.phone : selectedBooking.userPhone)">{{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.phone : selectedBooking.userPhone }}</a>
        </div>
      </div>
      {{selectedBooking.customerComment}}
    </div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="$emit('onFormSubmit', formModel)"
    >
      <template v-slot:formFooter>
        <b-button type="submit" variant="success">{{$t("views_booking.Save changes")}}</b-button>
      </template>
    </AppForm>
  </div>
</template>

<script>
import AppFormModel from "../../../models/AppFormModel";
import AppFormInput from "../../../models/AppFormInput";
import AppFormSelect from "../../../models/AppFormSelect";
import AppForm from "../../components/AppForm";
import {minLength, required, email} from "vuelidate/lib/validators";

export default {
  name: "BookingForm",
  components: {AppForm},
  props: {
    selectedBooking: null
  },
  data() {
    let statusList = {
      0: this.$t('views_booking.New'),
      1: this.$t('views_booking.Accepted'),
      2: this.$t('views_booking.Declined')
    };
    let scheduleList = [];
    if (this.selectedBooking.hasOwnProperty('scheduleList')) {
      scheduleList = this.selectedBooking.scheduleList;
    }
    return {
      formModel: new AppFormModel(
          this.selectedBooking,
          {
            title: new AppFormInput('text', this.$t('views_booking.Title'), this.$t('views_booking.Title'), {required: this.$t('views_booking.This value should not be blank'),}),
            scheduleId: new AppFormSelect('select', this.$t('views_booking.Schedule'), this.$t('views_booking.Schedule'), {required: this.$t('views_booking.This value should not be blank'),}, null, scheduleList),
            status: new AppFormSelect('select', this.$t('views_booking.Status'), this.$t('views_booking.Status'), {required: this.$t('views_booking.This value should not be blank'),}, null, statusList),
            startDate: new AppFormInput('datepicker', this.$t('views_booking.Date start'), this.$t('views_booking.Date start'), {required: this.$t('views_booking.This value should not be blank'),}),
            startTime: new AppFormInput('timepicker', this.$t('views_booking.Time start'), this.$t('views_booking.Time start'), {required: this.$t('views_booking.This value should not be blank'),}),
            endTime: new AppFormInput('timepicker', this.$t('views_booking.Time end'), this.$t('views_booking.Time end'), {required: this.$t('views_booking.This value should not be blank'),}),
          },
          null,
          {
            model: {
              title: {required,},
              scheduleId: {required,},
              status: {required,},
              startDate: {required,},
              startTime: {required,},
              endTime: {required,},
            }
          }
      )
    };
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
