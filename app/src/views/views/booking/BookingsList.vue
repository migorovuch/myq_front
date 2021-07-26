<template>
  <div>
    <b-table
        striped
        hover
        :items="tableItems"
        :fields="tableFields"
        @row-clicked="rowClicked">
      <template #cell(status)="data">
        <span :class="getStatusColor(data.value)">{{getStatusLabel(data.value)}}</span>
      </template>
    </b-table>
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
      {key: 'subjectCompany', label: this.$t('views_booking.Subject')},
      // {key: 'user', label: this.$t('views_booking.Client')},
      // {key: 'scheduleName', label: ''},
      {key: 'date', label: this.$t('views_booking.Booking date')},
      // {key: 'customerComment', label: this.$t('views_booking.Details')},
      {key: 'status', label: this.$t('views_booking.Status')}
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
          subjectCompany: (booking.client.pseudonym ? booking.client.pseudonym : booking.client.name) + ' - ' + booking.schedule.name,
          subjectClient: booking.schedule.company.name + ' - ' + booking.schedule.name,
          scheduleName: booking.schedule.name,
          user: booking.userName,
          date: start.sformat('dd.mm') + ` (${start.sformat('HH:MM')}-${end.sformat('HH:MM')})`,
          status: booking.status,
          customerComment: booking.customerComment,
          bookingData: booking
        };
        let color = this.getStatusColor(booking.status);
        // if(color) {
        //   item._rowVariant = color;
        // }
        tableItems.push(item);
      }

      return tableItems;
    },
    getStatusColor(status) {
      let colors = {
        0: '',
        1: 'text-success',
        2: 'text-danger',
      };

      return colors[status];
    },
    getStatusLabel(status) {
      let labels = {
        0: this.$t('views_booking.Unapproved'),
        1: this.$t('views_booking.Approved'),
        2: this.$t('views_booking.Cancelled'),
      };

      return labels[status];
    },
    rowClicked(item, index, event) {
      this.$emit('row-clicked',item, index, event);
    }
  }
}
</script>

<style scoped>

</style>
