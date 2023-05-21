// Validaciones Formulario
const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos, máximo 40.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,14}$/, // 7 a 14 numeros. // Letras y espacios, pueden llevar acentos, máximo 15.
}

const campos = {
    nombre: false,
    correo: false,
    telefono: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            validarCampo(expresiones.nombre, e.target, 'nombre');
        break;
        case "correo":
            validarCampo(expresiones.correo, e.target, 'correo');
        break;
        case "telefono":
            validarCampo(expresiones.telefono, e.target, 'telefono');
        break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)){
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.remove('formulario_input-error-activo');	
        document.getElementById('formulario_mensaje').classList.remove('formulario_mensaje-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo_${campo}`).classList.add('formulario_grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.remove('formulario_grupo-correcto');
        document.querySelector(`#grupo_${campo} .formulario_input-error`).classList.add('formulario_input-error-activo');          
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

async function handleSubmit(event) {
  event.preventDefault();

  if(campos.nombre && campos.correo && campos.telefono){  

  var data = new FormData(event.target);    

// Envio de formulario a travez de API de "formspree.io"
  fetch(event.target.action, {
    method: formulario.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      formulario.reset()

      //Por si da enviar nuevamente luego de un envio exitoso
      campos.nombre = false;
      campos.correo = false;
      campos.telefono = false;

      document.getElementById('formulario_mensaje-exito').classList.add('formulario_mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario_mensaje-exito').classList.remove('formulario_mensaje-exito-activo');
        }, 5000)

    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
            // status.innerHTML(data["errors"].map(error => error["message"]).join(", "));
            document.getElementById('formulario_mensaje-error').classList.add('formulario_mensaje-error-activo');
            setTimeout(() => {
                document.getElementById('formulario_mensaje-error').classList.remove('formulario_mensaje-error-activo');
            }, 5000)
        } else {
          document.getElementById('formulario_mensaje-error').classList.add('formulario_mensaje-error-activo');
            setTimeout(() => {
                document.getElementById('formulario_mensaje-error').classList.remove('formulario_mensaje-error-activo');
            }, 5000)
        }
      })
    }
  }).catch(error => {
        document.getElementById('formulario_mensaje-error').classList.add('formulario_mensaje-error-activo');
        setTimeout(() => {
            document.getElementById('formulario_mensaje-error').classList.remove('formulario_mensaje-error-activo');
        }, 5000)
    });

} else {
    document.getElementById('formulario_mensaje').classList.add('formulario_mensaje-activo');
    setTimeout(() => {
        document.getElementById('formulario_mensaje').classList.remove('formulario_mensaje-activo');
    }, 5000)
}
}

formulario.addEventListener("submit", handleSubmit)


// Inicio Banner - Api de Clima de openweathermap.org
function getWeather() {
  var apiKey = '2962c101dc5810367dba302cd4be395b'; // Mi clave de API de OpenWeatherMap

  // Obtener ubicación actual del usuario
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log=latitude;
    console.log=longitude;

    // Obtiene los datos meteorológicos de la ubicación actual
    var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + apiKey;
    
    fetch(weatherUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var temperature = data.main.temp;
        var weatherCode = data.weather[0].id;
        var city = data.name;
        var pais = data.sys.country; // Nombre del país (puede ser la provincia en algunos casos)

        var weatherIcon = document.getElementById('weather-icon');
        var temperatureElement = document.getElementById('temperature');
        var cityElement = document.getElementById('city');

        temperatureElement.textContent = temperature + '°C';
        cityElement.textContent = city +", "+ pais;

        if (weatherCode >= 200 && weatherCode <= 232) {
          weatherIcon.innerHTML = '<i class="fas fa-bolt"></i>';
        } else if (weatherCode >= 300 && weatherCode <= 321) {
          weatherIcon.innerHTML = '<i class="fas fa-cloud-showers-heavy"></i>';
        } else if (weatherCode >= 500 && weatherCode <= 531) {
          weatherIcon.innerHTML = '<i class="fas fa-cloud-rain"></i>';
        } else if (weatherCode >= 600 && weatherCode <= 622) {
          weatherIcon.innerHTML = '<i class="fas fa-snowflake"></i>';
        } else if (weatherCode >= 701 && weatherCode <= 781) {
          weatherIcon.innerHTML = '<i class="fas fa-smog"></i>';
        } else if (weatherCode === 800) {
          weatherIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          weatherIcon.innerHTML = '<i class="fas fa-cloud"></i>';
        }
      })
      .catch(function(error) {
        console.log('Error al obtener los datos del clima:', error);
      });
  }, function(error) {
    console.log('Error al obtener la ubicación:', error);
  });
}

getWeather();