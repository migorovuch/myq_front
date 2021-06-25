<template>
  <div>
    <div class="form-group">
      <label>{{ $t("User") }}</label>
      <div class="row">
        <div class="col">
          {{ $t("User name") }}:{{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.fullName : selectedBooking.userName }}
        </div>
        <div class="col">
          {{ $t("User phone") }}:{{ selectedBooking.hasOwnProperty('user') ? selectedBooking.user.phone : selectedBooking.userPhone }}
        </div>
      </div>
    </div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="$emit('onFormSubmit', formModel)"
    />
  </div>
</template>

<script>
import AppFormModel from "../../../models/AppFormModel";
import AppFormInput from "../../../models/AppFormInput";
import AppFormSelect from "../../../models/AppFormSelect";
import AppForm from "../../components/AppForm";

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
            title: new AppFormInput('text', this.$t('Title'), this.$t('Title')),
            scheduleId: new AppFormSelect('select', this.$t('Schedule'), this.$t('Schedule'), null, null, scheduleList),
            status: new AppFormSelect('select', this.$t('Status'), this.$t('Status'), null, null, statusList),
            dateStart: new AppFormInput('datepicker', this.$t('Date start'), this.$t('Date start')),
            timeStart: new AppFormInput('timepicker', this.$t('Time start'), this.$t('Time start')),
            timeEnd: new AppFormInput('timepicker', this.$t('Time end'), this.$t('Time end')),
          },
          null,
          null
      )
    };
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
