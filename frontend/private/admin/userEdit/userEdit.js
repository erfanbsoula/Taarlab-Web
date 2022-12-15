let messageBox = new MessageBox();

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
document.getElementById("profilePrev").src = "/api/profilePic?username=" + params.username;
document.querySelector(".fields .username").href = "/userView/userView.html?username=" + params.username;

let fp = null;

if (params.username) {
    fetch("/api/user?username=" + params.username, { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
        document.getElementById("firstname").value = json.firstname;
        document.getElementById("lastname").value = json.lastname;

        fp = flatpickr("#dateInput", {
            enableTime: false,
            dateFormat: "Y-m-d",
            position: 'below left',
            minDate: "1960/01/01",
            maxDate: "2020/12/30",
            defaultDate: json.birthDate,
        });

        document.getElementById("nationalID").value = json.nationalID;
        document.querySelector(".username").innerText += params.username;
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user data!");
    });
}

document.getElementById("hoverImg").addEventListener('click', (event) => {
    document.getElementById("profilePic").click();
})

document.getElementById("profilePic").addEventListener('change', (event) => {
    const file = document.getElementById("profilePic").files[0];
    if (file) {
        document.getElementById("profilePrev").src = URL.createObjectURL(file);
    }
})

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
    if (hasLengthError(nationalID, "National ID", 10)) return false;
    if (!/^[0-9]+$/g.test(nationalID)) {
        error("National ID can only contain numbers!");
        return false;
    }

    let birthDate = document.getElementById("dateInput").value;
    if (!birthDate.length) {
        error("Please select the date of birth");
        return false;
    }

    const formData = new FormData();
    formData.append("username",  params.username);
    formData.append("firstname",  firstname);
    formData.append("lastname",  lastname);
    formData.append("nationalID",  nationalID);
    formData.append("birthDate",  birthDate);

    if (document.getElementById("profilePic").value != "") {
        let file = document.getElementById("profilePic").files[0];
        formData.append("profilePic", file);
    }

    error("");
    return formData;
}

document.getElementById("userForm").addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = getFormData();
    if (!formData) {
        return;
    }

    fetch("/api/edit-user", {
        method: 'POST',
        body: formData,
    })
    .then((res) => res.json())
    .then((json) => {
        if (json.status == "ok") {
            messageBox.showSuccess("Updated user info successfuly!");
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
