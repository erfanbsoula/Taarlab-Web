let messageBox = new MessageBox();
let DateTime = luxon.DateTime;

let data = null;
let sortOrder = true;
let pie_chart = null;

fetch("/api/report", { method: 'GET' })
.then((res) => res.json())
.then((json) => {
    json.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });

    data = json;
    renderTable(json, sortOrder);
    drawGraph(json);
    writeSummary(json);
})
.catch((err) => {
    console.log(err);
    messageBox.showFailure("unable to load the data!");
});

setInterval(() => {
    fetch("/api/report", { method: 'GET', redirect: 'follow' })
    .then((res) => res.json())
    .then((json) => {
        json.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });

        data = json;
        renderTable(json, sortOrder);
        writeSummary(json);
        updateGraph(json);
    })
    .catch((err) => {
        console.log(err);
        messageBox.showFailure("unable to load the data!");
    });
}, 3000);

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

function appendRow(tbody, item) {
    let row = document.createElement('tr');
    let content = "";
    if (item.username == "Unknown") {
        content = "<td></td>";
        content += "<td>Unknown</td>";
    }
    else {
        content = "<td><img src='/api/profilePic?username=" + item.username + "' alt='pic'></td>";
        content += "<td><a href='/userView/userView.html?username=" + item.username + "'>@" + item.username + "</a></td>";
    }
    content += "<td>" + item.date + "</td>";
    content += "<td>" + item.time + "</td>";
    content += "<td>" + item.progress + "%</td>";
    content += "<td>not logged</td>";
    row.innerHTML = content;
    tbody.appendChild(row);
}

function drawGraph(jsonArray) {
    let complete = 0;
    for (let i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].progress == 100) {
            complete += 1;
        }
    }
    let notComplete = jsonArray.length - complete;

    const pie_ctx = document.getElementById('myChart').getContext('2d');
    pie_chart = new Chart(pie_ctx, {
        type: 'pie',
        data: {
        labels: ["Complete", "Not Complete"],
        datasets: [{
            label: "count",
            backgroundColor: ["#3cba9f", "#c45850"],
            data: [complete, notComplete]
        }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Statistics',
                    font: {
                        family: "'Arial', 'Verdana', sans-serif",
                        weight: 'normal',
                        size: '15px'
                    }
                },
            }
        }
    });
}

function updateGraph(jsonArray) {
    let complete = 0;
    for (let i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].progress == 100) {
            complete += 1;
        }
    }
    let notComplete = jsonArray.length - complete;
    pie_chart.data.datasets[0].data[0] = complete;
    pie_chart.data.datasets[0].data[1] = notComplete;
    pie_chart.update();
}

function writeSummary(jsonArray) {
    let totalCount = jsonArray.length;
    let thisMonthCount = 0;
    let todayCount = 0;

    let date = DateTime.now().setZone('Asia/Tehran');
    let thisMonth = date.toFormat('yyyy-MM');
    let today = date.toFormat('dd');

    for (let i = 0; i < totalCount; i++) {
        if (jsonArray[i].date.slice(0, 7) == thisMonth) {
            thisMonthCount += 1;
            if (jsonArray[i].date.slice(8, 10) == today)
                todayCount += 1;
        }
    }

    let tbody = document.querySelector(".summary tbody");
    let content = "<tr><td>Total Logs</td><td>";
    content += totalCount + "</td></tr>";
    content += "<tr><td>This Month</td><td>";
    content += thisMonthCount + "</td></tr>";
    content += "<tr><td>Today</td><td>";
    content += todayCount + "</td></tr>";
    tbody.innerHTML = content;
}