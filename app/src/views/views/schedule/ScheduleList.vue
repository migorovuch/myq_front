<template>
  <div>
    <b-table striped hover :items="getScheduleList()" :fields="fields">
      <template #cell(buttons)="data">
        <router-link :to="{name: 'company_schedule_item', params: {id: data.item.id}}">Edit</router-link>
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
          {key: 'name', label: this.$t('Schedule title')},
          {key: 'enabled', label: this.$t('Enabled/Disabled')},
          {key: 'available', label: this.$t('Availability')},
          {key: 'bookingDuration', label: this.$t('Up to customer/Predefined')},
          {key: 'minBookingTime', label: this.$t('Min. booking duration')},
          {key: 'maxBookingTime', label: this.$t('Max. booking duration')},
          {key: 'buttons', label: this.$t('Max. booking duration')},
        ],
      };
    },
    methods: {
      ...mapGetters('schedule', {
        getScheduleList: 'getList'
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
