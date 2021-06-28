import AvailabilityApiProvider from "../../providers/api/AvailabilityApiProvider";
import SpecialHoursHelper from "../../helpers/SpecialHoursHelper";

let availabilityApiProvider = new AvailabilityApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        calendarCurrentView: null,
        specialHoursForCurrentView: null,
    },
    getters: {
        getList: state => state.list,
        getCalendarCurrentView: state => state.calendarCurrentView,
        getSpecialHoursForCurrentView: state => state.specialHoursForCurrentView,
    },
    actions: {
        load(context, {filter, successCallback, failCallback}) {
            availabilityApiProvider.getScheduleAvailability(
                filter,
                (data) => {
                    context.commit('load', data);
                    context.commit('loadSpecialHours', data);
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                failCallback
            );
        }
    },
    mutations: {
        load(state, payload) {
            state.list = payload;
        },
        loadSpecialHours(state, availability) {
            if (state.calendarCurrentView) {
                let result = {};
                for (let d = new Date(state.calendarCurrentView.startDate); d <= state.calendarCurrentView.endDate; d.setDate(d.getDate() + 1)) {
                    let key = d.toFormatString(1);
                    if (availability.hasOwnProperty(key)) {
                        let dayOfWeek = d.getDay();
                        if (!result.hasOwnProperty(dayOfWeek)) {
                            result[dayOfWeek] = [];
                        }
                        for (let range of availability[key]) {
                            let from = SpecialHoursHelper.timeStringToDate(range.from);
                            let to = SpecialHoursHelper.timeStringToDate(range.to);
                            result[dayOfWeek].push(
                                {
                                    from: from.getHours() * 60 + from.getMinutes(),
                                    to: to.getHours() * 60 + to.getMinutes(),
                                    class: 'business-hours'
                                }
                            );
                        }
                    }
                }

                state.specialHoursForCurrentView = result;
            }
        },
        setCalendarCurrentView(state, calendarCurrentView) {
            state.calendarCurrentView = calendarCurrentView
        }
    }
}
