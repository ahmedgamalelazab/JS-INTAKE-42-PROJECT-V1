export let systemLoginStates = {
    valid:"valid", // super user will use this to give access to employees
    notValid:"notValid", //when admin revoke user validation
    gainedSystemAccess:true, //super user will use this to give access to employees 
    provokedSystemAccess:false //when admin revoke user validation
}