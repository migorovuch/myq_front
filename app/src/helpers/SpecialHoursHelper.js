export default class SpecialHoursHelper {
    static timeStringToMinutes(timeString) {
        let [h, m] = timeString.split(':');

        return h * 60 + parseInt(m);
    }
    static minutesToTimeString(minutes) {
        if (Number.isInteger(minutes)) {
            let h = parseInt(minutes / 60);
            let m = parseInt(minutes % 60);

            return h + ':' + m;
        }

        return minutes;
    }
}
