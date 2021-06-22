export default class EventsLocalStorageProvider {

    getMyEvents() {
        let events = localStorage.getItem("myEvents");
        if (!events || events == 'null' || events == 'undefined' || events == '') {
            events = [];
        } else {
            events = JSON.parse(events);
        }

        return events;
    }

    addMyEvent(data) {
        let events = this.getMyEvents();
        events.push(data)

        localStorage.myEvents = JSON.stringify(events);
    }

}
