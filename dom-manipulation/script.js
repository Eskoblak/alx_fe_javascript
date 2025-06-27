// Array to hold quotes
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "If you want to lift yourself up, lift up someone else.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const displayDiv = document.getElementById('quoteDisplay');
  displayDiv.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Attach event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
