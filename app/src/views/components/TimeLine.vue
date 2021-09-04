<template>
  <div>
    <div class="time-range-widget mb-3">
      <div class="time-line">
        <div class="time-line-point-wrap">
          <div class="time-line-point" v-for="(timePoint, key) in timePoints" :key="key" :style="timePoint.style">
            <span v-if="'text' in timePoint">{{timePoint.text}}</span>
          </div>
        </div>
      </div>
      <div class="unavailable-line" v-for="(line, key) in unavailableLine" :key="key" :style="line.style"></div>
      <div class="booking-time" :style="selectedTimeOptions.style">
        <div class="booking-time-wrap">
          <span class="booking-start">{{startDateFormatted}}</span>
          <span class="booking-end">{{endDateFormatted}}</span>
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
      timePoints: [],
      selectedTimeOptions: {},
      unavailableLine:[]
    };
  },
  computed: {
    startDateFormatted() {
      if (this.start) {
        return SpecialHoursHelper.timeStringToDate(this.start, false).sformat('HH:MM');
      }
      return '';
    },
    endDateFormatted() {
      if (this.end) {
        return SpecialHoursHelper.timeStringToDate(this.end, false).sformat('HH:MM');
      }
      return '';
    }
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
      const percentageOfTimeline = 30;
      const timePointLength = 7.5;
      this.unavailableLine = [];
      let startMinutes = SpecialHoursHelper.timeStringToMinutes(this.start);
      let endMinutes = SpecialHoursHelper.timeStringToMinutes(this.end);
      let duration = endMinutes-startMinutes;
      let onePercentMinutes = duration / percentageOfTimeline;
      let restOfTimeline = onePercentMinutes * ((100 - percentageOfTimeline) / 2);
      let timeRangeFrom = startMinutes - restOfTimeline;
      let timeRangeTo = endMinutes + restOfTimeline;
      let timePointsFrom = Math.floor(timeRangeFrom / timePointLength) * timePointLength;
      let timePointsTo = (Math.floor(timeRangeTo / timePointLength) * timePointLength) + timePointLength;
      this.timePoints = [];
      for (let i = timePointsFrom; i < timePointsTo;i+=timePointLength) {
        if (i >= timeRangeFrom && i <= timeRangeTo) {
          let timePoint = {
            style: {
              width: (timePointLength / onePercentMinutes) + '%',
              left: ((i - timeRangeFrom) * onePercentMinutes) + '%'
            }
          };
          if (i % 60 === 0 && (i < startMinutes || i > endMinutes)) {
            timePoint.text = SpecialHoursHelper.minutesToTimeString(i);
          }
          this.timePoints.push(timePoint);
        }
      }
      this.selectedTimeOptions = {
        style: {
          width: (duration / onePercentMinutes) + '%',
          left: ((startMinutes - timeRangeFrom) * onePercentMinutes) + '%'
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
      unavailability.push({from: uFrom + 0, to: (24 * 60 * 60)});
      for (let range of unavailability) {
        if (
            range.from >= timeRangeFrom && range.from <= timeRangeTo ||
            range.to >= timeRangeFrom && range.to <= timeRangeTo
        ) {
          if (range.from < timeRangeFrom) {
            range.from = timeRangeFrom;
          }
          if (range.to > timeRangeTo) {
            range.to = timeRangeTo
          }
          duration = range.to - range.from;
          this.unavailableLine.push({
            style: {
              width: (duration / onePercentMinutes) + '%',
              left: ((range.from - timeRangeFrom) * onePercentMinutes) + '%'
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
  max-width: 500px;
  margin: auto;
  height: 20px;
}

.time-line {
  width: 100%;
  height: 18px;
  border: 1px solid #dee2e6;
  top: 0;
  overflow: hidden;
}

.time-line-point-wrap {
  position: relative;
}

.time-line-point {
  position: absolute;
  font-size: 14px;
  height: 16px;
  /*border-left: 1px solid #dee2e6;*/
  line-height: initial;
}

.unavailable-line {
  height: 2px;
  background-color: red;
  top: 18px;
}

.booking-time {
  top: 0;
  height: 18px;
  background-color: #2eb85c;
}

.booking-time-wrap {
  position: relative;
}

.booking-start, .booking-end {
  position: absolute;
  color: white;
  padding: 0px 2px;
  font-size: 14px;
  line-height: initial;
}

.booking-start {
  left: 0;
}

.booking-end {
  right: 0;
}
</style>
