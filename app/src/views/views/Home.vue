<template>
  <div class="home">
    <div class="container marketing">
      <div class="general-description pt-5 pb-3">
        <div class="h1">{{ $t('views_home.What is this?') }}</div>
        <p>
          {{ $t('views_home.A tool for business whose processes are tied to a time frame / schedule, which will help respond to your customers in real time on issues such as: your work schedule, available booking time and contacts, and will provide an opportunity book time for your service, in other words - your personal Time Manager')}}
        </p>
      </div>

      <!-- START THE FEATURETTES -->

      <hr class="featurette-divider">
      <CompanySearch />
      <hr class="featurette-divider">

      <div class="row featurette pt-4">
        <div class="col-md-7">
          <h2 class="featurette-heading mb-5">{{ $t('views_home.Value for business') }}</h2>
          <p>{{ $t('views_home.Automate the filling of working time') }}</p>
          <p>{{ $t('views_home.Keep a list of your customers and their visit / service schedule in one place') }}</p>
          <p>{{ $t('views_home.Move the routine with the organization of the work schedule to the place created for this purpose and save in a convenient and consistent format') }}</p>
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-fluid mx-auto" src="@/assets/img/home/business-value.jpeg" alt="Business value">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette pt-4">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading mb-5">{{ $t('views_home.For your customers') }}</h2>
          <p class="lead">
            {{ $t('views_home.It will give you the opportunity to learn the details / work schedule at a time convenient for them without contacting the manager, track your work schedule and book your service time only by providing contact information for feedback') }}
          </p>
        </div>
        <div class="col-md-5 order-md-1">
          <img class="featurette-image img-fluid mx-auto" src="@/assets/img/home/clients-value.jpeg" alt="Clients value">
        </div>
      </div>

      <hr class="featurette-divider">

      <!-- Three columns of text below the carousel -->
      <h2 class="text-center">{{ $t('views_home.Key features') }}</h2>
      <div class="row pt-4 text-center">
        <div class="col-sm-4">
          <div>
            <img src="@/assets/img/home/icons/online-booking.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Booking') }}</h2>
          </div>
          <p>{{ $t('views_home.Ability to receive online reservations') }}</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-sm-4">
          <div>
            <img src="@/assets/img/home/icons/clients.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Clients') }}</h2>
          </div>
          <p>{{ $t('views_home.Keep a list of your customers and their contacts in a convenient format') }}</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-sm-4">
          <div>
            <img src="@/assets/img/home/icons/telegram.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Telegram bot') }}</h2>
          </div>
          <p>{{ $t('views_home.Set up a personal telegram bot that will inform you about new bookings') }}</p>
        </div><!-- /.col-lg-4 -->
      </div><!-- /.row -->

      <!-- /END THE FEATURETTES -->

    </div><!-- /.container -->

    <hr class="featurette-divider">

    <b-carousel
        id="carousel-home"
        :interval="4000000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Text slides with image -->
      <b-carousel-slide>
        <template #img>
          <img class="d-block img-fluid w-100" src="@/assets/img/home/slider/slide1.jpeg">
        </template>
      </b-carousel-slide>

      <!-- Slides with custom text -->
      <b-carousel-slide>
        <template #img>
          <img
              class="d-block img-fluid w-100"
              src="@/assets/img/home/slider/slide2.jpeg"
          >
        </template>
      </b-carousel-slide>

      <!-- Slides with image only -->
      <b-carousel-slide>
        <template #img>
          <img
              class="d-block img-fluid w-100"
              src="@/assets/img/home/slider/slide3.jpeg"
          >
        </template>
      </b-carousel-slide>

      <!-- Slides with img slot -->
      <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
      <b-carousel-slide>
        <template #img>
          <img
              class="d-block img-fluid w-100"
              src="@/assets/img/home/slider/slide4.jpeg"
          >
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from './HelloWorld.vue'
import {mapActions, mapGetters, mapMutations} from "vuex";
import CompanySearch from "../components/CompanySearch";

export default {
  name: 'Home',
  components: {
    CompanySearch,
    HelloWorld
  },
  methods: {
    ...mapGetters('company', {
      getCompanies: 'getList',
    }),
    ...mapActions('company', {
      loadCompanies: 'loadPublic'
    }),
  }
}
</script>
