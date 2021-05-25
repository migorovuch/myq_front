import ApiProvider from "./ApiProvider";

export default class SpecialHoursApiProvider extends ApiProvider {
    getSpecialHours(idSchedule, successCallback, failCallback) {
        let dailyHours = () => {
            return {from: '09:00', to: '18:00'}
        };
        let specialHours = [
            {
                id: 1,
                idSchedule: idSchedule,
                ranges: [dailyHours()],
                startDate: new Date('2021-04-25'),
                endDate: new Date('2021-10-20'),
                repeat: 1,
                repeatDay: 0,
                repeatDate: new Date('2021-04-29'),
            },
            {
                id: 2,
                idSchedule: idSchedule,
                ranges: [
                    {from: '09:00', to: '12:00'},
                    {from: '14:00', to: '18:00'}
                ],
                startDate: new Date('2021-04-25'),
                endDate: new Date('2021-10-20'),
                repeat: 1,
                repeatDay: 1,
                repeatDate: new Date('2021-04-26'),
            },
            {
                id: 3,
                idSchedule: idSchedule,
                ranges: [dailyHours()],
                startDate: new Date('2021-04-25'),
                endDate: new Date('2021-10-20'),
                repeat: 1,
                repeatDay: 3,
                repeatDate: new Date('2021-04-27'),
            },
        ];
        if (idSchedule === 2) {
            specialHours = [
                {
                    id: 1,
                    idSchedule: idSchedule,
                    ranges: [dailyHours()],
                    startDate: new Date('2021-04-25'),
                    endDate: new Date('2021-10-20'),
                    repeat: 1,
                    repeatDay: 0,
                    repeatDate: new Date('2021-04-29'),
                }
            ];
        }
        if (successCallback) {
            successCallback(specialHours);
        }

        return specialHours;
    }
}
