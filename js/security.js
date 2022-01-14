import {localStorageLoadAllUsersTool} from "../utils/tools/LocalStorageLoadAllUsersTool.js";

import {validateDataTemplateService} from "../utils/services/validationService.js";

import {systemLoginStates} from "../utils/tools/SystemLoginState.js";

import {LocalStorageUpdateService} from "../utils/services/localStorageUpdate.js";

import {pubsub} from "../libs/pubsub.js";

import {LongPoolingService} from "../utils/services/LongPoolingService.js";

import {SecuritySystemService} from "../utils/services/SecuritySystemService.js";

import {localStorageToGateValidator} from "../utils/tools/localStorageSearcher.js";

import {ResponsiveHelperTool} from "../utils/tools/responsiveHelperTool.js"

import {UserAttendanceRequestPoolingService} from "../utils/services/UserAttendanceRequestPoolingService.js";
import {Report} from "../models/Report.js";

import {LocalStorageReportService} from "../utils/services/localStorageReportService.js";

const serviceUrl = "https://api.emailjs.com/api/v1.0/email/send";

let resizingFlag = false;


const responsiveHelperTool = new ResponsiveHelperTool(window);

const attendanceSystemNotifier = new pubsub();


const securitySystemService = new SecuritySystemService(attendanceSystemNotifier);

const poolingDeadlyService = new LongPoolingService(attendanceSystemNotifier, "systemRunning"); //pooling

//this pooling won't stop at all during the life cycle of the security but only it will stop on user leaving
const employeeAttendancePooling = new UserAttendanceRequestPoolingService(attendanceSystemNotifier,"userData");

let SystemRunningRunning;

let comparableUser;

let cellData;

import {ReportsMapper} from "../utils/tools/ReportsIds.js";

import {LateReport} from "../models/LateReport.js";
import {AbsenceReport} from "../models/AbsenceReport.js";
import {ExcuseReport} from "../models/ExcuseReport.js";
import {AttendanceReport} from "../models/attendanceReport.js";
import {delay} from "../libs/delay.js";
import {DepartureReport} from "../models/DepartureReport.JS";


// what i need to do before refactoring all this shitty code i have coded along !
//i have an event and i wanna to listen on this events to start classify the whole application reports into multiple  reports
//[when i submit a report it's not make sense to go to locale storage maybe i wont confirm the process]
//[we will trigger a listener for the whole process rather than store in the locale storage]




const reportMapper = {
        attendanceReportPicked:"attendaceReportPicked",
        absenceReportPicked:"absenceReportPicked",
        excuseReportPicked:"excuseReportPicked",
        lateReportPicked:"lateReportPicked",
        departurePicked:"departurePicked"

}

const confirmingAttendanceEventMapper = {
    confirmedAsAttended:"confirmedAsAttended",
    confirmedAsDeparture:"confirmedAsDeparture"
}

//subscribe on picking a report

