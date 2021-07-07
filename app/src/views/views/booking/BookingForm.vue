<template>
  <div>
    <div class="form-group">
      <div class="row">
        <div class="col-12">
          {{ $t("User name") }}: {{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.fullName : selectedBooking.userName }}
        </div>
        <div class="col-12">
          {{ $t("User phone") }}: <a :href="'tel:'+(selectedBooking.hasOwnProperty('user') ? selectedBooking.user.phone : selectedBooking.userPhone)">{{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.phone : selectedBooking.userPhone }}</a>
        </div>
      </div>
      {{selectedBooking.customerComment}}
    </div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="$emit('onFormSubmit', formModel)"
    >
      <template v-slot:formFooter>
        <b-button type="submit" variant="success">{{$t("Save changes")}}</b-button>
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
      0: this.$t('New'),
      1: this.$t('Accepted'),
      2: this.$t('Declined')
    };
    let scheduleList = [];
    if (this.selectedBooking.hasOwnProperty('scheduleList')) {
      scheduleList = this.selectedBooking.scheduleList;
    }
    return {
      formModel: new AppFormModel(
          this.selectedBooking,
          {
            title: new AppFormInput('text', this.$t('Title'), this.$t('Title'), {required: this.$t('This value should not be blank'),}),
            scheduleId: new AppFormSelect('select', this.$t('Schedule'), this.$t('Schedule'), {required: this.$t('This value should not be blank'),}, null, scheduleList),
            status: new AppFormSelect('select', this.$t('Status'), this.$t('Status'), {required: this.$t('This value should not be blank'),}, null, statusList),
            startDate: new AppFormInput('datepicker', this.$t('Date start'), this.$t('Date start'), {required: this.$t('This value should not be blank'),}),
            startTime: new AppFormInput('timepicker', this.$t('Time start'), this.$t('Time start'), {required: this.$t('This value should not be blank'),}),
            endTime: new AppFormInput('timepicker', this.$t('Time end'), this.$t('Time end'), {required: this.$t('This value should not be blank'),}),
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
