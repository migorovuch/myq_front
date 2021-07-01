import AvailabilityApiProvider from "../../providers/api/AvailabilityApiProvider";
import SpecialHoursHelper from "../../helpers/SpecialHoursHelper";

let availabilityApiProvider = new AvailabilityApiProvider();

export default {
    namespaced: true,
    state: {
        list: [],
        calendarCurrentView: null,
        specialHoursForCurrentView: null,
        calendarTimeFrom: 0,
        calendarTimeTo: 24 * 60,
    },
    getters: {
        getList: state => state.list,
        getCalendarCurrentView: state => state.calendarCurrentView,
        getSpecialHoursForCurrentView: state => state.specialHoursForCurrentView,
        getCalendarTimeFrom: state => state.calendarTimeFrom,
        getCalendarTimeTo: state => state.calendarTimeTo,
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
                state.calendarTimeFrom = 24 * 60;
                state.calendarTimeTo = 0;
                for (let d = new Date(state.calendarCurrentView.startDate); d <= state.calendarCurrentView.endDate; d.setDate(d.getDate() + 1)) {
                    let key = d.sformat('yyyy-mm-dd');
                    if (availability.hasOwnProperty(key)) {
                        let dayOfWeek = d.getDay();
                        if (!dayOfWeek) {
                            dayOfWeek = 7;
                        }
                        if (!result.hasOwnProperty(dayOfWeek)) {
                            result[dayOfWeek] = [];
                        }
                        for (let range of availability[key]) {
                            let from = SpecialHoursHelper.timeStringToDate(range.from);
                            let to = SpecialHoursHelper.timeStringToDate(range.to);
                            let newRange = {
                                from: from.getHours() * 60 + from.getMinutes(),
                                to: to.getHours() * 60 + to.getMinutes(),
                                class: 'business-hours'
                            };
                            if (newRange.from < state.calendarTimeFrom) {
                                state.calendarTimeFrom = newRange.from;
                            }
                            if (newRange.to > state.calendarTimeTo) {
                                state.calendarTimeTo = newRange.to;
                            }
                            result[dayOfWeek].push(newRange);
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