attendanceSystemNotifier.subscribe(reportMapper.attendanceReportPicked,async function (data){
        const {modal,report} = data;
        $('.active-user-btn').removeClass("disabled");
        $('.active-user-btn').html("Confirm Attendance");
      const attendanceReport = new AttendanceReport(report);
      console.log(attendanceReport);
      await delay(2000);
      modal.hide();
    $('.active-user-btn').on("click",async function(){
        $(this).html(`
          <div id="loading-system-state" class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>   
        `)
        $(this).addClass("disabled");
        comparableUser.attendanceTime = "";
        comparableUser.attendanceConfirmed = true;
        comparableUser.attendanceConfirmedOn = Date.now();
        comparableUser.departureConfirmedOn = "" || "";
        comparableUser.departureConfirmed = false;
        // await storageUpdateService.updateUserInLocalStorage(comparableUser);
        console.log(comparableUser);
        updateAndPushIntoLocalStorage(comparableUser,function (error){
            console.log(error);
        });
        attendanceReport.confirmed = true;
        attendanceReport.confirmedOn = Date.now();
        console.log(attendanceReport);
        let reportService = new LocalStorageReportService(attendanceSystemNotifier);
        await reportService.setData(attendanceReport);
        await reportService.submitData("Report");

        $(this).html(`
            Confirmed successfully
        `)
        await delay(1500);
        location.reload();
    });
})
attendanceSystemNotifier.subscribe(reportMapper.excuseReportPicked,async function (data){
        const {modal,report} = data;
      $('.active-user-btn').removeClass("disabled");
    $('.active-user-btn').html("Confirm Excuse Attendance");
    const excuseReport = new ExcuseReport(report);
    await delay(2000);
    modal.hide();
    $('.active-user-btn').on("click",async function(){
        $(this).html(`
          <div id="loading-system-state" class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>   
        `)
        $(this).addClass("disabled");
        comparableUser.attendanceTime = "";
        comparableUser.attendanceConfirmed = true;
        comparableUser.attendanceConfirmedOn = 0;
        comparableUser.departureConfirmedOn = "" || "";
        comparableUser.departureConfirmed = false;
        // await storageUpdateService.updateUserInLocalStorage(comparableUser);
        console.log(comparableUser);
        updateAndPushIntoLocalStorage(comparableUser,function (error){
            console.log(error);
        });
        excuseReport.confirmed = true;
        excuseReport.confirmedOn = Date.now();
        console.log(excuseReport);
        let reportService = new LocalStorageReportService(attendanceSystemNotifier);
        await reportService.setData(excuseReport);
        await reportService.submitData("Report");

        $(this).html(`
            Confirmed successfully
        `)
        await delay(1500);
        location.reload();
    });

})
attendanceSystemNotifier.subscribe(reportMapper.lateReportPicked,async function (data){
    const {modal,report} = data;
    // this is better than pushing it to the localStorage
    $('.active-user-btn').removeClass("disabled");
    $('.active-user-btn').html("Confirm Late Attendance");
    const lateAttendanceReport = new LateReport(report);
    await delay(2000);
    modal.hide();
    $('.active-user-btn').on("click",async function(){
        $(this).html(`
          <div id="loading-system-state" class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>   
        `)
        $(this).addClass("disabled");
        comparableUser.attendanceTime = "";
        comparableUser.attendanceConfirmed = true;
        comparableUser.attendanceConfirmedOn = Date.now();
        comparableUser.departureConfirmedOn = "" || "";
        comparableUser.departureConfirmed = false;
        // await storageUpdateService.updateUserInLocalStorage(comparableUser);
        console.log(comparableUser);
        updateAndPushIntoLocalStorage(comparableUser,function (error){
            console.log(error);
        });
        lateAttendanceReport.confirmed = true;
        lateAttendanceReport.confirmedOn = Date.now();
        console.log(lateAttendanceReport);
        let reportService = new LocalStorageReportService(attendanceSystemNotifier);
        await reportService.setData(lateAttendanceReport);
        await reportService.submitData("Report");

        $(this).html(`
            Confirmed successfully
        `)
        await delay(1500);
        location.reload();
    });
})
attendanceSystemNotifier.subscribe(reportMapper.absenceReportPicked,async function (data){
      const {modal , report} = data;
      $('.active-user-btn').removeClass("disabled");
     $('.active-user-btn').html("Confirm absence");
    const absenceReport = new AbsenceReport(report);
    await delay(2000);
    modal.hide();
    $('.active-user-btn').on("click",async function(){
        $(this).html(`
          <div id="loading-system-state" class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>   
        `)
        $(this).addClass("disabled");
        comparableUser.attendanceTime = "";
        comparableUser.attendanceConfirmed = true;
        comparableUser.attendanceConfirmedOn = 0;
        comparableUser.departureConfirmedOn = "" || "";
        comparableUser.departureConfirmed = false;
        // await storageUpdateService.updateUserInLocalStorage(comparableUser);
        console.log(comparableUser);
        updateAndPushIntoLocalStorage(comparableUser,function (error){
            console.log(error);
        });
        absenceReport.confirmed = true;
        absenceReport.confirmedOn = Date.now();
        console.log(absenceReport);
        let reportService = new LocalStorageReportService(attendanceSystemNotifier);
        await reportService.setData(absenceReport);
        await reportService.submitData("Report");
        $(this).html(`
            Confirmed successfully
        `)
        await delay(1500);
        location.reload();
    });
})

