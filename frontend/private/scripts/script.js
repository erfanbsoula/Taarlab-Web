const fp = flatpickr("#dateInput", {
    enableTime: false,
    position: 'below left',
    minDate: "1960/01/01",
    maxDate: "2020/12/30",
    onOpen: function(selectedDates, dateStr, instance) {
        document.querySelector("#date-canvas label").style.display = "none";
        document.getElementById("date-canvas").style.alignSelf = "flex-start";
    },
    onClose: function(selectedDates, dateStr, instance) {
        document.querySelector("#date-canvas label").style.display = "inline";
        document.getElementById("date-canvas").style.alignSelf = "flex-end";
    }
});

document.getElementById("uploadBtn").addEventListener('click', (event) => {
    document.getElementById("profilePic").click();
})