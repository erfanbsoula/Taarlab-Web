let messageBox = new MessageBox();

fetch("/api/report", { method: 'GET' })
.then((res) => res.json())
.then((json) => {
    let tbody = document.querySelector(".styled-table tbody");
    for (let i = json.length-1; 0 <= i; i--) {
        let row = document.createElement('tr');
        let content = "<td><img src='/api/profilePic?username=" + json[i].username+ "' alt='pic'></td>";
        content += "<td><a href='/userView/userView.html?username=" + json[i].username + "'>@" + json[i].username + "</a></td>";
        content += "<td>" + json[i].date + "</td>";
        content += "<td>" + json[i].time + "</td>";
        content += "<td>" + json[i].progress + "%</td>";
        content += "<td>not logged</td>";
        row.innerHTML = content;
        tbody.appendChild(row);
    }
    drawGraph(json);
    writeSummary(json);
})
.catch((err) => {
    console.log(err);
    messageBox.showFailure("unable to load the data!");
});

function drawGraph(jsonArray) {
    let complete = 0;
    for (let i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].progress == 100) {
            complete += 1;
        }
    }
    let notComplete = jsonArray.length - complete;

    const pie_ctx = document.getElementById('myChart').getContext('2d');
    const pie_chart = new Chart(pie_ctx, {
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

function writeSummary(jsonArray) {
    let totalCount = jsonArray.length;
    let thisMonthCount = 0;
    let todayCount = 0;

    let date = new Date();
    let thisMonth = date.toISOString().slice(0, 7);
    let today = date.toISOString().slice(7, 10);

    for (let i = 0; i < totalCount; i++) {
        if (jsonArray[i].date.slice(0, 7) == thisMonth) {
            thisMonthCount += 1;
            if (jsonArray[i].date.slice(7, 10) == today)
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