attendanceSystemNotifier.subscribe(reportMapper.departurePicked,async function(data){
    const {modal , report} = data;

    $('.active-user-btn').html("confirming in progress ..");
    await delay(2000);
    modal.hide();
        $('.active-user-btn').addClass("disabled");
        comparableUser.attendanceTime = "";
        comparableUser.attendanceConfirmed = false;
        comparableUser.attendanceConfirmedOn = ""||"";
        comparableUser.departureConfirmedOn = Date.now();
        comparableUser.departureConfirmed = true;
        console.log(comparableUser);
        updateAndPushIntoLocalStorage(comparableUser,function (error){
            console.log(error);
        });
        let reportService = new LocalStorageReportService(attendanceSystemNotifier);
        await reportService.setData(report);
        await reportService.submitData("Report");
        $('.active-user-btn').html(`
            Confirmed successfully
        `)
        await delay(1500);
        location.reload();

})




//document listen on the service and wait for a notification
attendanceSystemNotifier.subscribe("SystemRunning", function (data) {
    // const {status , message } = data; // not gonna do anything with the data btw !
    //update security dash board
    $('#turn-system-on-btn').html(`
       <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">System Running</span>        
      </div>
    `);
    let myModalEl = document.getElementById('staticBackdrop');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    console.log(modal);
    modal.hide();
    let toast = new bootstrap.Toast($('#liveToast'));
    $('#system-turn-on-button').html(`Turn off the System`);
    //fix this code later on
    let systemRunning = true;
    window.localStorage.setItem("systemRunning", JSON.stringify({
        systemRunning
    }));
    toast.show();
    employeeAttendancePooling.startPooling(10000);
})




attendanceSystemNotifier.subscribe("AttendanceSystemInit", function (data) {
    const {status, message} = data;
    $('#turn-system-on-btn').html(`
      <div id="loading-system-state" class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>     
    `);
    $('#system-turn-on-button').html(`
      <div id="loading-system-state" class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>  
    `)
})

attendanceSystemNotifier.subscribe("stoppingSystemInit", function (data) {
    const {status, message} = data;
    $('#turn-system-on-btn').html(`
      <div id="loading-system-state" class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>     
    `);
    $('#system-turn-on-button').html(`
      <div id="loading-system-state" class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>  
    `)
})

//it will be listening on the system state
attendanceSystemNotifier.subscribe("SystemStopped", function () {
    employeeAttendancePooling.stopPooling();
    SystemRunningRunning = false;
    //stopping the pooling
    // poolingDeadlyService.startPooling(); // no need to back and listen again if the system shut down
    let systemRunning = false;
    window.localStorage.setItem("systemRunning", JSON.stringify({
        systemRunning
    }));
    $('#turn-system-on-btn').html(`
       <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">stopping system</span>        
      </div>
    `);
    let myModalEl = document.getElementById('staticBackdrop');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    console.log(modal);
    modal.hide();
    let toast = new bootstrap.Toast($('#liveToast'));
    $("#toast-small-state").text("attendance shut down");
    $("#toast-body-state").text("attendance system Stopped !");
    toast.show();
    $('#system-turn-on-button').html(`Turn On the System`);
    $('#turn-system-on-btn').html(`
      Turn System On     
    `);
})


