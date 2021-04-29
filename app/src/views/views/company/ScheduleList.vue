<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "ScheduleList",
    methods: {
      getScheduleList() {
        return [
          {name: 'First Schedule', enabled: true, available: false, bookingDuration: 0, minBookingTime: 0, maxBookingTime: 0, description: ''}
        ];
      },
    }
  }
</script>

<style scoped>

</style>
