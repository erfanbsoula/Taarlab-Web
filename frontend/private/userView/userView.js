let messageBox = new MessageBox();

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})

if (params.username) {
    fetch("/api/user?username=" + params.username, { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
        document.querySelector(".user-data .username").innerText += params.username;
        let tbody = document.querySelector(".user-data tbody");
        content = "<tr><td>First Name:</td>";
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
        document.querySelector(".profile-img").src = "/api/profilePic?username=" + params.username;
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user data!");
    });

    fetch("/api/report?username=" + params.username, { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
        let tbody = document.querySelector(".styled-table tbody");
        let redx = "<td><img src='/assets/icons/red-x.png' alt='0'></td>";
        let tick = "<td><img src='/assets/icons/check-mark.png' alt='1'></td>";
        for (let i = 0; i < json.length; i++) {
            content = "<tr><td>" + json[i].date;
            content += "</td><td>" + json[i].time;
            content += "</td><td>" + json[i].progress + "%</td>";
            for (let j = 0; j < 9; j++) {
                if (json[i].steps[j] == true)
                    content += tick;
                else
                    content += redx;
            }
            content += "<td>not logged</td></tr>";
            tbody.innerHTML += content;
        }
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user logs!");
    });
}
