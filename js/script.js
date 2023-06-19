let load = (data) => { 

  let timezone = data["timezone"]
  let timezone_ab = data["timezone_abbreviation"]

  let timezoneHTML = document.getElementById("timez")
  let timezone_abHTML = document.getElementById("timeza")

  timezoneHTML.textContent = timezone
  timezone_abHTML.textContent = timezone_ab

  plot(data)

  

  console.log(data);

}

let loadInocar = () => {

  let URL = 'https://cors-anywhere.herokuapp.com/https://www.inocar.mil.ec/mareas/consultan.php';
  fetch(URL)
 	.then(response => response.text())
    .then(data => {
       const parser = new DOMParser();
       const xml = parser.parseFromString(data, "text/html");
       console.log(xml);
    })
    .catch(console.error);

    let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
    let contenedorHTML = document.getElementById('chart3');
    contenedorHTML.innerHTML = contenedorMareas.innerHTML;

}




let plot = (data) => { 

  const ctx = document.getElementById('myChart'); 
  const ctx2 = document.getElementById('myChart2'); 
  const dataset = {
    labels: data.hourly.time, /* ETIQUETA DE DATOS */
    datasets: [{
        label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
        data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]  
};

const dataset2 = {
  labels: data.daily.time, /* ETIQUETA DE DATOS */
  datasets: [{
      label: 'Temperatura Maxima semanal', /* ETIQUETA DEL GRÁFICO */
      data: data.daily.temperature_2m_max, /* ARREGLO DE DATOS */
      barPercentage: 2,
      barThickness: 15,
      maxBarThickness: 18,
      minBarLength: 2,
      
  }]  
};

  const config = {
    type: 'line',
    data: dataset,
  };


  const config2 = {
    type: 'bar',
    data: dataset2,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  const chart = new Chart(ctx, config)
  const chart2 = new Chart(ctx2, config2)

 }


(
  function () {
    let meteo = localStorage.getItem('meteo');
    
    if(meteo == null) {
      let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m&daily=temperature_2m_max&timezone=auto';
          
      fetch(URL)
      .then(response => response.json())
      .then(data => {
          load(data)
          /* GUARDAR DATA EN MEMORIA */
          localStorage.setItem("meteo", JSON.stringify(data))
  
      })
      .catch(console.error);
  
    } else {
  
        /* CARGAR DATA EN MEMORIA */
        load(JSON.parse(meteo))
  
    }

    loadInocar();
    
  }
)();
