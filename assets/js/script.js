const API_KEY = "GU7Xo33eADdLU0cWm7PUlAxSxfw";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

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