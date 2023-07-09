let plot = (data) => {
  //Recuperar los canvas de HTML
  const ctx = document.getElementById('myChart');
  const ctx2 = document.getElementById('myChart2');

  //Creacion de los dataset para la info que se mostrara en ambos canvas
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

  //Definir el tipo de grafico y su informacion
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

  //Instanciacion de ambos charts
  const chart = new Chart(ctx, config)
  const chart2 = new Chart(ctx2, config2)

}

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
  let URL_proxy = 'https://cors-anywhere.herokuapp.com/';
  let URL = URL_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php';
  fetch(URL)
     	.then(response => response.text())
        .then(data => {
           const parser = new DOMParser();
           const xml = parser.parseFromString(data, "text/html");
           console.log(xml);
           let contenedorMareas = xml.getElementsByTagName('div')[0];
           let contenedorHTML = document.getElementById('table-container');
           contenedorHTML.innerHTML = contenedorMareas.innerHTML;

          

        })
    .catch(console.error);
    
    

}


(
  function () {
    let meteo = localStorage.getItem('meteo');

    if (meteo == null) {
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
