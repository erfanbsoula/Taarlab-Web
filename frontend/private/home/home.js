const pie_ctx = document.getElementById('myChart').getContext('2d');
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