



let reports = JSON.parse(window.localStorage.getItem("Report"));

reports = reports.filter((report)=>{
    return report.excuseReport === true;
})

let dataSource = [];


if(reports){

    reports.forEach((report)=>{
        let temp = [];
        for(let key in report){
            temp.push(report[key]);
        }
        dataSource.push(temp);
    })


}

dataSource.forEach((arr)=>{
    let tr = document.createElement("tr");
    for(let i = 0 ; i < 5 ; i++){
        let td = document.createElement("td");
        if(i === 2 || i === 3){
            arr[i] = new Date(Number.parseInt(arr[i])).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})==='Invalid Date' ? '❎'  : new Date(Number.parseInt(arr[i])).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        }
        $(td).html(`${arr[i]}`);
        tr.appendChild(td);
    }
    $('#full-table').append($(tr));
})
