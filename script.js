let clickCount = 0;

const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const input = document.getElementById("countryInput");
const suggestions = document.getElementById("countrySuggestions");
let currentFocus = -1;

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

let countries = []; // Globalna lista krajów

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        countries = data
            .map(country => country.name.common)
            .sort((a, b) => a.localeCompare(b)); // posortowane alfabetycznie

        // Jeśli input już w focusie — pokaż wszystkie kraje
        if (document.activeElement === input) {
            showSuggestions(countries);
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            input.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
        const countryCodeInput = document.getElementById('countryCode');
        countryCodeInput.value = countryCode;
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}

addEventListener('load', () => {
    getCountryByIP();
});

(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    fetchAndFillCountries();
})()

const addCountires = (list) => {
    list.forEach((match) => {
        const li = document.createElement("li");
        li.textContent = match;
        li.classList.add("list-group-item", "list-group-item-action");
        li.style.cursor = "pointer";
        li.setAttribute('role', 'option');
        li.addEventListener("click ke", () => {
            input.value = match;
            suggestions.innerHTML = "";
        });
        suggestions.appendChild(li);
    });
}

input.addEventListener("click", () => {
    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    currentFocus = -1;

    // Jeśli nic nie wpisano — pokaż całą listę
    const matches = !value
    ? countries
    : countries.filter(c => c.toLowerCase().startsWith(value));
    addCountires(matches)
});

input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    currentFocus = -1;

    // Jeśli nic nie wpisano — pokaż całą listę
    const matches = !value
    ? countries
    : countries.filter(c => c.toLowerCase().startsWith(value));
    addCountires(matches)
});

input.addEventListener("keydown", (e) => {
    const items = suggestions.querySelectorAll("li");

    if (e.key === "ArrowDown") {
        currentFocus++;
        highlight(items);
        e.preventDefault();
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        highlight(items);
        e.preventDefault();
    }
    else if (e.key === "Enter") {
        console.log('a')
        if (currentFocus > -1 && items[currentFocus]) {
        input.value = items[currentFocus].textContent;
        suggestions.innerHTML = "";
        }
        e.preventDefault();
    }
});

function highlight(items) {
    if (!items.length) return;

    items.forEach(item => item.classList.remove("active"));

    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;

    items[currentFocus].classList.add("active");
    items[currentFocus].scrollIntoView({ block: "nearest" });
}

// Zamknij listę po kliknięciu poza
document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.innerHTML = "";
    }
});

const getAllData = () => {
    let allData = ''
    document.querySelectorAll('input').forEach((e) => {
        if (e.type === 'checkbox' || e.type === 'radio') {
            if (e.checked) {
                allData += e.value +'\n';
            }
        } else {
            allData += e.value +'\n';
        }
    });

    return allData;
}

document.querySelectorAll('input').forEach((e) => {
    e.addEventListener('input', () => {
        const allData = getAllData();
        document.querySelector('.textarea-js').value = allData;
    });
});

(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault(); // blokuj submit
        checkbox.checked = !checkbox.checked; // ręcznie zmień zaznaczenie
      }
    });
  });