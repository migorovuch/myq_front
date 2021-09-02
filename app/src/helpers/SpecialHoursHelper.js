export default class SpecialHoursHelper {
    static timeStringToMinutes(timeString) {
        let [h, m] = timeString.split(':');

        return h * 60 + parseInt(m);
    }
    static minutesToTimeString(minutes) {
        if (Number.isInteger(minutes)) {
            let h = parseInt(minutes / 60);
            let m = parseInt(minutes % 60);

            return h + ':' + (m < 10 ? '0' + m : m);
        }

        return minutes;
    }

    static timeStringToDate(timeString, utc = true) {
        let time = timeString.split(':');
        let date = new Date();
        if (utc) {
            date.setUTCHours(time[0]);
            date.setUTCMinutes(time[1]);
        } else {
            date.setHours(time[0]);
            date.setMinutes(time[1]);
        }

        return date;
    }
}
