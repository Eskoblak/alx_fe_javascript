let quotes = [];

function loadQuotesFromLocalStorage() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "If you want to lift yourself up, lift up someone else.", category: "Inspiration" }
  ];
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

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

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = '';
  filtered.forEach(q => {
    const el = document.createElement('div');
    el.innerHTML = `
      <p><strong>Quote:</strong> "${q.text}"</p>
      <p><strong>Category:</strong> ${q.category}</p>
      <hr/>
    `;
    display.appendChild(el);
  });
}

function showRandomQuote() {
  const rand = Math.floor(Math.random() * quotes.length);
  const quote = quotes[rand];
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

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
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
}

function notifyUser(message) {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.style.display = 'block';
  setTimeout(() => note.style.display = 'none', 5000);
}

// ✅ Required function name
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// ✅ Required function name
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let added = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text && q.category === serverQuote.category);
    if (!exists) {
      quotes.push(serverQuote);
      added++;
    }
  });

  if (added > 0) {
    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();
    notifyUser(`${added} new quote(s) synced from server.`);
  }

  // ✅ Post quotes to server (simulated)
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotes)
    });
    console.log("Quotes posted to server.");
  } catch (err) {
    console.error("Error posting to server:", err);
  }
}

// ✅ Initial setup
loadQuotesFromLocalStorage();
populateCategories();

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);
document.getElementById('manualSync').addEventListener('click', syncQuotes);
setInterval(syncQuotes, 30000);
