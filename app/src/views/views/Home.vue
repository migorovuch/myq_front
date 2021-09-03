<template>
  <div class="home">
    <div class="container marketing">
      <div class="general-description pt-5 pb-3">
        <div class="h1">{{ $t('views_home.What is this?') }}</div>
        <p>
          Інструмент для бізнесу, процеси якого прив'язані до часових рамок/графіку
          Система онлайн для бізнесу, процеси якого прив'язані до часових рамок/графіку,
          яка допоможе відповісти вашим клієнтам в режимі реального часу
          на такі питання як: ваш графік роботи, доступний для бронювання час та контакти, а також дасть можливість
          забронювати час вашого сервісу, іншими словами - ваш особистий Менеджер Часу
        </p>
      </div>

    <hr class="featurette-divider">

      <!-- Three columns of text below the carousel -->
      <div class="row pt-5">
        <div class="col-lg-4">
          <div class="text-center">
            <img src="@/assets/img/home/icons/online-booking.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Booking') }}</h2>
          </div>
          <p>можливість отримувати онлайн бронювання</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <div class="text-center">
            <img src="@/assets/img/home/icons/clients.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Clients') }}</h2>
          </div>
          <p>Зберігайте список своїх клієнтів і їх контакти в зручному форматі</p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <div class="text-center">
            <img src="@/assets/img/home/icons/telegram.svg" alt="Generic placeholder image" width="140" height="140">
            <h2>{{ $t('views_home.Telegram bot') }}</h2>
          </div>
          <p>Налаштуйте особисти телеграм бот, який буде інформувати вас про нові бронювання</p>
        </div><!-- /.col-lg-4 -->
      </div><!-- /.row -->

      <!-- START THE FEATURETTES -->

      <hr class="featurette-divider">

      <div class="row featurette pt-5">
        <div class="col-md-7">
          <h2 class="featurette-heading mb-5">Значення для бізнесу</h2>
          <p>Автоматизуйте наповнення робочого часу</p>
          <p>Зберігайте список своїх клієнтів і графік їх відвідування/обслуговування в одному місці</p>
          <p>Перенесіть рутину з організацією графіку роботи в місце яке було створено для цього та зберігайте у зручному і консистентному форматі</p>
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-fluid mx-auto" src="@/assets/img/home/business-value.jpeg" alt="Business value">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette pt-5">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading mb-5">Для ваших клієнтів</h2>
          <p class="lead">
            Дасть можливість дізнавайтесь деталі/графік роботи в зручний для них час без контактування з менеджером, відслідковувати ваш робочий графік і самостійно бронювати час вашого сервісу лише вказавши контактні дані для зворотного зв'язку
          </p>
        </div>
        <div class="col-md-5 order-md-1">
          <img class="featurette-image img-fluid mx-auto" src="@/assets/img/home/clients-value.jpeg" alt="Clients value">
        </div>
      </div>

      <hr class="featurette-divider">

      <!-- /END THE FEATURETTES -->

    </div><!-- /.container -->

    <b-carousel
        id="carousel-home"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"
      ></b-carousel-slide>

      <!-- Slides with custom text -->
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
        <h1>Hello world!</h1>
      </b-carousel-slide>

      <!-- Slides with image only -->
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=58"></b-carousel-slide>

      <!-- Slides with img slot -->
      <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
      <b-carousel-slide>
        <template #img>
          <img
              class="d-block img-fluid w-100"
              width="1024"
              height="480"
              src="https://picsum.photos/1024/480/?image=55"
              alt="image slot"
          >
        </template>
      </b-carousel-slide>

      <!-- Slide with blank fluid image to maintain slide aspect ratio -->
      <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
          a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.
        </p>
      </b-carousel-slide>
    </b-carousel>

    <div class="container">
      <div class="row">
        <div class="col-3" v-for="(company, key) in getCompanies()" :key="key">
          <router-link :to="{name: 'company_vue', params:{id: company.id}}">{{company.name}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from './HelloWorld.vue'
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created() {
    this.loadCompanies({filter:{}});
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
