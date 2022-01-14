
import {validateDataTemplateService} from "../utils/services/validationService.js";

import {localStorageToGateValidator} from "../utils/tools/localStorageSearcher.js";

import {SuperAccountsFactory} from "../utils/services/SuperAccountsFactory.js";

import {ValidateSuperData} from "../utils/services/ValidateSuperData.js";

const adminAccountGenerator = new SuperAccountsFactory("admin");

const securityAccountGenerator = new SuperAccountsFactory("security");

import {delay} from "../libs/delay.js";


//generating admin account
(async function(){
    const adminAccount = await adminAccountGenerator.generateAccount();
    const validAdminAccount = new ValidateSuperData(adminAccount);
    await validAdminAccount.validateSuper("superData");
})();

//generating security account
(async function(){
    const securityAccount = await securityAccountGenerator.generateAccount();
    const validSecurityAccount = new ValidateSuperData(securityAccount);
    await validSecurityAccount.validateSuper("superData");
})();

// the security need to gain account and that's it



$(function(){

    $('.btn').on("click",async function(){

        $(this).html(`
         <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Logging you in ...
        `)
        //get the user data stored in a variable

        const username = $('#input-user-user-name').val();
        const password = $('#input-user-password').val();

        console.log(username,password);

        try{

            await validateDataTemplateService(username,password);


            localStorageToGateValidator(username,password).then((data)=>{
                const {status , message,usertype} = data;
                if(status === true){
                    switch (usertype.toLowerCase()){
                        case 'admin':
                            //direct me there
                            setTimeout("window.location.replace('admin.html');",3000);
                            break;
                        case 'security':
                            //direct me somewhere else
                            setTimeout("window.location.replace('security.html');",3000);
                            break;
                        case 'employee':
                            //direct me somewhere
                            setTimeout("window.location.replace('employee.html');",3000);
                            window.localStorage.setItem('superData',JSON.stringify([]));
                            //logged user ?!
                            const temp  = JSON.parse(window.localStorage.getItem("userData"));
                            if(temp){
                                //only if temp found
                                let tempContainer =  temp.filter((employee)=>{
                                    return username === employee.uniqueName;
                                })
                                window.localStorage.setItem(username,JSON.stringify(tempContainer));
                                //push user to system users current logged
                                const currentLoggedUsers = JSON.parse(window.localStorage.getItem("usersOnSystem"));
                                if(currentLoggedUsers && currentLoggedUsers.length !== 0){
                                    //add user more to the system
                                    currentLoggedUsers.push(tempContainer[0]);
                                    window.localStorage.setItem("usersOnSystem",JSON.stringify(currentLoggedUsers));
                                }else{
                                    //push the first user use the system
                                    window.localStorage.setItem("usersOnSystem",JSON.stringify(tempContainer));
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
                .catch((error) => {
                    localStorageToGateValidator(username, password)
                        .catch(async(error) => {
                            const {detailedMessage} = error;
                            await delay(3000);
                            alert(detailedMessage);
                            $(this).html(`
                                        Login
                            `)
                            setTimeout('location.reload()',500);

                        })
                })


        }catch(error){
            alert("user Name or password incorrect");
            $(this).html(`
            Login
        `)

        }
    });


})