// VARIABLES-PÁGINAS 
const initDiv = document.getElementById("init");
const loginDiv = document.getElementById("login");
const homeDiv = document.getElementById("home");
const gameDiv = document.getElementById("game");
const resultsDiv = document.getElementById("results");

// VARIABLES-NAV
const navNav = document.getElementById("navNav");
const initNav = document.getElementById("initNav");
const loginNav = document.getElementById("loginNav");
const homeNav = document.getElementById("homeNav");
const gameNav = document.getElementById("gameNav");
const resultsNav = document.getElementById("resultsNav");

// VARIABLES-BOTONES
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const homeButtons = document.getElementById("goToGameBtn");

// VARIABLES-ELEMENTOS
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

// VARIABLES-CONTADOR
let score = 0;
let partidaActual = 1;
const resultadosPartidas = [];

// VARIABLES-VALUE
const usernameValue = document.getElementById("usernameValue");

// HIDE AND GO - PAGES
function hideViews() {
  initDiv.classList.add("hide");
  loginDiv.classList.add("hide");
  homeDiv.classList.add("hide");
  gameDiv.classList.add("hide");
  resultsDiv.classList.add("hide");
  loginNav.classList.add("hide");
}

window.onload = function (e) {
  e.preventDefault();
  let logo = document.getElementById('init');

  setTimeout(function () {
    logo.style.display = 'none';
    goLogin(); // Llamada a la función goLogin() después de 5 segundos
  }, 5000);
};

function goLogin() {
  hideViews();
  loginDiv.classList.remove("hide");
}

function goHome() {
  hideViews();
  homeDiv.classList.remove("hide");
}

function goGame() {
  hideViews();
  console.log("hola")
  gameDiv.classList.remove("hide");
}

function goResults() {
  hideViews();
  resultsDiv.classList.remove("hide");
  showResultsTable();
}

function onSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const userObj = { username, password };
  localStorage.setItem("user", JSON.stringify(userObj));
  mostrarPantallaNAME();
}

function mostrarPantallaNAME() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    usernameValue.textContent = user.username;
  }
}

function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
function showResultsTable() {
  const table = document.getElementById("results-table");
  table.innerHTML = ""; // Limpiar la tabla antes de mostrar los resultados

  // Crear encabezados de columna
  const headerRow = document.createElement("tr");
  const userHeader = document.createElement("th");
  userHeader.textContent = "Username";
  const scoreHeader = document.createElement("th");
  scoreHeader.textContent = "Score";
  headerRow.appendChild(userHeader);
  headerRow.appendChild(scoreHeader);
  table.appendChild(headerRow);

  // Agregar filas de resultados
  resultadosPartidas.forEach((resultado) => {
    const row = document.createElement("tr");
    const userCell = document.createElement("td");
    userCell.textContent = resultado.username;
    const scoreCell = document.createElement("td");
    scoreCell.textContent = resultado.score;
    row.appendChild(userCell);
    row.appendChild(scoreCell);
    table.appendChild(row);
  });

  // Mostrar la tabla de resultados
  table.classList.remove("hide");
}



axios
  .get("https://opentdb.com/api.php?amount=10&category=29&difficulty=easy&type=multiple")
  .then((res) => {
    const preguntas = res.data.results;
    let preguntaIndex = 0;

    function resetState() {
      nextButton.classList.add("hide");
      while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
      }
    }

    function mostrarPregunta() {
      const preguntaActual = preguntas[preguntaIndex];
      const decodedQuestion = decodeHTML(preguntaActual.question);
      questionElement.innerText = decodedQuestion;

      answerButtonsElement.innerHTML = "";

      const answers = preguntaActual.incorrect_answers.concat(preguntaActual.correct_answer);
      const randomAnswers = answers.sort(() => Math.random() - 0.5);

      randomAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("answer-btn");
        if (answer === preguntaActual.correct_answer) {
          button.addEventListener("click", () => seleccionarRespuesta(true));
        } else {
          button.addEventListener("click", () => seleccionarRespuesta(false));
        }
        answerButtonsElement.appendChild(button);
      });
    }

    function seleccionarRespuesta(correct) {
      if (correct) {
        console.log("Respuesta correcta");
        score++; // Incrementa la puntuación si la respuesta es correcta
      } else {
        console.log("Respuesta incorrecta");
      }

      preguntaIndex++;

      if (preguntaIndex === preguntas.length) {
        mostrarResultados();
      } else {
        mostrarPregunta();
      }
    }

    function mostrarResultados() {
      questionContainerElement.classList.add("hide");
      console.log("Mostrar resultados");

      const resultadoElement = document.createElement("div");
      resultadoElement.classList.add("resultado");

      resultadoElement.innerText = `Has respondido ${score} preguntas correctamente de ${preguntas.length} en la partida ${partidaActual}.`;

      gameDiv.appendChild(resultadoElement);

      // Guardar los resultados de la partida actual
      resultadosPartidas.push({ partida: partidaActual, score, totalPreguntas: preguntas.length });

      const reiniciarButton = document.createElement("button");
      reiniciarButton.innerText = "Volver a empezar";
      reiniciarButton.classList.add("reiniciar-btn");
      reiniciarButton.addEventListener("click", reiniciarJuego);
      resultadoElement.appendChild(reiniciarButton);

      partidaActual++; // Incrementar el número de partida
      score = 0; // Reiniciar la puntuación

      showResultsTable(); // Mostrar la tabla de resultados actualizada
    }

    function reiniciarJuego() {
      preguntaIndex = 0; // Reinicia el índice de la pregunta actual
      gameDiv.removeChild(document.querySelector(".resultado"));
      startButton.classList.remove("hide");
    }

    function setNextQuestion() {
      resetState();
      mostrarPregunta();
    }

    function startGame() {
      resetState();
      preguntaIndex = 0; // Reinicia el índice de la pregunta actual
      startButton.classList.add("hide");
      questionContainerElement.classList.remove("hide");
      mostrarPregunta(); // Muestra la primera pregunta
    }

    if (startButton) {
      startButton.addEventListener("click", startGame); // Agrega el evento de clic para iniciar el juego
    }
    if (nextButton) {
      nextButton.addEventListener("click", setNextQuestion);
    }
  })
  .catch((err) => console.error(err));

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "sara" && password === "password") {
    document.getElementById("message").textContent = "Login exitoso";
    mostrarPantallaNAME(); // Agrega esta línea para llamar a mostrarPantallaNAME()
    goHome();
  } else {
    document.getElementById("message").textContent = "Usuario o contraseña incorrectos";
  }
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
}

homeButtons.addEventListener("click", goGame)
loginNav.addEventListener("click", goLogin);
homeNav.addEventListener("click", goHome);
gameNav.addEventListener("click", goGame);
resultsNav.addEventListener("click", goResults);
