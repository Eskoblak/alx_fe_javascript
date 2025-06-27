// ---------------------------
// Quotes Storage
// ---------------------------
let quotes = [];

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "If you want to lift yourself up, lift up someone else.", category: "Inspiration" }
    ];
  }
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ---------------------------
// Populate Categories
// ---------------------------
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    filter.value = saved;
    filterQuotes();
  }
}

// ---------------------------
// Filter Quotes by Category
// ---------------------------
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  let filtered = (selected === 'all') ? quotes : quotes.filter(q => q.category === selected);

  const displayDiv = document.getElementById('quoteDisplay');
  displayDiv.innerHTML = '';
  filtered.forEach(q => {
    const qEl = document.createElement('div');
    qEl.innerHTML = `
      <p><strong>Quote:</strong> "${q.text}"</p>
      <p><strong>Category:</strong> ${q.category}</p>
      <hr/>
    `;
    displayDiv.appendChild(qEl);
  });
}

// ---------------------------
// Random Quote Display
// ---------------------------
function showRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// ---------------------------
// Add Quote
// ---------------------------
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotesToLocalStorage();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// ---------------------------
// Export Quotes
// ---------------------------
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------
// Import Quotes
// ---------------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes = imported;
        saveQuotesToLocalStorage();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error parsing file.");
    }
  };
  reader.readAsText(file);
}

// ---------------------------
// Notify User
// ---------------------------
function notifyUser(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.style.display = 'block';
  setTimeout(() => note.style.display = 'none', 5000);
}

// ---------------------------
// Simulated Server Sync
// ---------------------------
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchServerQuotes() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (e) {
    console.error("Failed to fetch from server", e);
    return [];
  }
}

async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  let added = 0;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) {
      quotes.push(sq);
      added++;
    }
  });

  if (added > 0) {
    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();
    notifyUser(`${added} new quote(s) synced from server.`);
  }
}

// ---------------------------
// Init
// ---------------------------
loadQuotesFromLocalStorage();
populateCategories();

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);
document.getElementById('manualSync').addEventListener('click', syncWithServer);

// Periodic Sync
setInterval(syncWithServer, 30000);
