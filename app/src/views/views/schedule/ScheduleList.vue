<template>
  <div>
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
              (data.item.available ? $t('Schedule available 24/7') : $t('Schedule available only at special hours')) :
              $t('Schedule is not available for booking')
        }}
      </template>
      <template #cell(bookingDuration)="data">
        <template v-if="data.item.bookingDuration">
          {{data.item.bookingDuration}} {{$t('min.')}}
        </template>
        <template v-else>
          {{data.item.minBookingTime}} - {{data.item.maxBookingTime}} {{$t('min.')}}
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
          {key: 'name', label: this.$t('Title')},
          {key: 'available', label: this.$t('Availability')},
          {key: 'bookingDuration', label: this.$t('Booking duration')},
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
