<template>
  <div>
    <div class="text-right form-group" v-if="getCompany()">
      <b-button
          type="submit"
          variant="success"
          @click="$router.push({name: 'company_schedule_item', params: {id: 0}})">
        <b-icon icon="calendar2-plus" aria-hidden="true"></b-icon>
        {{$t("views_schedule_dashboard.Add schedule")}}
      </b-button>
    </div>
    <b-table
        striped
        hover
        :items="getScheduleList()"
        :fields="fields"
        @row-clicked="rowClick"
    >
      <template #cell(available)="data">
        {{
          data.item.enabled ?
              (data.item.available ? $t('views_schedule_dashboard.Schedule available 24/7') : $t('views_schedule_dashboard.Schedule available only at special hours')) :
              $t('views_schedule_dashboard.Schedule is not available for booking')
        }}
      </template>
      <template #cell(bookingDuration)="data">
        <template v-if="data.item.bookingDuration">
          {{data.item.bookingDuration}} {{$t('views_schedule_dashboard.min')}}.
        </template>
        <template v-else>
          {{data.item.minBookingTime}} - {{data.item.maxBookingTime}} {{$t('views_schedule_dashboard.min')}}.
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

  export default {
    name: "DashboardScheduleList",
    data() {
      return {
        fields: [
          {key: 'name', label: this.$t('views_schedule_dashboard.Title')},
          {key: 'available', label: this.$t('views_schedule_dashboard.Availability')},
          {key: 'bookingDuration', label: this.$t('views_schedule_dashboard.Booking duration')},
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
      ...mapGetters('dashboard', {
        getBreadcrumbItems: 'getBreadcrumbItems'
      }),
      ...mapMutations('dashboard', {
        setBreadcrumbItems: 'setBreadcrumbItems',
      }),
      rowClick(item) {
        this.$router.push({name: 'dashboard_schedule_edit', params: {id: item.id}});
      }
    },
    created() {
      this.setBreadcrumbItems([
        {
          text: this.$t('layouts_dashboard.Dashboard'),
          to: {name: 'dashboard_home'}
        },
        {
          text: this.$t('views_schedule_dashboard.Schedules list'),
          to: {name: 'dashboard_schedules'}
        }
      ]);
    }
  }
</script>

<style scoped>

</style>
