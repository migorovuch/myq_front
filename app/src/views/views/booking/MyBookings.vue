<template>
  <BookingsList :items="items"/>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BookingsList from "./BookingsList";
import EventsLocalStorageProvider from "../../../providers/localStorage/EventsLocalStorageProvider";

let eventsLocalStorageProvider = new EventsLocalStorageProvider();

export default {
  name: "MyBookings",
  components: {BookingsList},
  data() {
    return {
      items: []
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
      this.items = eventsLocalStorageProvider.getMyEvents();
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
