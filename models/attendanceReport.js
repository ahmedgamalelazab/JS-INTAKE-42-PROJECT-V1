import {Report} from "./Report.js";


export class AttendanceReport extends Report{

    constructor(report) {
        super(report);
        this.attendanceReport  = true;
    }

    tojson() {
        const json = super.tojson();
        json.attendanceReport = this.attendanceReport;
        return json;
    }

    toarray() {
        return super.toarray().push(this.attendanceReport);
    }

}