attendanceSystemNotifier.subscribe("systemOnInitRunning", function (data) {
    console.log(data);
    // const {status , message } = data; // not gonna do anything with the data btw !
    //update security dash board
    $('#turn-system-on-btn').html(`
       <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">System Running</span>        
      </div>
    `);
    $("#toast-small-state").text("system Running ! ");
    $("#toast-body-state").text("System state Running !");
    let toast = new bootstrap.Toast($('#liveToast'));
    toast.show();
    $('#system-turn-on-button').html(`Turn off the System`);
    //fix this code later on
    let systemRunning = true;
    window.localStorage.setItem("systemRunning", JSON.stringify({
        systemRunning
    }));

    //closing long pooling --> this line of code is very danger !
    poolingDeadlyService.stopPooling();
    employeeAttendancePooling.startPooling(10000);
    SystemRunningRunning = true;

})
attendanceSystemNotifier.subscribe("systemIsDead", function (data) {
    console.log(data);
    employeeAttendancePooling.stopPooling();
    SystemRunningRunning = false;
})

//Listening on saving report in the data base
//
// attendanceSystemNotifier.subscribe("SavingReportSuccess",function(data){
//     console.log(data);
//     //show a toast to the user and bring back all the ui again
//     //then we can hide the report modal
//     $('#submit-late-report').html(`
//         Submit report
//     `)
//     //confirming user attendance
//     let myModalEl = document.getElementById('attendance-Report');
//     let modal = bootstrap.Modal.getInstance(myModalEl);
//     console.log(modal);
//     modal.hide();
//     if(comparableUser === null){
//         alert("Pleas click on the user from the users table");
//         return;
//     }
//     comparableUser.reportSubmitted = true;
//     $('.active-user-btn').text("confirm attendance");
//     $('.active-user-btn').css("disabled","false");
//     console.log(comparableUser);
//     updateAndPushIntoLocalStorage(comparableUser,function (error){
//         console.log(error);
//     });
//
//     comparableUser = null;
//     debugger;
//     cellData = null;
//
// })
//



//controlling the state of the user when he asks for attendance

