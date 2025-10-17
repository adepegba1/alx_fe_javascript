const submitBtn = document.getElementById("newQuote");
const quoteDisplay = document.getElementById("quoteDisplay");

let quotes = [
  {
    category: "Motivation",
    quote: "Believe you can and you're halfway there.",
  },
  {
    category: "Success",
    quote: "It does not matter how slowly you go as long as you do not stop.",
  },
  {
    category: "Happiness",
    quote:
      "Happiness is not something ready made. It comes from your own actions.",
  },
  {
    category: "Inspiration",
    quote:
      "You don't have to be great to start, but you have to start to be great.",
  },
  {
    category: "Resilience",
    quote: "Life is 10% what happens to you and 90% how you react to it.",
  },
];

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  if (newQuoteCategory.value !== "" && newQuoteText.value !== "") {
    const newQuote = {
      category: newQuoteCategory.value.trim(),
      quote: newQuoteText.value.trim(),
    };
    quotes.push(newQuote);
    newQuoteCategory.value = "";
    newQuoteText.value = "";
    newQuoteText.focus();
    quoteDisplay.innerHTML = showRandomQuote();
  }
}

function showRandomQuote() {
  if (quotes.length > 0) {
    const rand = Math.floor(Math.random() * quotes.length);
    return `${quotes[rand].category}: "${quotes[rand].quote}"`;
  } else {
    return "No quotes available";
  }
}
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  quoteDisplay.innerHTML = showRandomQuote();
});

function addQuote() {
  createAddQuoteForm();
}
