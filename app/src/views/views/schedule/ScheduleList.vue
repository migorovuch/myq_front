<template>
  <div>
    <div class="row form-group" v-if="getCompany()">
      <div class="col-lg-10 col-12 text-center" id="schedule-list-title">
        <h4>{{$t("views_schedule.Schedules list")}}</h4>
        <b-tooltip target="schedule-list-title" triggers="hover">
          {{$t("views_schedule.You can create multiple schedules if you needed (example: restaurant tables - each table will have own schedule)")}}
        </b-tooltip>
      </div>
      <div class="col-lg-2 col-12 text-right ">
        <b-button
            type="submit"
            variant="success"
            :to="{name: 'company_schedule_item', params: {id: 0}}">
          <b-icon icon="calendar2-plus"  class="mr-1" aria-hidden="true"></b-icon>
          {{$t("views_schedule.Add schedule")}}
        </b-button>
      </div>
    </div>
    <b-table
        striped
        hover
        :items="getScheduleList()"
        :fields="fields"
        @row-clicked="(item) => {this.$router.push({name: 'company_schedule_item', params: {id: item.id}})}"
    >
      <template #cell(available)="data">
        {{
          data.item.enabled ?
              (data.item.available ? $t('views_schedule.Schedule available 24/7') : $t('views_schedule.Schedule available only at special hours')) :
              $t('views_schedule.Schedule is not available for booking')
        }}
      </template>
      <template #cell(bookingDuration)="data">
        <template v-if="data.item.bookingDuration">
          {{data.item.bookingDuration}} {{$t('views_schedule.min')}}.
        </template>
        <template v-else>
          {{data.item.minBookingTime}} - {{data.item.maxBookingTime}} {{$t('views_schedule.min')}}.
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "ScheduleList",
    data() {
      return {
        fields: [
          {key: 'name', label: this.$t('views_schedule.Title')},
          {key: 'available', label: this.$t('views_schedule.Availability')},
          {key: 'bookingDuration', label: this.$t('views_schedule.Booking duration')},
        ],
      };
    },
    methods: {
      ...mapGetters('schedule', {
        getScheduleList: 'getList'
      }),
      ...mapGetters('company', {
        getCompany: 'getModel'
      }),
      ...mapActions('schedule', {
        loadScheduleList: 'load'
      }),
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
