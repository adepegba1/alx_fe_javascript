// 0. Building a Dynamic Content Generator with Advanced DOM Manipulation
const submitBtn = document.getElementById("newQuote");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteElement = document.createElement("p");

let quotes = JSON.parse(localStorage.getItem("quotes")) ||
  JSON.parse(sessionStorage.getItem("quotes")) || [
    {
      category: "Motivation",
      text: "Believe you can and you're halfway there.",
    },
    {
      category: "Success",
      text: "It does not matter how slowly you go as long as you do not stop.",
    },
    {
      category: "Happiness",
      text: "Happiness is not something ready made. It comes from your own actions.",
    },
    {
      category: "Inspiration",
      text: "You don't have to be great to start, but you have to start to be great.",
    },
    {
      category: "Resilience",
      text: "Life is 10% what happens to you and 90% how you react to it.",
    },
  ];

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  if (newQuoteCategory.value !== "" && newQuoteText.value !== "") {
    const newQuote = {
      category: newQuoteCategory.value.trim(),
      text: newQuoteText.value.trim(),
    };
    quotes.push(newQuote);
    let quotesString = JSON.stringify(quotes);
    localStorage.setItem("quotes", quotesString);
    sessionStorage.setItem("quotes", quotesString);

    newQuoteCategory.value = "";
    newQuoteText.value = "";
    newQuoteText.focus();
    quoteElement.innerHTML = showRandomQuote();
  }
}

function showRandomQuote() {
  if (quotes.length > 0) {
    const rand = Math.floor(Math.random() * quotes.length);
    return `${quotes[rand].category}: "${quotes[rand].text}"`;
  } else {
    return "No quotes available";
  }
}
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  quoteDisplay.innerHTML = "";
  quoteElement.textContent = showRandomQuote();
  quoteDisplay.appendChild(quoteElement);
});

function addQuote() {
  createAddQuoteForm();
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}
