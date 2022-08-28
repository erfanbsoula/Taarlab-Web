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
        content +=  "<td>" + json.firstname.charAt(0).toUpperCase() + json.firstname.slice(1) + "</td>";
        content += "</tr><tr><td>Last Name:</td>";
        content += "<td>" + json.lastname.charAt(0).toUpperCase() + json.lastname.slice(1) + "</td>";
        content += "</tr><tr><td>Date of Birth:</td>";
        content += "<td>" + json.birthDate + "</td>";
        content += "</tr><tr><td>National ID:</td>";
        content += "<td>" + json.nationalID + "</td></tr>";
        tbody.innerHTML = content;
        document.querySelector(".profile-img").src = "/api/profilePic?username=" + params.username;
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load user data!");
    });
}
