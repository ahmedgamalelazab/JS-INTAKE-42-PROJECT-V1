import {Report} from "./Report.js";


export class AbsenceReport extends Report{

    constructor(report) {
        super(report);
        this.absenceReport  = true;
    }

    tojson() {
       const json = super.tojson();
       json.absenceReport = this.absenceReport;
       return json;
    }

    toarray() {
        return super.toarray().push(this.absenceReport);
    }

}