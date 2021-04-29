<template>
  <div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
        @onFormReset="onReset"
    >
      <template v-slot:formFooter>
        <b-button type="submit" variant="primary">{{$t("Save")}}</b-button>
      </template>
    </AppForm>
  </div>
</template>

<script>
  import AppFormModel from "../../../models/AppFormModel";
  import AppFormInput from "../../../models/AppFormInput";
  import AppForm from "../../components/AppForm";

  export default {
    name: "Schedule",
    components: {AppForm},
    data() {
      return {
        formModel: new AppFormModel(
            null,
            {
              name: new AppFormInput(
                  "text",
                  this.$t('Name:'),
                  this.$t('Enter name'),
                  {
                    required: this.$t('This value should not be blank'),
                  }
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('Available for booking:'),
                  null,
                  {}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('Always availabl:'),
                  null,
                  {}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('Booking duration:'),
                  'seconds',
                  {}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('Min Booking time:'),
                  'seconds',
                  {}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('Max Booking time:'),
                  'seconds',
                  {}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
                  {}
              ),
            },
            null,
            null
        )
      };
    },
    created() {
      this.formModel.model = this.getSchedule(this.$route.params.id);
    },
    methods: {
      getSchedule(id) {
        return {
          id: id,
          name: 'First Schedule',
          enabled: false, //available for booking
          available: true, //Always available for booking or only in specific time
          bookingDuration: 0,// seconds, 0 - manual setting for each booking
          minBookingTime: 0,// available only in case bookingDuration==0
          maxBookingTime: 0,// available only in case bookingDuration==0, 0 - no limit
          description: '',
        }
      },
      onSubmit(formModel) {
        console.log(formModel);
      },
      onReset() {},
    }

  }
</script>

<style scoped>

</style>
