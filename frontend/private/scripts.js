let menuBtn = false;
document.getElementById("menu-btn").addEventListener("click", (ev) => {
    document.getElementById("content-container").style.transition = "margin 500ms";
    document.getElementById("menu-btn").classList.toggle("open");
    if (menuBtn) {
        document.getElementById("sidebar-content-container").style.transitionDelay = "0ms";
        document.getElementById("sidebar-content-container").style.visibility = "hidden";
        document.getElementById("content-container").style.marginLeft = "0";
        document.getElementById("sidebar").style.width = "0";
        menuBtn = false;
    } else {
        document.getElementById("sidebar-content-container").style.transitionDelay = "500ms";
        document.getElementById("sidebar-content-container").style.visibility = "visible";
        document.getElementById("content-container").style.marginLeft = "200px";
        document.getElementById("sidebar").style.width = "200px";
        menuBtn = true;
    }
})

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: "random #",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Test Chart',
                font: {
                    family: "'Arial', 'Verdana', sans-serif",
                    weight: 'normal',
                    size: '15px'
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const pie_ctx = document.getElementById('pie-chart').getContext('2d');
const pie_chart = new Chart(pie_ctx, {
    type: 'pie',
    data: {
      labels: ["Completed", "Not Completed"],
      datasets: [{
        label: "count",
        backgroundColor: ["#3cba9f", "#c45850"],
        data: [3, 4]
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

const pie_ctx2 = document.getElementById('pie-chart2').getContext('2d');
const pie_chart2 = new Chart(pie_ctx2, {
    type: 'pie',
    data: {
        labels: ["Present", "Not Present"],
      datasets: [{
        label: "count",
        backgroundColor: ["#3cba9f", "#c45850"],
        data: [5, 1]
      }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Employee Presence',
                font: {
                    family: "'Arial', 'Verdana', sans-serif",
                    weight: 'normal',
                    size: '15px'
                }
            },
        }
    }
});

const pie_ctx3 = document.getElementById('pie-chart3').getContext('2d');
const pie_chart3 = new Chart(pie_ctx3, {
    type: 'pie',
    data: {
        labels: [">= 8", "< 8"],
      datasets: [{
        label: "count",
        backgroundColor: ["#3cba9f", "#c45850"],
        data: [4, 2]
      }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Employee's Working Hours",
                font: {
                    family: "'Arial', 'Verdana', sans-serif",
                    weight: 'normal',
                    size: '15px'
                }
            },
        }
    }
});