attendanceSystemNotifier.subscribe("EmployeeSentAttendanceRequest",function(notifyData){

    // console.log(notifyData);
    const {data} = notifyData;
    console.log(data)
    //if there is a request useres usually comes in package of array
    //so we need to get the state of the employees login and request for attendance
    //then we need to confirm their attendance via searching for each one in the queue and then
    //if found lets check his account state then confirm his attendance and generate a report for
    //admin in case that he is clean sheat
    const attendanceSystemDate =JSON.parse(window.localStorage.getItem("SystemSecurityState"));

    $("#employees-request-table").find("tr:gt(0)").remove();
    data.forEach((user)=>{
        $("#employees-request-table").append(
            $(`
            <tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.uniqueName}</td>
            <td>${user.email}</td>
             <td>${new Date(attendanceSystemDate.startServiceDate).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</td>
            <td>${new Date(user.attendanceTime).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</td>
            <td>
              <select   id="report-type" name="report-type" class="form-control selector">
                <option  value="Attendance Report">Attendance Report</option>
                <option  value="Late Report">Late Report</option>
                <option  value="excuse report">Excuse Report</option>
                <option  value="absence Report">Absence Report</option> // later on it will be brief report 
              </select>
            </td>
          </tr>
           `)
        );
    })

            $('.selector').on("change", function (event) {
                console.log(event.stopPropagation());
                employeeAttendancePooling.stopPooling();
                switch (this.value) {
                    case 'Attendance Report':
                        if(comparableUser === null || comparableUser === undefined){
                            alert("Pleas click on the user from the users table");
                            break;
                        }
                        const attendanceReportModal = new bootstrap.Modal($('#attendance-Report'));
                        attendanceReportModal.show();

                        $("#attendance-report-close-btn").on("click",function(){
                            employeeAttendancePooling.startPooling(10000);
                        })
                        $('#user-unique-attendance-report').val(comparableUser.uniqueName);
                        $('#submit-attendance-report').on('click',async function(){
                            console.log("hello report");
                            //form
                            const reason = $('#attendance-Message').val();
                            const report = {
                                userName:`${comparableUser.firstName} ${comparableUser.lastName}`,
                                userEmail:`${comparableUser.email}`,
                                departureTime:null,
                                attendanceTime:comparableUser.attendanceTime,
                                message:reason,
                                reportIds : ReportsMapper.attendanceReport,
                                userUniqueIdentifier:`${comparableUser.uniqueName}`,
                                reportSubmitTime:Date.now()
                            }
                            attendanceSystemNotifier.publish(reportMapper.attendanceReportPicked,{
                                modal:attendanceReportModal,
                                report:report
                            });

                            $(this).html(`
                          <div id="loading-system-state" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                    `)
                            // await reportService.submitData("Reports");
                        });

                        break;
                    case 'Late Report':
                        debugger;
                        if(comparableUser === null || comparableUser === undefined){
                            alert("Pleas click on the user from the users table");
                            break;
                        }
                        const lateReportSheet = new bootstrap.Modal($('#LateReportmodalSheet'));
                        lateReportSheet.show();
                        // console.log(excuseModal);
                        $("#late-report-close-button").on("click",function(){
                            employeeAttendancePooling.startPooling(10000);
                        })
                        $('#later-report-input').val(comparableUser.uniqueName);
                        console.log("late report before disaster");
                        $('#late-report-submit').on('click',async function(){
                            console.log("clicked");
                            console.log("hello report");
                            //form
                            const reason = $('#late-excuse-message').val();
                            const report = {
                                userName:`${comparableUser.firstName} ${comparableUser.lastName}`,
                                userEmail:`${comparableUser.email}`,
                                departureTime:null,
                                attendanceTime:comparableUser.attendanceTime,
                                message:reason,
                                reportIds : ReportsMapper.attendanceReport,
                                userUniqueIdentifier:`${comparableUser.uniqueName}`,
                                reportSubmitTime:Date.now()
                            }
                            console.log(lateReportSheet,report);
                            attendanceSystemNotifier.publish(reportMapper.lateReportPicked,{
                                modal:lateReportSheet,
                                report:report
                            });

                            $(this).html(`
                          <div id="loading-system-state" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                    `)
                            // await reportService.submitData("Reports");
                        });
                        break;
                    case 'excuse report':
                        if(comparableUser === null || comparableUser === undefined){
                            alert("Pleas click on the user from the users table");
                            break;
                        }
                        const excuseModel = new bootstrap.Modal($('#excuse-modalSheet'));
                        excuseModel.show();
                        // console.log(excuseModal);
                        $("#excuse-report-close-button").on("click",function(){
                            employeeAttendancePooling.startPooling(10000);
                        })
                        $('#excuse-report-input').val(comparableUser.uniqueName);
                        console.log("excuse report before disaster");
                        $('#excuse-report-btn').on('click',async function(){
                            console.log("clicked");
                            console.log("hello report");
                            //form
                            const reason = $('#excuse-report-message').val();
                            const report = {
                                userName:`${comparableUser.firstName} ${comparableUser.lastName}`,
                                userEmail:`${comparableUser.email}`,
                                departureTime:null,
                                attendanceTime:comparableUser.attendanceTime,
                                message:reason,
                                reportIds : ReportsMapper.attendanceReport,
                                userUniqueIdentifier:`${comparableUser.uniqueName}`,
                                reportSubmitTime:Date.now()
                            }
                            console.log(excuseModel,report);
                            attendanceSystemNotifier.publish(reportMapper.excuseReportPicked,{
                                modal:excuseModel,
                                report:report
                            });

                            $(this).html(`
                          <div id="loading-system-state" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                    `)
                            // await reportService.submitData("Reports");
                        });
                        break;
                    case 'absence Report':
                        if(comparableUser === null || comparableUser === undefined){
                            alert("Pleas click on the user from the users table");
                            break;
                        }
                        const absence_modal = new bootstrap.Modal($('#absence-modalSheet'));
                        absence_modal.show();
                        // console.log(full_report);
                        $("#absence-report-close-button").on("click",function(){
                            employeeAttendancePooling.startPooling(10000);
                        })
                        $('#absence-report-input').val(comparableUser.uniqueName);
                        console.log("excuse report before disaster");
                        $('#absence-report-submit-btn').on('click',async function(){
                            console.log("clicked");
                            console.log("hello report");
                            //form
                            const reason = $('#absence-report-message').val();
                            const report = {
                                userName:`${comparableUser.firstName} ${comparableUser.lastName}`,
                                userEmail:`${comparableUser.email}`,
                                departureTime:null,
                                attendanceTime:comparableUser.attendanceTime,
                                message:reason,
                                reportIds : ReportsMapper.attendanceReport,
                                userUniqueIdentifier:`${comparableUser.uniqueName}`,
                                reportSubmitTime:Date.now()
                            }
                            console.log(absence_modal,report);
                            debugger;
                            attendanceSystemNotifier.publish(reportMapper.absenceReportPicked,{
                                modal:absence_modal,
                                report:report
                            });

                            $(this).html(`
                          <div id="loading-system-state" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                    `)
                            // await reportService.submitData("Reports");
                        });
                        break;
                }
            })




})

