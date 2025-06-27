// ---------------------------
// Load/Save Quotes from localStorage
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
// Populate Category Dropdown
// ---------------------------
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset options
  filter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  // Restore selected filter from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    filter.value = savedCategory;
    filterQuotes();
  }
}


// ---------------------------
// Filter Quotes by Category
// ---------------------------
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== 'all') {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  const displayDiv = document.getElementById('quoteDisplay');
  displayDiv.innerHTML = '';

  filtered.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `
      <p><strong>Quote:</strong> "${quote.text}"</p>
      <p><strong>Category:</strong> ${quote.category}</p>
      <hr/>
    `;
    displayDiv.appendChild(quoteElement);
  });
}


// ---------------------------
// Show a Random Quote
// ---------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem('lastQuote', JSON.stringify(quote));

  const displayDiv = document.getElementById('quoteDisplay');
  displayDiv.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}


// ---------------------------
// Add a New Quote
// ---------------------------
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotesToLocalStorage();
    populateCategories();
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}


// ---------------------------
// Export Quotes to JSON File
// ---------------------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}


// ---------------------------
// Import Quotes from JSON File
// ---------------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotesToLocalStorage();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  reader.readAsText(file);
}


// ---------------------------
// Initialization
// ---------------------------
loadQuotesFromLocalStorage();
populateCategories();

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);
