<template>
  <div>
    <div class="time-range-widget">
      <div class="time-line"></div>
      <div class="unavailable-line" v-for="(line, key) in unavailableLine" :key="key" :style="line.style"></div>
      <div class="booking-time" :style="selectedTimeOptions.style">
        <div class="booking-time-wrap">
          <span class="booking-start">{{start}}</span>
          <span class="booking-end">{{end}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpecialHoursHelper from "../../helpers/SpecialHoursHelper";

export default {
  name: "TimeLine",
  props: {
    start: String,
    end: String,
    availability: Array
  },
  data() {
    return {
      percentageOfTimeline: 30,
      startMinutes: SpecialHoursHelper.timeStringToMinutes(this.start),
      endMinutes: SpecialHoursHelper.timeStringToMinutes(this.end),
      selectedTimeOptions: {},
      timeRangeFrom: SpecialHoursHelper.timeStringToMinutes(this.start),
      timeRangeTo: SpecialHoursHelper.timeStringToMinutes(this.end),
      unavailableLine:[]
    };
  },
  watch: {
    start() {
      this.recalculate();
    },
    end() {
      this.recalculate();
    },
    availability() {
      this.recalculate();
    },
  },
  methods: {
    recalculate() {
      this.unavailableLine = [];
      this.startMinutes = SpecialHoursHelper.timeStringToMinutes(this.start);
      this.endMinutes = SpecialHoursHelper.timeStringToMinutes(this.end);
      let width = this.endMinutes - this.startMinutes;
      let onePercentMinutes = width / this.percentageOfTimeline;
      let restOfTimeline = parseInt(onePercentMinutes * ((100 - this.percentageOfTimeline) / 2));
      this.timeRangeFrom = this.startMinutes - restOfTimeline;
      this.timeRangeTo = this.endMinutes + restOfTimeline;
      this.selectedTimeOptions = {
        style: {
          width: (width / onePercentMinutes) + '%',
          left: ((this.startMinutes - this.timeRangeFrom) * onePercentMinutes) + '%'
        }
      };

      let unavailability = [];
      let uFrom = 0;
      let uTo = 24 * 60 * 60;
      for (let range of this.availability) {
        uTo = SpecialHoursHelper.timeStringToDate(range.from);
        uTo = uTo.getHours() * 60 + uTo.getMinutes();
        unavailability.push({from: uFrom + 0, to: uTo + 0});
        uFrom = SpecialHoursHelper.timeStringToDate(range.to);
        uFrom = uFrom.getHours() * 60 + uFrom.getMinutes();
      }
      for (let range of unavailability) {
        if (
            range.from >= this.timeRangeFrom && range.from <= this.timeRangeTo ||
            range.to >= this.timeRangeFrom && range.to <= this.timeRangeTo
        ) {
          if (range.from < this.timeRangeFrom) {
            range.from = this.timeRangeFrom;
          }
          if (range.to > this.timeRangeTo) {
            range.to = this.timeRangeTo
          }
          width = range.to - range.from;
          this.unavailableLine.push({
            style: {
              width: (width / onePercentMinutes) + '%',
              left: ((range.from - this.timeRangeFrom) * onePercentMinutes) + '%'
            }
          });
        }
      }
    }
  }
}
</script>

<style scoped>
.time-range-widget > div {
  position: absolute;
}

.time-range-widget {
  position: relative;
  max-width: 400px;
  margin: auto;
  height: 20px;
}

.time-line {
  width: 100%;
  height: 4px;
  background-color: gray;
  top: 8px;
}

.unavailable-line {
  height: 4px;
  background-color: red;
  top: 8px;
}

.booking-time {
  top: 8px;
  height: 4px;
  background-color: blue;
}

.booking-time-wrap {
  position: relative;
  top: -8px;
}

.booking-start, .booking-end {
  position: absolute;
  background-color: blue;
  color: white;
  padding: 1px 2px;
}

.booking-start {
  left: 0;
}

.booking-end {
  right: 0;
}
</style>
