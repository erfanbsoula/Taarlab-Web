let messageBox = new MessageBox();

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
    const file = document.getElementById("profilePic").files[0];
    if (file) {
        document.getElementById("profilePrev").src = URL.createObjectURL(file);
    }
})

function clearForm() {
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("nationalID").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("profilePrev").src = "/assets/profile/taylor.webp";
    document.getElementById("profilePic").files.clear();
}

document.getElementById("userForm").addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("profilePic", document.getElementById("profilePic").files[0]);
    formData.append("firstname",  document.getElementById("firstname").value);
    formData.append("lastname",  document.getElementById("lastname").value);
    formData.append("nationalID",  document.getElementById("nationalID").value);
    formData.append("birthDate",  document.getElementById("dateInput").value);
    formData.append("username",  document.getElementById("username").value);
    formData.append("password",  document.getElementById("password").value);
    
    fetch("http://localhost:3000/add-user", {
        method: 'POST',
        body: formData,
    })
    .then((res) => res.json())
    .then((json) => {
        if (json.status == "ok") {
            messageBox.showSuccess("Signed up user successfuly!");
            clearForm();
        }
        else {
            messageBox.showFailure("Server didn't accept the request !");
        }
    })
    .catch((err) => ("Error occured", err));
})

document.getElementById("uploadBtn").addEventListener('click', (event) => {
    document.getElementById("profilePic").click();
})