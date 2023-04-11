const API_KEY = "GU7Xo33eADdLU0cWm7PUlAxSxfw";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function getStatus(e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    throw new Error(data.error);
  }
}

function displayStatus(data) {
  const resultsModalTitle = document.getElementById('resultsModalTitle');
  const resultsModalContent = document.getElementById('results-content');
  resultsModalTitle.innerText = "API Key Status";
  resultsModalContent.innerHTML = `<div>Your key is valid until</div><div class="key-status">${data.expiry}</div>`;
  resultModal.show();
}

// function processFormToJson(form) {
//   var formObject = {};
//   form.forEach(createFormObject);
//   return JSON.stringify(formObject);
//
//   function createFormObject(value, key) {
//     formObject[key] = value;
//   }
// }

function processOptions(form) {
  let optArray = [];

  for (let e of form.entries()) {
    if (e[0] === "options") {
      optArray.push(e[1]);
    }
  }

  form.delete("options");

  form.append("options", optArray.join());

  return form;
}

async function postForm(e) {
  var formElement = document.getElementById('checksform');
  var form = new FormData(formElement);
  form = processOptions(form);

  const queryOption = {
    method: "POST",
    headers: {
      "Authorization": API_KEY
    },
    body: form
  };

  const response = await fetch(API_URL, queryOption);
  const data = await response.json();

  if (response.ok) {
    displayErrors(data);
  }  else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayErrors(data) {
  let results = "";
  let heading = `JSHint Results for ${data.file}`;
  if (data.total_errors === 0) {
    results = `<div class="no_errors">No errors reported!</div>`;
  } else {
    results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>, `;
      results += `column <span class="column">${error.col}:</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultModal.show();
}

function displayException(data) {
  var heading = `An Exception has occurred`;
  let result;
  result = `<div>The API return status code ${data.status_code}</div>`;
  result += `<div>Error number: <strong>${data.error_no}</strong></div>`;
  result += `<div>Error text: <strong>${data.error}</strong></div>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = result;
  resultModal.show();
}