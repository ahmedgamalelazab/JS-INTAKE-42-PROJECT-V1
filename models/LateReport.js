import {Report} from "./Report.js";


export class LateReport extends Report{

    constructor(report) {
        super(report);
        this.lateReport  = true;
    }

    tojson() {
        const json = super.tojson();
        json.lateReport = this.lateReport;
        return json;
    }

    toarray() {
        return super.toarray().push(this.lateReport);
    }

}