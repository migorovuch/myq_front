<template>
  <BookingsList :items="items" :fields="fields" />
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BookingsList from "./BookingsList";
import EventsLocalStorageProvider from "../../../providers/localStorage/EventsLocalStorageProvider";
import ClientLocalStorageProvider from "../../../providers/localStorage/ClientLocalStorageProvider";

let eventsLocalStorageProvider = new EventsLocalStorageProvider();
let clientLocalStorageProvider = new ClientLocalStorageProvider();

export default {
  name: "MyBookings",
  components: {BookingsList},
  data() {
    return {
      items: [],
      fields: [
        {key: 'subjectClient', label: this.$t('views_booking.Subject')},
        {key: 'date', label: this.$t('views_booking.Booking date')},
        {key: 'status', label: this.$t('views_booking.Status')}
      ]
    };
  },
  created() {
    if (this.isUserLogged()) {
      this.loadEvents({
        filter: {sort: {start: 'DESC'}},
        successCallback: (data) => {
          this.items = data.data;
        }
      });
    } else {
      let clientId = clientLocalStorageProvider.getClientId();
      if (clientId) {
        this.loadEvents({
          filter: {sort: {start: 'DESC'}, client: clientId},
          successCallback: (data) => {
            this.items = data.data;
          },
          failCallback: () => {
            this.$root.$bvToast.toast(this.$t('views_booking.You have no bookings or try to sign in!'), {
              toaster: 'b-toaster-bottom-left',
              variant: 'danger',
              appendToast: true,
              autoHideDelay: 4000
            });
          }
        });
      } else {
        this.$root.$bvToast.toast(this.$t('views_booking.You have no bookings or try to sign in!'), {
          toaster: 'b-toaster-bottom-left',
          variant: 'danger',
          appendToast: true,
          autoHideDelay: 4000
        });
      }
    }
  },
  methods: {
    ...mapGetters('account', {
      isUserLogged: 'isUserLogged',
    }),
    ...mapGetters('events', {
      getEventsList: 'getList',
    }),
    ...mapActions('events', {
      loadEvents: 'loadMy'
    }),
  }
}
</script>

<style scoped>

</style>
