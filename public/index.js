// initialize variables and display
const http = new XMLHttpRequest();
let responseData = [];
getNames();

// listen for and capture newly entered name
let inputName = document.querySelector('input');
inputName.onkeypress = function(event) {
  let name = inputName.value.trim();
  if (name.length === 0 || event.key !== 'Enter') {
    if (event.key === 'Enter') {
      alert('Please enter a name.');
      inputName.value = '';
    }
    return;
  }
  inputName.value = '';
  addName(name);
};

// get all names from database
function getNames() {
  http.open('GET', location.origin + '/api/names');
  http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      responseData = JSON.parse(http.responseText);
      responseData.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      updateResponseArea(responseData);
    } else if (http.readyState === XMLHttpRequest.DONE) {
      alert('An error occurred when getting names from the database.');
    }
  };
  http.send();
}

// add new name to database
function addName(name) {
  name = sanitize(name);
  http.open('POST', location.origin + '/api/names');
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let timestamp = new Date().toISOString();
  let data = 'name=' + name + '&timestamp=' + timestamp;
  http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 201) {
      getNames();
    } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 201) {
      alert('An error occurred when adding the name to the database.');
    }
  };
  http.send(data);
}

// update the response area with new data from database
function updateResponseArea(responseData) {
  let liList = document.querySelectorAll('li');
  for (let i = 0; i < liList.length; i++) {
    liList[i].parentElement.removeChild(liList[i]);
  }
  let responseHead = document.querySelector('#responseHead');
  let responseArea = document.querySelector('#responseArea');
  if (responseData.length === 0) {
    responseHead.textContent = 'No items in database.';
  } else {
    responseHead.textContent = 'Database contents:';
    for (let i = 0; i < responseData.length; i++) {
      let li = document.createElement('LI');
      li.textContent = sanitize(responseData[i].name);
      li.style.marginTop = '10px';
      responseArea.appendChild(li);
    }
  }
}

// sanitize inputs/outputs to prevent xss
function sanitize(str) {
  return String(str)
    .replace(/&(?!amp;|lt;|gt;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
