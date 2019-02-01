// Code responsible for creating start date, start time, and end time options
let appriopriateDateTimeDropdowns = () => {
    let start = moment().startOf("Week");
    let end = moment().endOf("Week");
    let diff = end.diff(start, "days");
    for (let index = 0; index < diff + 1; index++) {
        let option = $("<option>");
        option.addClass("startDate");
        let formattedDate = moment().weekday(index).format("MM/DD/YYYY");
        option.text(formattedDate);
        $("#eventStartDate").append(option);
    }
    // Create start time dropdown
    start = moment().startOf("day");
    end = moment().endOf("day");
    diff = end.diff(start, "hour")
    for (let index = 0; index < diff + 1; index++) {
        // Top of the hour
        let option = $("<option>");
        option.addClass("startTime");
        let time = moment().hour(index).minute(0).format("LT");
        option.text(time);
        $("#eventStartTime").append(option);
        // 15 mins into the hour
        option = $("<option>");
        option.addClass("startTime");
        time = moment().hour(index).minute(15).format("LT");
        option.text(time);
        $("#eventStartTime").append(option);
        // 30 mins into the hour
        option = $("<option>");
        option.addClass("startTime");
        time = moment().hour(index).minute(30).format("LT");
        option.text(time);
        $("#eventStartTime").append(option);
        // 45 mins into the hour
        option = $("<option>");
        option.addClass("startTime");
        time = moment().hour(index).minute(45).format("LT");
        option.text(time);
        $("#eventStartTime").append(option);
    }
    // Create end time dropdown
    for (let index = 0; index < diff + 1; index++) {
        // Top of the hour
        let option = $("<option>");
        option.addClass("endTime");
        let time = moment().hour(index).minute(0).format("LT");
        option.text(time);
        $("#eventEndTime").append(option);
        // 15 mins into the hour
        option = $("<option>");
        option.addClass("endTime");
        time = moment().hour(index).minute(15).format("LT");
        option.text(time);
        $("#eventEndTime").append(option);
        // 30 mins into the hour
        option = $("<option>");
        option.addClass("endTime");
        time = moment().hour(index).minute(30).format("LT");
        option.text(time);
        $("#eventEndTime").append(option);
        // 45 mins into the hour
        option = $("<option>");
        option.addClass("endTime");
        time = moment().hour(index).minute(45).format("LT");
        option.text(time);
        $("#eventEndTime").append(option);
    }
}

// Empty each input box
let clearForm = () => {
    $("#eventTitle")
        .val("");
    $("#eventDescription")
        .val("");
}

// Validate inputs and prepare data to be sent to database
let makePUTCall = () => {
    let editEvent = {};
    let passDataReq = [];
    if ($("#eventTitle").val().trim() == "") {
        alert("Please give the event a title.")
    } else {
        passDataReq.push(true);

        editEvent.eventTitle = $("#eventTitle").val().trim();
    };
    if (moment().format("MM/DD/YYYY") > moment($("#eventStartDate").val().trim()).format("MM/DD/YYYY")) {
        alert("Select a new start date. Can't schedule something in the past!")
    } else {
        passDataReq.push(true)
        editEvent.eventStartDate = $("#eventStartDate").val().trim();
    };

    if ($("#eventStartDate").val().trim() == moment().format("MM/DD/YYYY") && moment().format("LT") > $("#eventStartTime").val().trim()) {
        alert("Select a new start time. Can't schedule something in the past!")
    } else {

        if (moment($("#eventStartTime").val().trim(), "LT") >= moment($("#eventEndTime").val().trim(), "LT")) {
            alert("Please make sure the end time is later than the start time.");
        } else {
            passDataReq.push(true)
            editEvent.eventStartTime = $("#eventStartTime").val().trim();
        };
    };
    if ($("#eventEndTime").val().trim() == "") {
        alert("Please give the event an end time.")
    } else {
        passDataReq.push(true)
        editEvent.eventEndTime = $("#eventEndTime").val().trim();
    };
    if ($("#eventDescription").val().trim() == "") {
        alert("Please give the event a description.")
    } else {
        passDataReq.push(true)
        editEvent.eventDescription = $("#eventDescription").val().trim();
    };
    // Determines whether or not to make a call to the server
    let promise = new Promise((resolve, reject) => {
        // console.log(passDataReq);
        if (passDataReq.length == 5) {
            resolve(editEvent);
        } else {
            reject("Data didn't meet all requirements. Can't create event");
        }
    });

    promise.then((dataToServer) => {
        //  Create unique url to create user specific events
        let url = "/api/modifyEvent/" + localStorage.getItem("EventID");
        // Send an AJAX PUT-request with jQuery
        $.ajax({
            method: "PUT",
            url: url,
            data: dataToServer
    }).then((serverRes) =>{
        console.log(serverRes);
        });
    })
}

appriopriateDateTimeDropdowns();
clearForm();

// Button to edit event in database
$("#edit-btn").on("click", function(event) {
    event.preventDefault();
    makePUTCall();

});

// Button to delete event in database
$("#delete-btn").on("click", function(event) {
    event.preventDefault();
    var eventId = localStorage.getItem("EventID");
    $.ajax({
      method: "DELETE",
      url: "/api/deleteEvent/" + eventId
    }).then(() => {
        window.location.assign("/calendar");
    });
});