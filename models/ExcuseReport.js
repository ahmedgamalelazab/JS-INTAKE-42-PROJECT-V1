import {Report} from "./Report.js";


export class ExcuseReport extends Report{

    constructor(report) {
        super(report);
        this.excuseReport  = true;
    }

    tojson() {
        const json = super.tojson();
        json.excuseReport = this.excuseReport;
        return json;
    }

    toarray() {
        return super.toarray().push(this.excuseReport);
    }

}