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

document.getElementById("profilePic").addEventListener('change', (event) => {
    const file = document.getElementById("profilePic").files[0]
    if (file) {
        document.getElementById("profilePrev").src = URL.createObjectURL(file)
    }
})

document.getElementById("userForm").addEventListener('submit', (event) => {
    event.preventDefault();

    const files = document.getElementById("profilePic");
    const formData = new FormData();
    for(let i =0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
    }
    fetch("http://localhost:3000/add-user", {
        method: 'POST',
        body: formData,
    })
    .then((res) => console.log(res))
    .catch((err) => ("Error occured", err));
})

document.getElementById("uploadBtn").addEventListener('click', (event) => {
    document.getElementById("profilePic").click();
})