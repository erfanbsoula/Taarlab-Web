let messageBox = new MessageBox();

fetch("/api/users", { method: 'GET' })
.then((res) => res.json())
.then((json) => {
    let tbody = document.querySelector("tbody");
    for (let i = 0; i < json.length; i++) {
        let row = document.createElement('tr');
        let content = "<td><div class='profile'>";
        content += "<img src='/api/profilePic?username=" + json[i].username + "' alt='pic'>";
        content += "<a href=''>@" + json[i].username + "</a>";
        content += "</div></td>";
        content += "<td>" + json[i].firstname.charAt(0).toUpperCase() + json[i].firstname.slice(1) + "</td>";
        content += "<td>" + json[i].lastname.charAt(0).toUpperCase() + json[i].lastname.slice(1) + "</td>";
        content += "<td>" + json[i].birthDate + "</td>";
        content += "<td>" + json[i].nationalID + "</td>";
        row.innerHTML = content;
        tbody.appendChild(row);
    }
})
.catch((err) => {
    console.log(err);
    messageBox.showFailure("unable to load the table!");
});
