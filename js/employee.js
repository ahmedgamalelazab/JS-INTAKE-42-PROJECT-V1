
// user now will have to confirm attendance to go and code the pool
//the security pool will have to watch the user interactivity
//if the user confirmed attendance we should send flag to the data base
//then the pool will ask the local storage for retrieving this data later on

$(function(){
    let employee_unique_key= "";

    $('#employee-attendance-seek').on("click",function(e){
        e.preventDefault();
        employee_unique_key = $('#employee-unique-key').val();
        //get the user current date
        const timeOfAttendance =  Date.now();
        //user will enter the key to search if he was the guy who attended or not
        console.log(timeOfAttendance);
        console.log(employee_unique_key);
        const employee = JSON.parse(window.localStorage.getItem(employee_unique_key));
        console.log(employee);
        const users = JSON.parse(window.localStorage.getItem("userData")); // that what the long pool service with the security will listen too
        //update the users
        users.forEach((user)=>{
            if(user.uniqueName === employee[0].uniqueName){
                user.attendanceTime = timeOfAttendance;
            }
        })
        window.localStorage.setItem("userData",JSON.stringify(users));

    })


    $("#unique-logout").on("click",function(){
        employee_unique_key = $('#employee-unique-key').val();
        if(employee_unique_key === null || employee_unique_key === ""){
            alert("Pleas put ur key in the box to log out !");
            return;
        }
        const employee = JSON.parse(window.localStorage.getItem(employee_unique_key));
        console.log(employee);
        const users = JSON.parse(window.localStorage.getItem("userData")); // that what the long pool service with the security will listen too
        //update the users
        users.forEach((user)=>{
            if(user.uniqueName === employee[0].uniqueName){
                user.attendanceTime = "";
            }
        })
        window.localStorage.removeItem(employee_unique_key);
        window.localStorage.setItem("userData",JSON.stringify(users));
        setTimeout("location.href = './system.html'",1500);
    })
})