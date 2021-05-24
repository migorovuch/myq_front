<template>
  <div>
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(status)="data">
        <span>{{getStatusLabel(data.value)}}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "Bookings",
  data() {
    return {
      fields: [
        {key: 'user', label: this.$t('Client')},
        {key: 'date', label: this.$t('Booking date')},
        {key: 'time_from', label: this.$t('Booking time')},
        {key: 'time_to', label: this.$t('Booking time to')},
        {key: 'details', label: this.$t('Details')},
        {key: 'status', label: this.$t('Status')}
      ],
      items: []
    }
  },
  created() {
    this.items = this.getBookings();
  },
  methods: {
    getBookings() {
      let items = [
        { user: 'Test User', date: '21-09-2021', time_from: '16:30', time_to: '17:30', details: 'Event details', status: 0 },
        { user: 'Test User2', date: '21-09-2021', time_from: '16:30', time_to: '17:30', details: 'Event details', status: 1 },
        { user: 'Test User3', date: '21-09-2021', time_from: '16:30', time_to: '17:30', details: 'Event details', status: 2 },
      ];
      for (let item of items) {
        let color = this.getStatusColor(item.status);
        if(color) {
          item._rowVariant = color;
        }
      }

      return items;
    },
    getStatusColor(status) {
      let colors = {
        0: null,
        1: 'success',
        2: 'danger',
      };

      return colors[status];
    },
    getStatusLabel(status) {
      let labels = {
        0: this.$t('New'),
        1: this.$t('Approved'),
        2: this.$t('Cancelled'),
      };

      return labels[status];
    }
  }
}
</script>

<style scoped>

</style>
