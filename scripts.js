let menuBtn = false;
document.getElementById("menu-btn").addEventListener("click", (ev) => {
    if (menuBtn) {
        document.getElementById("sidebar-content-container").style.transitionDelay = "0ms";
        document.getElementById("sidebar-content-container").style.visibility = "hidden";
        document.getElementById("content-container").style.marginLeft = "0";
        document.getElementById("mySidebar").style.width = "0";
        menuBtn = false;
    } else {
        document.getElementById("sidebar-content-container").style.transitionDelay = "500ms";
        document.getElementById("sidebar-content-container").style.visibility = "visible";
        document.getElementById("content-container").style.marginLeft = "200px";
        document.getElementById("mySidebar").style.width = "200px";
        menuBtn = true;
    }
})

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
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
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});