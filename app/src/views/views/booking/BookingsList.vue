<template>
  <div>
    <b-table striped hover :items="tableItems" :fields="tableFields"></b-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "BookingsList",
  props: {
    fields: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] }
  },
  data() {
    let defaultFields = [
      {key: 'user', label: this.$t('Client')},
      {key: 'schedule_name', label: ''},
      {key: 'date', label: this.$t('Booking date')},
      {key: 'time_from', label: this.$t('Booking time')},
      {key: 'time_to', label: this.$t('Booking time to')},
      {key: 'customerComment', label: this.$t('Details')},
      {key: 'statusLabel', label: this.$t('Status')}
    ];
    return {
      tableFields: this.fields.length ? this.fields : defaultFields,
      tableItems: [],
    }
  },
  watch: {
    items (newValue) {
      this.tableItems = this.prepareList(newValue);
    }
  },
  created() {
    this.tableItems = this.prepareList(this.items);
  },
  methods: {
    ...mapGetters('account', {
      isUserLogged: 'isUserLogged',
    }),
    ...mapGetters('events', {
      getEventsList: 'getList',
    }),
    prepareList(bookings) {
      let tableItems = [];
      for (let booking of bookings) {
        let start = new Date(booking.start);
        let end = new Date(booking.end);
        let item = {
          id: booking.id,
          user: booking.userName,
          date: start.format('d/m'),
          time_from: start.format('HH:MM'),
          time_to: end.format('HH:MM'),
          statusLabel: this.getStatusLabel(booking.status),
          customerComment: booking.customerComment
        };
        if (booking.hasOwnProperty('schedule')) {
          booking.schedule_name = booking.schedule.name;
        }
        let color = this.getStatusColor(booking.status);
        if(color) {
          item._rowVariant = color;
        }
        tableItems.push(item);
      }

      return tableItems;
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
        0: this.$t('Unapproved'),
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
