<template>
  <div>
    <div class="form-group">
      <div class="row">
        <div class="col-12">
          <b>{{ $t("views_booking.User name") }}:</b> {{ 'pseudonym' in selectedBooking.client && selectedBooking.client.pseudonym != selectedBooking.client.name ? `${selectedBooking.client.pseudonym}(${selectedBooking.client.name})` : selectedBooking.client.name }}
        </div>
        <div class="col-12">
          <b>{{ $t("views_booking.User phone") }}:</b> <a :href="'tel:'+selectedBooking.client.phone">{{ selectedBooking.client.phone }}</a>
        </div>
      </div>
      <div v-if="selectedBooking.customerComment !== ''">
        <b>{{ $t("views_booking.Customer comment") }}:</b> {{selectedBooking.customerComment}}
      </div>
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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "BookingForm",
  components: {AppForm},
  props: {
    selectedBooking: null
  },
  created() {
    this.loadScheduleList({
      filter: {company: this.selectedBooking.schedule.company.id},
      successCallback: (data) => {
        let scheduleList = [];
        for (let schedule of data) {
          scheduleList.push({value: schedule.id, text: schedule.name, selected: this.selectedBooking.schedule.id === schedule.id});
        }
        this.formModel.form.scheduleId.options = scheduleList;
      }
    })
  },
  data() {
    let statusList = {
      0: this.$t('views_booking.New'),
      1: this.$t('views_booking.Accepted'),
      2: this.$t('views_booking.Declined')
    };
    return {
      formModel: new AppFormModel(
          this.selectedBooking,
          {
            title: new AppFormInput('text', this.$t('views_booking.Title'), this.$t('views_booking.Title'), {required: this.$t('views_booking.This value should not be blank'),}),
            scheduleId: new AppFormSelect('select', this.$t('views_booking.Schedule'), this.$t('views_booking.Schedule'), {required: this.$t('views_booking.This value should not be blank'),}, null, null, []),
            status: new AppFormSelect('select', this.$t('views_booking.Status'), this.$t('views_booking.Status'), {required: this.$t('views_booking.This value should not be blank'),}, null, null, statusList),
            startDate: new AppFormInput('datepicker', this.$t('views_booking.Date start'), this.$t('views_booking.Date start'), {required: this.$t('views_booking.This value should not be blank'),}),
            startTime: new AppFormInput('timepicker', this.$t('views_booking.Time start'), this.$t('views_booking.Time start'), {required: this.$t('views_booking.This value should not be blank'),}),
            endTime: new AppFormInput('timepicker', this.$t('views_booking.Time end'), this.$t('views_booking.Time end'), {required: this.$t('views_booking.This value should not be blank'),}),
          },
          null,
          {
            model: {
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
    ...mapActions('schedule', {
      loadScheduleList: 'load'
    }),
    ...mapGetters('schedule', {
      getScheduleList: 'getList',
    }),
  }
}
</script>

<style scoped>

</style>
