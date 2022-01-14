import {Report} from "./Report.js";


export class DepartureReport extends Report{

    constructor(report) {
        super(report);
        this.departureReport = true;
        this.attendanceTime = "";
        this.confirmed = true;
        this.confirmedOn = Date.now();
        this.departureTime = Date.now();
        this.reasonOfLeaving = "";
    }


    tojson() {
        const json =  super.tojson();
        json.departureReport = this.departureReport;
        json.reasonOfLeaving = this.reasonOfLeaving;
        return json;
    }

    toarray() {
        const superArr =  super.toarray();
        superArr.push(this.departureReport);
        superArr.push(this.reasonOfLeaving);
        return superArr;
    }


}