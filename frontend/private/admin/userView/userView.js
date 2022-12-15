let messageBox = new MessageBox();

let data = null;
let sortOrder = true;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
document.querySelector(".profile-img").src = "/api/profilePic?username=" + params.username;
document.querySelector(".user-data .edit-btn").addEventListener("click", (event) => {
    window.location.href = "/userEdit/userEdit.html?username=" + params.username;
});

if (params.username) {
    fetch("/api/user?username=" + params.username, { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
        document.querySelector(".user-data .username").innerText += params.username;
        let tbody = document.querySelector(".user-data tbody");
        let content = "<tr><td>First Name:</td>";
        content +=  "<td>" + json.firstname.charAt(0).toUpperCase() + json.firstname.slice(1) + "</td></tr>";
        content += "<tr><td>Last Name:</td>";
        content += "<td>" + json.lastname.charAt(0).toUpperCase() + json.lastname.slice(1) + "</td></tr>";
        content += "<tr><td>National ID:</td>";
        content += "<td>" + json.nationalID + "</td></tr>";
        content += "<tr><td>Date of Birth:</td>";
        content += "<td>" + json.birthDate + "</td></tr>";
        content += "<tr><td>Signup Date:</td>";
        content += "<td>" + json.signupDate + "</td></tr>";
        tbody.innerHTML = content;
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user data!");
    });

    fetch("/api/report?username=" + params.username, { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
        json.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        });
       
        data = json;
        renderTable(json, sortOrder);
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user logs!");
    });
}

document.querySelector(".styled-table #dateSort").addEventListener("click", (event) => {
    sortOrder = !sortOrder;
    renderTable(data, sortOrder);
})

function renderTable(data, inverse=false) {
    let tbody = document.querySelector(".styled-table tbody");
    tbody.innerHTML = "";

    if (inverse) {
        for (let i = data.length-1; 0 <= i; i--) {
            appendRow(tbody, data[i]);
        }
    }
    else {
        for (let i = 0; i < data.length; i++) {
            appendRow(tbody, data[i]);
        }
    }
}

let redx = "<td><img src='/assets/icons/red-x.png' alt='0'></td>";
let tick = "<td><img src='/assets/icons/check-mark.png' alt='1'></td>";

function appendRow(tbody, item) {
    let row = document.createElement('tr');
    let content = "<td>" + item.date;
    content += "</td><td>" + item.time;
    content += "</td><td>" + item.progress + "%</td>";
    for (let j = 0; j < 9; j++) {
        if (item.steps[j] == true)
            content += tick;
        else
            content += redx;
    }
    content += "<td>not logged</td>";
    row.innerHTML = content;
    tbody.appendChild(row);
}
