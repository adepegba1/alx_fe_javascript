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

// Define a function to import quotes from a JSON file
function importFromJsonFile(event) {
  // Create a new FileReader object to read the file
  const fileReader = new FileReader();

  // Define an event handler for when the file is loaded
  fileReader.onload = function (event) {
    // Parse the JSON data from the file
    const importedQuotes = JSON.parse(event.target.result);

    // Add the imported quotes to the existing quotes array
    quotes.push(...importedQuotes);

    // Save the updated quotes array
    saveQuotes();

    // Alert the user that the quotes have been imported successfully
    alert("Quotes imported successfully!");
  };

  // Read the file as text
  fileReader.readAsText(event.target.files[0]);
}

// Define a function to export quotes to a JSON file
function exportToJsonFile() {
  // Stringify the quotes array to JSON with indentation
  const json = JSON.stringify(quotes, null, 2);

  // Create a new blob object with the JSON data
  const blob = new Blob([json], { type: "application/json" });

  // Create a new link element
  const link = document.createElement("a");

  // Set the link href to the blob URL
  link.href = URL.createObjectURL(blob);

  // Set the link download attribute to specify the file name
  link.download = "quotes.json";

  // Simulate a click on the link to trigger the download
  link.click();
}

// Add an event listener to the export button
exportBtn.addEventListener("click", () => {
  // Call the exportToJsonFile function when the button is clicked
  exportToJsonFile();
});

// 2. Creating a Dynamic Content Filtering System Using Web Storage and JSON

// Get a reference to the category filter dropdown element
const selection = document.getElementById("categoryFilter");

// Define a function to populate the category filter dropdown
function populateCategories() {
  // Create an array of unique categories from the quotes array
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  // Iterate over the unique categories and add them to the dropdown
  uniqueCategories.forEach((element) => {
    // Create a new option element for the category
    const options = document.createElement("option");

    // Set the value and text content of the option element
    options.value = element;
    options.textContent = element;

    // Add the option element to the dropdown
    selection.appendChild(options);
  });

  // Get the last selected category from local storage
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");

  // If a last selected category exists, set the dropdown value to it and filter quotes
  if (lastSelectedCategory) {
    selection.value = lastSelectedCategory;
    filterQuotes();
  } else {
    // Otherwise, set the dropdown value to "all" and filter quotes
    selection.value = "all";
    filterQuotes();
  }
}

// Define a function to filter quotes based on the selected category
function filterQuotes() {
  // Get the currently selected category
  const selectedCategory = selection.value;

  // Save the selected category to local storage
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  // Filter the quotes array based on the selected category
  const filteredQuotes = quotes.filter((quote) => {
    // Return true if the quote category matches the selected category or if "all" is selected
    return selectedCategory === "all" || quote.category === selectedCategory;
  });

  // Clear the quote display element
  quoteDisplay.innerHTML = "";

  // Show a random quote from the filtered quotes
  quoteElement.textContent = showRandomQuote(filteredQuotes);

  // Add the quote element to the quote display
  quoteDisplay.appendChild(quoteElement);
}

// Add an event listener to populate the categories when the document is loaded
document.addEventListener("DOMContentLoaded", populateCategories);

// 3. Syncing Data with Server and Implementing Conflict Resolution

// Define an asynchronous function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    // Use the fetch API to send a GET request to the server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    // Check if the response is OK (200-299) and parse the response data as JSON
    const data = await response.json();

    // Return the fetched quotes
    return data;
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error("Error fetching quotes:", error);
  }
}

// Define an asynchronous function to post a quote to the server
async function postQuoteToServer(quote) {
  try {
    // Use the fetch API to send a POST request to the server with the quote data
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // Specify the request method as POST
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(quote), // Stringify the quote object to JSON
    });

    // Check if the response is OK (200-299)
    if (!response.ok) {
      // Throw an error if the response is not OK
      throw new Error("Failed to post quote");
    }

    // Parse the response data as JSON
    const data = await response.json();

    // Return the posted quote
    return data;
  } catch (error) {
    // Log any errors that occur during the post operation
    console.error("Error posting quote:", error);
  }
}

// Define a function to sync quotes with the server
function syncQuotes() {
  // Fetch quotes from the server
  fetchQuotesFromServer().then((serverQuotes) => {
    // Get the local quotes from storage
    const localQuotes = getLocalQuotes();

    // Merge the local and server quotes
    const updatedQuotes = mergeQuotes(localQuotes, serverQuotes);

    // Save the updated quotes to storage
    saveLocalQuotes(updatedQuotes);

    // Notify the user that the quotes have been synced
    notifyUser("Quotes synced with server!");
  });
}

// Define a function to get the local quotes from storage
function getLocalQuotes() {
  // Get the quotes from local storage
  const data = localStorage.getItem("quotes");

  // If quotes exist, parse them as JSON; otherwise, return an empty array
  return data ? JSON.parse(data) : [];
}

// Define a function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
  // Create a map to store the merged quotes
  const localQuotesMap = {};

  // Add the local quotes to the map
  localQuotes.forEach((quote) => {
    localQuotesMap[quote.id] = quote;
  });

  // Add the server quotes to the map, overwriting any local quotes with the same ID
  serverQuotes.forEach((serverQuote) => {
    localQuotesMap[serverQuote.id] = serverQuote;
  });

  // Return the merged quotes as an array
  return Object.values(localQuotesMap);
}

// Define a function to save quotes to storage
function saveLocalQuotes(quotes) {
  // Stringify the quotes to JSON and save them to local storage
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Define a function to notify the user
function notifyUser(message) {
  // Implement your notification system here (e.g., display a message on the page)
  console.log(message);
}

// Set an interval to sync quotes with the server every 6 seconds
setInterval(syncQuotes, 6000);
