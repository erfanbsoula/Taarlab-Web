let messageBox = new MessageBox();

let data = null;
let sortOrder = true;

fetch("/api/users", { method: 'GET' })
.then((res) => res.json())
.then((json) => {
    json.sort((a, b) => {
        if (a.signupDate < b.signupDate) return -1;
        if (a.signupDate > b.signupDate) return 1;
        return 0;
    });

    data = json;
    renderTable(json, sortOrder);
})
.catch((err) => {
    console.log(err);
    messageBox.showFailure("unable to load the table!");
});

document.querySelector(".styled-table #dateSort").addEventListener("click", (event) => {
    sortOrder = !sortOrder;
    renderTable(data, sortOrder);
})

function renderTable(data, inverse=false) {
    let tbody = document.querySelector("tbody");
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

function appendRow(tbody, item) {
    let row = document.createElement('tr');
    let content = "<td><img src='/api/profilePic?username=" + item.username + "' alt='pic'></td>";
    content += "<td><a href='/userView/userView.html?username=" + item.username + "'>@" + item.username + "</a></td>";
    content += "<td>" + item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1) + "</td>";
    content += "<td>" + item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1) + "</td>";
    content += "<td>" + item.birthDate + "</td>";
    content += "<td>" + item.nationalID + "</td>";
    content += "<td>" + item.signupDate + "</td>";
    row.innerHTML = content;
    tbody.appendChild(row);
}
