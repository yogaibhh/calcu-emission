const toggleMode = document.getElementById("toggle-mode");
const body = document.body;

document.getElementById("calculate-emission").addEventListener("click", function () {
  let volumeKendaraan = document.getElementById("volume-kendaraan").value;
  let vkt = document.getElementById("vkt").value;
  let fe = document.getElementById("fe").value;
  let emission = (volumeKendaraan * vkt * fe) / 1000 ;

  document.getElementById("emission").value = emission.toFixed(2);

  let tbody = document.getElementById("emission-history-body");
  let row = tbody.insertRow();
  row.insertCell().innerHTML = new Date().toLocaleString();

  let jenisKendaraan = document.getElementById("jenis-kendaraan").value;
  row.insertCell().innerHTML = jenisKendaraan;

  let jenisPolutan = document.getElementById("jenis-polutan").value;
  row.insertCell().innerHTML = jenisPolutan;

  row.insertCell().innerHTML = volumeKendaraan;
  row.insertCell().innerHTML = vkt;
  row.insertCell().innerHTML = fe;
  row.insertCell().innerHTML = emission.toFixed(2);
  updateGraph();
});

function toggleGraph() {
  var chartContainer = document.getElementById("chartContainer");
  var toggleButton = document.getElementById("toggleButton");
  if (chartContainer.style.display === "none") {
    chartContainer.style.display = "block";
    toggleButton.innerHTML = "Minimize Graph";
  } else {
    chartContainer.style.display = "none";
    toggleButton.innerHTML = "Show Graph";
  }
}

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "CO2",
        backgroundColor: "rgba(255, 99, 132, 1)",
        borderColor: "rgba(255, 99, 132, 1)",
        data: []
      },
      {
        label: "PM10",
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        data: []
      },
      {
        label: "SO2",
        backgroundColor: "rgba(255, 206, 86, 1)",
        borderColor: "rgba(255, 206, 86, 1)",
        data: []
      },
      {
        label: "CO",
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        data: []
      },
      {
        label: "NOx",
        backgroundColor: "rgba(153, 102, 255, 1)",
        borderColor: "rgba(153, 102, 255, 1)",
        data: []
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function updateGraph() {
  let jenisKendaraan = document.getElementById("jenis-kendaraan").value;
  let jenisPolutan = document.getElementById("jenis-polutan").value;
  let emission = parseFloat(document.getElementById("emission").value);

  let dataIndex = myChart.data.labels.indexOf(jenisKendaraan);
  if (dataIndex === -1) {
    myChart.data.labels.push(jenisKendaraan);
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.push(0);
    });
    dataIndex = myChart.data.labels.length - 1;
  }  
  switch (jenisPolutan) {
    case "CO2":
      myChart.data.datasets[0].data[dataIndex] += emission;
      break;
    case "PM10":
      myChart.data.datasets[1].data[dataIndex] += emission;
      break;
    case "SO2":
      myChart.data.datasets[2].data[dataIndex] += emission;
      break;
    case "CO":
      myChart.data.datasets[3].data[dataIndex] += emission;
      break;
    case "NOx":
      myChart.data.datasets[4].data[dataIndex] += emission;
      break;
  }
  
  myChart.update();
}

function initializeChartLabels() {
  const vehicleTypesSelect = document.getElementById("jenis-kendaraan");
  const vehicleTypes = Array.from(vehicleTypesSelect.options).map(option => option.text);

  myChart.data.datasets.forEach((dataset) => {
    dataset.data = vehicleTypes.map(() => 0);
  });

  myChart.update();
}


initializeChartLabels();

  document.getElementById("download-csv").addEventListener("click", function () {
  let csv = "Tanggal/Jam,Jenis Kendaraan,Jenis Polutan,Volume Kendaraan,VKT,FE,Emisi\n";
  let rows = document.querySelectorAll("#emission-history-body tr");
  
  for (let i = 0; i < rows.length; i++) {
  let cells = rows[i].querySelectorAll("td");
  let rowData = "";
  for (let j = 0; j < cells.length; j++) {
  rowData += cells[j].innerText + ",";
  }
  csv += rowData + "\n";
  }
  
  let downloadLink = document.createElement("a");
  downloadLink.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  downloadLink.download = "emission-history.csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  });

  document.getElementById('importButton').addEventListener('click', function() {
    var file = document.getElementById('csvFileInput').files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var text = event.target.result;
        var rows = text.split('\n');
        var table = document.getElementById('emission-history-table');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(',');
            var row = table.insertRow(-1); // Insert a new row at the end of the table
            for (var j = 0; j < cells.length; j++) {
                var cell = row.insertCell(j);
                cell.textContent = cells[j];
            }
        }
    };
    reader.readAsText(file);
});

