# TARGETS
- ADMIN
- USER 
- SERVICES 

## SYSTEM
- no repeated users email [service] [✅]
- no repeated users names  [service] [✅]
- system need emailing api to send emails to user [service] [✅] 
  * emailing system should send the following data : 
    - ( username + generated code ) [service] []
    - user password [service] [] 
    * emailing service : (https://www.emailjs.com/docs/tutorial/creating-contact-form/) [✅]
- The system should watch user departure time .. at any time (formal or none-formal departure ... send the (request + departure time) && SYSTEM submit automatic departure after 7 hours from formal working hours 7 hrs 7:30 - 3:30)

### USER [PARENTS OBJECTS][✅] 
- First name 
- last name
- address 
- unique id
- email
- age
- tojson()()()

### Report [PARENTS OBJECTS][✅] 
- departureTime
- attendance time
- excuse message
 ### full report : Report [CHILD OBJECT] [✅] 
 ### late report : Report [CHILD OBJECT] [✅]
 ### excuse report : Report [CHILD OBJECT] [✅]


# SERVICES [] 
### USER [PARENT OBJECT]
- register service [✅] 
- login service  []
- login using two field only :
- user name (user name + generated random unique key `Marwan` )
- password (already user will find it in his email generated by  emailing service)

### ADMIN : USR [CHILD OBJECT][] 
- need service -> attendance [service] [] 
- need a control / dash board control contains the following : 
  - all employees [list of employees] all who are working   
  - full report  [list of reports] all reports registered by the system
  - late report [list of report] 
  - excuse reports 
  - employee brief report  

- need service -> user confirmation  [service] []

### EMPLOYEE : USER [CHILD OBJECT] [] 
- Employee after successful login he should see a page : 
  - his name - month report - Daily report 



### security : USER [CHILD OBJECT] []
 - he is the attendance man [service] []
   - page to search for specific user and submit his attendance
     * security will search for the employee name to submit his attendance 
     * if he searched again for the same user (change the state of the button to submit departure)
     * if Employee asked for departure we can submit his request any time .. else .. (did't ask ? ) => automatic generated departure for the Employee after 7 hours from the formal time 8:30 am to 3:30


 


