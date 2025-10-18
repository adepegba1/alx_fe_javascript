// 0. Building a Dynamic Content Generator with Advanced DOM Manipulation
const submitBtn = document.getElementById("newQuote");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteElement = document.createElement("p");
const exportBtn = document.getElementById("export");

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
    // quoteElement.innerHTML = showRandomQuote(filterQuotes());
  }
}

function showRandomQuote(quotesToShow = quotes) {
  if (quotesToShow.length > 0) {
    const rand = Math.floor(Math.random() * quotesToShow.length);
    return `${quotesToShow[rand].category}: "${quotesToShow[rand].text}"`;
  } else {
    return "No quotes available";
  }
}
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  quoteDisplay.innerHTML = "";
  quoteElement.textContent = showRandomQuote();
  quoteDisplay.appendChild(quoteElement);
  filterQuotes();
});

function addQuote() {
  createAddQuoteForm();
}

// 1. Implementing Web Storage and JSON Handling
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
function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}
exportBtn.addEventListener("click", () => {
  exportToJsonFile();
});

// 2. Creating a Dynamic Content Filtering System Using Web Storage and JSON
const selection = document.getElementById("categoryFilter");
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];
  uniqueCategories.forEach((element) => {
    const options = document.createElement("option");
    options.value = element;
    options.textContent = element;
    selection.appendChild(options);
  });
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    selection.value = lastSelectedCategory;
    filterQuotes();
  } else {
    selection.value = "all";
    filterQuotes();
  }
}
function filterQuotes() {
  const selectedCategory = selection.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  const filteredQuotes = quotes.filter((quote) => {
    return selectedCategory === "all" || quote.category === selectedCategory;
  });
  quoteDisplay.innerHTML = "";
  quoteElement.textContent = showRandomQuote(filteredQuotes);
  quoteDisplay.appendChild(quoteElement);
}
document.addEventListener("DOMContentLoaded", populateCategories);

// 3. Syncing Data with Server and Implementing Conflict Resolution

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
    if (!response.ok) {
      throw new Error("Failed to post quote");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

function syncQuotes() {
  fetchQuotesFromServer().then((serverQuotes) => {
    const localQuotes = getLocalQuotes();
    const updatedQuotes = mergeQuotes(localQuotes, serverQuotes);
    saveLocalQuotes(updatedQuotes);
  });
}

function getLocalQuotes() {
  const data = localStorage.getItem("quotes");
  return data ? JSON.parse(data) : [];
}

function mergeQuotes(localQuotes, serverQuotes) {
  const localQuotesMap = {};
  localQuotes.foreach((quote) => {
    localQuotesMap[quote.category] = quote;
  });
  serverQuotes.forEach((serverQuote) => {
    localQuotesMap[serverQuote.category] = serverQuote;
  });
  return Object.values(localQuotesMap);
}

function saveLocalQuotes(quotes) {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
