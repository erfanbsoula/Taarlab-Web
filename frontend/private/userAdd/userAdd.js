let messageBox = new MessageBox();

const fp = flatpickr("#dateInput", {
    enableTime: false,
    dateFormat: "Y-m-d",
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

// document.getElementById("profilePic").value = "";
if (document.getElementById("profilePic").files[0]) {
    let url = URL.createObjectURL(document.getElementById("profilePic").files[0]);
    document.getElementById("profilePrev").src = url;
}

document.getElementById("uploadBtn").addEventListener('click', (event) => {
    document.getElementById("profilePic").click();
})

document.getElementById("profilePic").addEventListener('change', (event) => {
    const file = document.getElementById("profilePic").files[0];
    if (file) {
        document.getElementById("profilePrev").src = URL.createObjectURL(file);
    }
})

function clearForm() {
    document.getElementById("userForm").reset();
    document.getElementById("profilePrev").src = "/assets/profile/taylor.webp";
}

function error(message) {
    document.getElementById("formError").innerText = message;
}

function hasLengthError(str, name, max=32, min=3) {
    if (str.length < min) {
        error(name + " should have a minimum length of " + min);
        return true;
    }
    else if (max < str.length) {
        error(name + " should have a maximum length of " + max);
        return true;
    }

    return false;
}

function getFormData() {
    let firstname = document.getElementById("firstname").value;
    if (hasLengthError(firstname, "First name")) return false;
    if (!/^[a-zA-Z\s]+$/g.test(firstname)) {
        error("First name can only contain letters and spaces!");
        return false;
    }

    let lastname = document.getElementById("lastname").value;
    if (hasLengthError(lastname, "Last name")) return false;
    if (!/^[a-zA-Z\s]+$/g.test(lastname)) {
        error("Last name can only contain letters and spaces!");
        return false;
    }

    let nationalID = document.getElementById("nationalID").value;
    if (hasLengthError(nationalID, "National ID", 16)) return false;
    if (!/^[0-9]+$/g.test(nationalID)) {
        error("National ID can only contain numbers!");
        return false;
    }

    let birthDate = document.getElementById("dateInput").value;
    if (!birthDate.length) {
        error("Please select the date of birth");
        return false;
    }

    if (document.getElementById("profilePic").value == "") {
        error("Please select a profile picture!");
        return false;
    }
    let file = document.getElementById("profilePic").files[0];

    let username = document.getElementById("username").value;
    if (hasLengthError(username, "Username")) return false;
    if (/^[0-9]/g.test(username)) {
        error("Username can't start with a number!");
        return false;
    }
    else if (!/^[a-zA-Z0-9_]+$/g.test(username)) {
        error("Username can only contain letters, numbers and underlines!");
        return false;
    }

    let password = document.getElementById("password").value;
    if (hasLengthError(password, "Password")) return false;
    if (/[\0\n]/g.test(password)) {
        error("using '\\0' and '\\n' is not allowed in the password!");
        return false;
    }
    else if (/[\s]/g.test(password)) {
        error("Password can not contain spaces!");
        return false;
    }

    const formData = new FormData();
    formData.append("firstname",  firstname);
    formData.append("lastname",  lastname);
    formData.append("nationalID",  nationalID);
    formData.append("birthDate",  birthDate);
    formData.append("profilePic", file);
    formData.append("username", username);
    formData.append("password",  password);
    error("");
    return formData;
}

document.getElementById("userForm").addEventListener('submit', (event) => {
    event.preventDefault();
    getFormData();
    let formData = getFormData();
    if (!formData) {
        return;
    }

    fetch("/api/signup", {
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
            messageBox.showFailure("Server didn't accept the request!");
        }
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("Something went wrong");
    });
})
