import {localStorageLoadAllUsersTool} from "../utils/tools/LocalStorageLoadAllUsersTool.js";

import {systemLoginStates} from "../utils/tools/SystemLoginState.js";

import {LocalStorageUpdateService} from "../utils/services/localStorageUpdate.js";

import {pubsub} from "../libs/pubsub.js";

const serviceUrl = "https://api.emailjs.com/api/v1.0/email/send";

let resizingFlag = false;

import {ResponsiveHelperTool} from "../utils/tools/responsiveHelperTool.js"
import {Employee} from "../models/Employee.js";
import {Report} from "../models/Report.js";
import {DepartureReport} from "../models/DepartureReport.js";
import {AttendanceReport} from "../models/attendanceReport.js";
import {LateReport} from "../models/LateReport.js";
import {ExcuseReport} from "../models/ExcuseReport.js";
import {AbsenceReport} from "../models/AbsenceReport.js";

const responsiveHelperTool = new ResponsiveHelperTool(window);

const mailerServiceNotifier = new pubsub();


$(document).ready(async function () {

    //handling screen issues
    responsiveHelperTool.controlResponsive("resize", resizingFlag, 990, function () {
        $('#user-image-preview').removeClass('img-fluid');
        $('#user-image-preview').addClass('w-25');
        $('#user-image-preview').addClass('h-50');
    }, function () {
        $('#user-image-preview').addClass('img-fluid');
        $('#user-image-preview').removeClass('w-25');
        $('#user-image-preview').removeClass('h-50');
    })

    //start to listen for updates from the Mailing service
    mailerServiceNotifier.subscribe("EmailingService", function (data) {
        const {status} = data;
        if (status === true) {
            //email sent successfully and user activated !
            //green message represent success
            $('#message-sent-successfully').show();
            //check the state of the button // button state connected with user state
            if ($('.active-user-btn').text() === 'activate') {
                $('#genericSuccessMessage').text("User Has been Activated successfully !");
            } else {
                $('#genericSuccessMessage').text("User Has been deactivated successfully !");
            }
        } else {
            //email didn't sent successfully and user activated !
            //display error message
            $('#message-sent-fail').show();
            if ($('.active-user-btn').text() === 'activate') {
                $('#genericeFailMessage').text("User Has not been Activated successfully !");
            } else {
                $('#genericeFailMessage').text("User Has not been deactivated successfully !");
            }
        }
    });

    //block and wait until loading up the data from the data base
    let _data, _original;
    let comparableUser;
    let reports;
    const convertedDataSource = [];

    try {
        const {data, original} = await localStorageLoadAllUsersTool();

        _data = data;
        _original = original;
    } catch (error) {
        console.log(error);
    }

    $('#data-table').DataTable({
        data: _data,
        "pageLength": 7,
        columns: [
            {title: "user name"},
            {title: "user email"},
            {title: "user type"},
            {title: "account state"}
        ]
    });

    //getting the data from the table
    $('#data-table').on('click', 'td', function () {
        var cellData = $('#data-table').DataTable().row(this).data();
        console.log(cellData);
        console.log(_original);
        _original.forEach((user) => {
            if (user.email.toString().toLowerCase() === cellData[1].toString().toLowerCase()) {
                console.log(cellData);
                comparableUser = user;
                $('#user-name-left').text(cellData[0]);
                if (user.userBriefReport === "") {
                    $('.card-text').text(`${cellData[0]} account need to be activated !`);
                    $('.active-user-btn').text("activate");
                } else if (cellData[3] === systemLoginStates.notValid) {
                    $('.active-user-btn').text("activate");
                } else {
                    $('.active-user-btn').text("deactivate");
                }
            }
        })
    });


    $('.active-user-btn').on("click", async function () {
        if (comparableUser.userType.toLowerCase() === 'employee') {
            if ($(this).text() === 'activate') {
                const storageUpdateService = new LocalStorageUpdateService("userData");
                comparableUser.valid = systemLoginStates.valid;
                comparableUser.gainSystemAccess = systemLoginStates.gainedSystemAccess;
                comparableUser.uniqueName = `${Date.now()}${comparableUser.firstName}vally`;
                comparableUser.password = `${Date.now()}${comparableUser.lastName}vally`;
                const newEmp = new Employee(comparableUser.firstName,comparableUser.lastName,comparableUser.address,comparableUser.email,comparableUser.age);
                newEmp.uniqueName = comparableUser.uniqueName;
                newEmp.userType = "Employee";
                newEmp.valid = comparableUser.valid;
                newEmp.gainSystemAccess = comparableUser.gainSystemAccess;
                newEmp.password = comparableUser.password;
                newEmp.briefReport = "none";
                newEmp.state = "offline";
                newEmp.userAttendanceDate = "";
                console.log(comparableUser);
                try {

                    //sending email to the user carrying the new user name and the password
                    const sendMailServiceInstance = new MailingService(serviceUrl, mailerServiceNotifier);

                    sendMailServiceInstance.setMailingData({
                        service_id: "service_3s8tdtl",
                        template_id: "template_rkllm6r",
                        user_id: "user_9RQgEt6lPmdWEPwoOu2UB",
                        template_params: {
                            user_email: comparableUser.email,
                            user_name: comparableUser.uniqueName,
                            user_password: comparableUser.password,
                            message: `Your account got activated .. pleas we are expecting from
                       to be hard working so pleas don't fail us ! `
                        },
                    });

                    try {
                        await sendMailServiceInstance.sendMail();

                        await storageUpdateService.updateUserInLocalStorage(newEmp);

                    } catch (error) {
                        console.log(error);
                    }

                } catch (error) {
                    console.log(error);
                }
            } else {
                const storageUpdateService = new LocalStorageUpdateService("userData");
                comparableUser.valid = systemLoginStates.notValid;
                comparableUser.gainSystemAccess = systemLoginStates.provokedSystemAccess;
                comparableUser.uniqueName = ``;
                comparableUser.password = ``;
                console.log(comparableUser);
                try {

                    //sending email to the user carrying the new user name and the password


                    const sendMailServiceInstance = new MailingService(serviceUrl, mailerServiceNotifier);

                    sendMailServiceInstance.setMailingData({
                        service_id: "service_3s8tdtl",
                        template_id: "template_rkllm6r",
                        user_id: "user_9RQgEt6lPmdWEPwoOu2UB",
                        template_params: {
                            user_email: comparableUser.email,
                            user_name: comparableUser.uniqueName,
                            user_password: comparableUser.password,
                            message: `your account has been banned for 3 months , u can
                             cooperate with us again after but next ban we won't accept u again as employee any more`
                        },
                    });

                    try {
                        await sendMailServiceInstance.sendMail();

                        await storageUpdateService.updateUserInLocalStorage(comparableUser);

                    } catch (error) {
                        console.log(error);
                    }

                } catch (error) {
                    console.log(error);
                }
            }
        }

    })
    //
    // //convert to readable table
    //     debugger;
    //     //listen for the full reports
    //     $('#full-table').DataTable({
    //         data: convertedDataSource,
    //         "pageLength": 7,
    //         columns: [
    //             {title: "U name"},
    //             {title: "U-email"},
    //             {title: "U-Departure"},
    //             {title: "report date"},
    //             {title: "sec-note"},
    //             {title: "report-id"},
    //             {title: "U-ID"},
    //             {title: "U-ID"},
    //             {title: "U-ID"},
    //
    //
    //
    //
    //         ]
    //     });
    //
    //
    //     //listen for the full reports
    //     $('#late-table').DataTable({
    //         data: lateDataResource,
    //         "pageLength": 7,
    //         columns: [
    //             {title: "U name"},
    //             {title: "U-email"},
    //             {title: "user departure"},
    //             {title: "attendance data"},
    //             {title: "sec-note"},
    //             {title: "report-id"},
    //             {title: "report"},
    //             {title: "repoort"},
    //             {title: "repoort"},
    //             {title: "rooot"},
    //
    //         ]
    //     });
    //
    //
    // //listen for the full reports
    // $('#excuse-table').DataTable({
    //     data: excuseReportDataSource,
    //     "pageLength": 7,
    //     columns: [
    //         {title: "U name"},
    //         {title: "U-email"},
    //         {title: "U-Departure"},
    //         {title: "report date"},
    //         {title: "sec-note"},
    //         {title: "report-id"},
    //         {title: "U-ID"},
    //         {title: "U-ID"},
    //         {title: "U-ID"},
    //         {title: "U-ID"},
    //
    //     ]
    // });
    //



    //handle if the admin clicked to leave
    $('#unique-logout').on("click", function () {
        confirm("you sure u need to logout sir ! ? ");
        if (confirm) {
            setTimeout("location.href = 'system.html';", 1500);
            window.localStorage.setItem('superData',JSON.stringify([]));
        }
    })

    //close messages
    $('.btn-close').on("click", function () {
        setTimeout('location.reload();', 500);
    })

});