attendanceSystemNotifier.subscribe("NoRecordForUsersYet",function(data){
    console.log(data);
})



$(document).ready(async function () {




    let currentAttendanceTimeObj = JSON.parse(window.localStorage.getItem("SystemSecurityState"));

    let currentAttendanceTime = currentAttendanceTimeObj.startServiceDate;

    let maxAttendanceTime = JSON.parse(window.localStorage.getItem("SystemSecurityState"));

    let currentSystemTime = new Date(maxAttendanceTime.startServiceDate);

    let maxLimit = currentSystemTime.setHours(currentSystemTime.getHours() + 7);



    poolingDeadlyService.startPooling(500);

    // employeeAttendancePooling.startPooling(10000);

    $('#system-turn-on-button').on("click", async function () {

        //if not valid then log him out
        // else take the date and run the system
        console.log($('#system-attendance-date').val());
        //take user name - take user password // check them using system validator service [✅]
        try {
            $('.invalid-feedback').hide();
            //checking for nulls
            if (!$("#sequiry-name").val()) {
                $('#security-identity').show();
                return;
            } else if (!$("#sequiry-password").val()) {
                $('#security-password').show();
                return;
            } else if (!$('#system-attendance-date').val()) {
                $('#security-dates').show();
                return;
            }
            const checkUser = await localStorageToGateValidator($("#sequiry-name").val(), $("#sequiry-password").val());
            const {message, status, usertype} = checkUser; //ecma6 destructors
            console.log(usertype);
            if (usertype.toString().toLowerCase() === 'admin' ||
                usertype.toString().toLowerCase() === 'security') {
                // console.log(new Date($('#system-attendance-date').val()).getTime());
                SystemRunningRunning = JSON.parse(window.localStorage.getItem("systemRunning"));
                if (SystemRunningRunning) {
                    const {systemRunning} = SystemRunningRunning;
                    if (systemRunning) {
                        //we need to stop the service [x]
                        await securitySystemService.stageService(new Date($('#system-attendance-date').val()).getTime(),
                            $("#sequiry-name").val());
                        await securitySystemService.turnOffAttendanceSystem();

                        return;
                    }
                }
                //before start any service lets watch the date if nan stop
                await securitySystemService.stageService(new Date($('#system-attendance-date').val()).getTime(),
                    $("#sequiry-name").val());
                await securitySystemService.startAttendanceSystem(); // service
            } else {
                //because that's mean he is not the owner of the security account nor the admin
                //service didn't throw error or rejected error so must be an employee

            }
        } catch (error) {
            console.log(error); // remove this and log the user out // throw error that's mean hacker !
            $('#incorrect-identity').show();
            $('#security-password-wrong').show();
            return;
        }

    })

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


    //block and wait until loading up the data from the data base
    let _data, _original;

    try {

        let {data, original} = await localStorageLoadAllUsersTool();
        _data = data;
        _original = original;
        //loop on all the original data then addd some extra info to the user then later on we can
        //fix this bug
        _original.forEach((oldUser)=>{
            oldUser.attendanceConfirmed = oldUser.attendanceConfirmed || false;
            oldUser.departureConfirmed = oldUser.departureConfirmed || false;
        })

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
    $('#data-table').on('click', 'td', async function () {
        try {
            const {data, original} = await localStorageLoadAllUsersTool();
            _data = data;
            _original = original;
            //loop on all the original data then addd some extra info to the user then later on we can
            //fix this bug
            _original.forEach((oldUser)=>{
                oldUser.attendanceConfirmed = oldUser.attendanceConfirmed || false;
                oldUser.departureConfirmed = oldUser.departureConfirmed || false;
            })

        } catch (error) {
            console.log(error);
        }
        cellData = $('#data-table').DataTable().row(this).data();
        console.log(cellData);
        console.log(_original);
        _original.forEach((user) => {
            // if the user email from the data base match with the user email selected from the table
            //then we need to compare some extra data from the data base to confirm the logic of attendance
            //if the user has attendance date then i should compare it with the system date confirmed
            //by the security
            //compare between employee attendance confirmed on if it bigger than my system
            if (user.email.toString().toLowerCase() === cellData[1].toString().toLowerCase()) {
                console.log(cellData);
                comparableUser = user;
                debugger;
                $('#user-name-left').text(cellData[0]); // we are writing on the user info card
                if (cellData[3] === systemLoginStates.notValid) {
                    $('.card-text').text(`${cellData[0]} Pleas contact admin for user Account activation`);
                    $('.active-user-btn').addClass("disabled");
                    return false;
                }else if(Number.parseInt(user.attendanceConfirmedOn) > Number.parseInt(currentAttendanceTime) && Number.parseInt(comparableUser.attendanceConfirmedOn) <= Number.parseInt(maxLimit)){
                    $('.active-user-btn').removeClass("disabled");
                    console.log("true");
                    //show button
                    //listen on the button
                    //on click rise special event show up model to confirm special type of reports
                    //departure report
                    let leavingReason = "";
                    $('.active-user-btn').removeClass("disabled");
                    $('.active-user-btn').html("Confirm departure");
                    $('.active-user-btn').on("click",function(){
                        const departureModel = new bootstrap.Modal($('#departure-modalSheet'));
                        departureModel.show();
                        $('input:radio').on("change",function(){
                            leavingReason = $(this).next('label:eq(0)').html().toString();
                            console.log(leavingReason);
                        })
                        //send model and departure report and we will be ok
                        $("#departure-report-close-button").on("click",function(){
                            employeeAttendancePooling.startPooling(10000);
                        })
                        $('#departure-report-input').val(user.uniqueName);
                        $('#departure-report-btn').on('click',async function(){
                            //form
                            const reason = $('#departure-report-message').val();
                            const report = {
                                userName:`${user.firstName} ${user.lastName}`,
                                userEmail:`${user.email}`,
                                departureTime:null,
                                attendanceTime:user.attendanceTime,
                                message:reason,
                                reportIds : ReportsMapper.attendanceReport,
                                userUniqueIdentifier:`${user.uniqueName}`,
                                reportSubmitTime:Date.now()
                            }
                            debugger;
                            const departureReport = new DepartureReport(report);
                            departureReport.reasonOfLeaving = leavingReason;
                            attendanceSystemNotifier.publish(reportMapper.departurePicked,{
                                modal:departureModel,
                                report:departureReport
                            });
                            $(this).html(`
                          <div id="loading-system-state" class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                             `)
                            // await reportService.submitData("Reports");
                            return false;
                        });
                    });
                }
                else {
                    $('.active-user-btn').addClass("disabled");
                    $('.active-user-btn').html("Pleas check the table only one time then confirm when the button get unlocked");
                    return false;
                }
            }
        })
    });


    // $('.active-user-btn').on("click",async function(){
    //     debugger;
    //     const storageUpdateService = new LocalStorageUpdateService("userData");
    //     if($(this).text().toString().toLowerCase() === 'confirm attendance'){
    //             if(SystemRunningRunning){
    //                 //stop pooling to have chance to confirm a report
    //                 comparableUser.attendanceTime = "";
    //                 comparableUser.attendanceConfirmed = true;
    //                 comparableUser.attendanceConfirmedOn = Date.now();
    //                 comparableUser.departureConfirmedOn = "" || "";
    //                 // await storageUpdateService.updateUserInLocalStorage(comparableUser);
    //                 console.log(comparableUser);
    //                 updateAndPushIntoLocalStorage(comparableUser,function (error){
    //                     console.log(error);
    //                 });
    //                 //update the data base
    //                 location.reload();
    //             }else{
    //                 alert("system should be ON to take attendance");
    //                 return;
    //             }
    //     }else if($(this).text().toString().toLowerCase() === 'confirm departure'){
    //         if(SystemRunningRunning){
    //             //stop pooling to have chance to confirm a report
    //             comparableUser.attendanceTime = "";
    //             comparableUser.attendanceConfirmed = false;
    //             comparableUser.attendanceConfirmedOn = "";
    //             comparableUser.departureConfirmedOn = Date.now();
    //             comparableUser.departureConfirmed = true;
    //             // await storageUpdateService.updateUserInLocalStorage(comparableUser);
    //             console.log(comparableUser);
    //             updateAndPushIntoLocalStorage(comparableUser,function (error){
    //                 console.log(error);
    //             });
    //             //update the data base
    //
    //             location.reload();
    //         }else{
    //
    //             alert("system should be ON to take attendance");
    //             return;
    //         }
    //     }else if($(this).text().toString().toLowerCase() === 'confirm reset'){
    //         if(SystemRunningRunning){
    //             //stop pooling to have chance to confirm a report
    //             comparableUser.attendanceTime = "";
    //             comparableUser.attendanceConfirmed = false;
    //             comparableUser.departureConfirmed = false;
    //             comparableUser.departureConfirmedOn = "" || "";
    //             comparableUser.attendanceConfirmedOn =  "" || "";
    //             comparableUser.reportSubmitted = null;
    //             // await storageUpdateService.updateUserInLocalStorage(comparableUser);
    //             $('.card-text').text(`${cellData[0]} waiting for Employee Report`);
    //             $('.active-user-btn').text("waiting for Employee attendance Report");
    //             $('.active-user-btn').css("disabled","true");
    //             updateAndPushIntoLocalStorage(comparableUser,function (error){
    //                 console.log(error);
    //             });
    //             console.log(comparableUser);
    //             location.reload();
    //         }else{
    //             alert("system should be ON to take attendance");
    //             return;
    //         }
    //     }
    // })




    //handle if the admin clicked to leave
    $('#unique-logout').on("click", function () {
        confirm("you sure u need to logout sir ! ? ");
        if (confirm) {
            setTimeout("location.href = 'system.html';", 1500);
            window.localStorage.setItem('superData', JSON.stringify([]));
        }
    })

    //close messages
    $('.btn-close').on("click", function () {
        setTimeout('location.reload();', 500);
    })

});


//we supposed to be done :
//we coded the whole logic not all of it but only remains the following :
// 1- the security need pooling service to watch the current users who need to confirm attendance
// 2- send the reports to the locale storage

function updateAndPushIntoLocalStorage(obj , error){
    const old = JSON.parse(window.localStorage.getItem("userData"));
    if(old){
        let temp = old.filter((old)=>{
            return old.uniqueName !== obj.uniqueName;
        })
        //filtered
        temp.push(obj);
        window.localStorage.setItem("userData",JSON.stringify(temp));
    }else{
        return error(Error("cannot access local storage or update failed"));
    }
}

//delegate to the table
