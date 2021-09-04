<template>
  <b-container class="pt-3">
    <BookingsList :items="items" :fields="fields" />
  </b-container>
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
        filter: {sort: {start: 'DESC'}, user: this.getUserData().id},
        successCallback: (data) => {
          this.items = data.data;
        }
      });
    } else {
      let clientIds = clientLocalStorageProvider.getClientIdList();
      if (clientIds) {
        this.loadEvents({
          filter: {sort: {start: 'DESC'}, clients: clientIds},
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
      getUserData: 'getUserData'
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
