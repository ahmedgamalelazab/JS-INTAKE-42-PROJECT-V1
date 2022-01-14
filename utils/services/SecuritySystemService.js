import {delay} from "../../libs/delay.js";

export class SecuritySystemService {

    constructor(notifyContract) {
        this.dateOfStartingService = "";
        this.securityUniqueKey = "";
        this.notifyingContract = notifyContract;
    }

    async stageService(dataOfStartingService, securityUniqueKey) {
        this.dateOfStartingService = dataOfStartingService;
        this.securityUniqueKey = securityUniqueKey;
    }

    async startAttendanceSystem() {
        if (this.notifyingContract) {
            this.notifyingContract.publish("AttendanceSystemInit", {
                status: true,
                message: `Attendance Service Staging ...`
            })
        }
        return new Promise(async (resolve, reject) => {
            if (this.dateOfStartingService && this.securityUniqueKey) {

                window.localStorage.setItem("SystemSecurityState", JSON.stringify({
                    startServiceDate: this.dateOfStartingService,
                    securityEmployeeUniqueId: this.securityUniqueKey
                }))
                //check for the localStorage if it filled then reuturn success
                const check = JSON.parse(window.localStorage.getItem("SystemSecurityState"));
                if (check) {
                    if (check.length !== 0) {
                        await delay(2500);
                        if (this.notifyingContract) {
                            this.notifyingContract.publish("SystemRunning", {
                                status: true,
                                message: 'AttendanceSystemRunningNow',
                                notificationSource: "AttendanceSystemNotifier"
                            })
                        }
                        resolve({
                            status: true,
                            message: 'AttendanceSystemRunningNow'
                        });
                    } else {
                        await delay(2500);
                        if (this.notifyingContract) {
                            this.notifyingContract.publish("SystemRunning", {
                                status: false,
                                message: `system not working pleas check the system!`,
                                notificationSource: "AttendanceSystemNotifier"
                            })
                        }
                        reject({
                            status: false,
                            message: "system not working pleas check the system!"
                        });
                    }
                } else {
                    await delay(2500);
                    if (this.notifyingContract) {
                        this.notifyingContract.publish("SystemRunning", {
                            status: true,
                            message: `system not working pleas check the system!`,
                            notificationSource: "AttendanceSystemNotifier"
                        })
                    }
                    reject({
                        status: false,
                        message: "system not working pleas check the system!"
                    });
                }
            } else {
                if (this.notifyingContract) {
                    this.notifyingContract.publish("SystemRunning", {
                        status: true,
                        message: `system not working pleas check the system!`,
                        notificationSource: "AttendanceSystemNotifier"
                    })
                }
                reject({
                    status: false,
                    message: "system not working pleas check the system!"
                });
            }
        })
    }

    async turnOffAttendanceSystem() {
        if (this.notifyingContract) {
            this.notifyingContract.publish("stoppingSystemInit", {
                status: true,
                message: `Attendance Service Staging ...`
            })
        }
        return new Promise(async (resolve, reject) => {
            if (this.dateOfStartingService && this.securityUniqueKey) {
                window.localStorage.setItem("SystemSecurityState", JSON.stringify({
                    stoppedServiceDate: this.dateOfStartingService,
                    securityEmployeeUniqueId: this.securityUniqueKey
                }))
                //check for the localStorage if it filled then reuturn success
                const check = JSON.parse(window.localStorage.getItem("SystemSecurityState"));
                if (check) {
                    if (check.length !== 0) {
                        await delay(2500);
                        if (this.notifyingContract) {
                            this.notifyingContract.publish("SystemStopped", {
                                status: true,
                                message: 'AttendanceSystemOffed',
                                notificationSource: "AttendanceSystemNotifier"
                            })
                        }
                        resolve({
                            status: true,
                            message: 'AttendanceSystemRunningNow'
                        });
                    } else {
                        await delay(2500);
                        if (this.notifyingContract) {
                            this.notifyingContract.publish("SystemStopped", {
                                status: false,
                                message: `system didn't stopped correctly!`,
                                notificationSource: "AttendanceSystemNotifier"
                            })
                        }
                        reject({
                            status: false,
                            message: "system not working pleas check the system!"
                        });
                    }
                } else {
                    await delay(2500);
                    if (this.notifyingContract) {
                        this.notifyingContract.publish("SystemStopped", {
                            status: true,
                            message: `system didn't stopped correctly!`,
                            notificationSource: "AttendanceSystemNotifier"
                        })
                    }
                    reject({
                        status: false,
                        message: "system not working pleas check the system!"
                    });
                }
            } else {
                if (this.notifyingContract) {
                    this.notifyingContract.publish("SystemStopped", {
                        status: true,
                        message: `system didn't stopped correctly!`,
                        notificationSource: "AttendanceSystemNotifier"
                    })
                }
                reject({
                    status: false,
                    message: "system not working pleas check the system!"
                });
            }
        })
    }
}