import ApiProvider from "./ApiProvider";

export default class ScheduleApiProvider extends ApiProvider {
    getScheduleList(idCompany, successCallback, failCallback) {
        let data = [{
            id: 1,
            idCompany: idCompany,
            name: 'First Schedule',
            enabled: false, // available for booking
            available: false, // Always available for booking or only in specialHours
            bookingDuration: 20,// seconds, 0 - manual setting for each booking
            minBookingTime: 2,// available only in case bookingDuration==0
            maxBookingTime: 70,// available only in case bookingDuration==0, 0 - no limit
            description: '',
            bookingCondition: 0, // All users or authenticated only
            acceptBookingCondition: 0, // Automaticly accept
        },{
            id: 2,
            idCompany: idCompany,
            name: 'Second Schedule',
            enabled: false, // available for booking
            available: false, // Always available for booking or only in specialHours
            bookingDuration: 0,// seconds, 0 - manual setting for each booking
            minBookingTime: 13,// available only in case bookingDuration==0
            maxBookingTime: 320,// available only in case bookingDuration==0, 0 - no limit
            description: '',
            bookingCondition: 0, // All users or authenticated only
            acceptBookingCondition: 0, // Automaticly accept
        }];
        successCallback(data);
        if(failCallback) {
            failCallback(data);
        }
        // this.get(
        //     'companies/my-company',
        //     null,
        //     data => {
        //         this.setToken(data.token);
        //         successCallback(data)
        //     },
        //     failCallback
        // );
    }
    getSchedule(id, successCallback, failCallback) {
        let data = {
            id: id,
            name: 'First Schedule',
            enabled: false, // available for booking
            available: true, // Always available for booking or only in specialHours
            bookingDuration: 0,// seconds, 0 - manual setting for each booking
            minBookingTime: 0,// available only in case bookingDuration==0
            maxBookingTime: 0,// available only in case bookingDuration==0, 0 - no limit
            description: '',
            bookingCondition: 0, // All users or authenticated only
            acceptBookingCondition: 0, // Automaticly accept
        };
        successCallback(data);
        if(failCallback) {
            failCallback(data);
        }
        // this.get(
        //     'companies/my-company',
        //     null,
        //     data => {
        //         this.setToken(data.token);
        //         successCallback(data)
        //     },
        //     failCallback
        // );
    }
}
