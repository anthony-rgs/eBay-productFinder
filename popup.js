let translations = {};

// Load translations from Json file
fetch("translations.json")
  .then((response) => response.json())
  .then((data) => {
    translations = data;
    updateLanguage("en"); // Default
  })
  .catch((error) => {
    console.error("Error loading translations:", error);
  });

// Function to update texts according to the selected language
function updateLanguage(language) {
  document.getElementById("input-label").innerText =
    translations[language].input_label;
  document.getElementById("toggle-label").innerText =
    translations[language].toggle_label;
  document.getElementById("button").innerText = translations[language].button;
}

// Event listener for language change
document
  .getElementById("select-language")
  .addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    updateLanguage(selectedLanguage);
  });

// Focus on input when the extension is open
const inputElement = document.getElementById("urlInput");
if (inputElement) {
  inputElement.focus();
}

// Setup and open url
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Setup Url
  const selectLanguage = document.getElementById("select-language");
  const domainCountry = translations[selectLanguage.value].domain_country;
  const urlStart = `https://www.ebay.${domainCountry}/sch/i.html?_nkw=`;
  const urlEnd = "&rt=nc&LH_Sold=1&LH_Complete=1";

  const productName = document.getElementById("urlInput").value.trim();
  const checkbox = document.getElementById("checkbox");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    let tabUrl;

    if (checkbox.checked) {
      tabUrl = `${urlStart}${productName}${urlEnd}`;
    } else {
      tabUrl = `${urlStart}${productName}`;
    }

    chrome.tabs.create({ url: tabUrl, index: currentTab.index + 1 });
  });

  document.getElementById("urlInput").value = "";
});

// Set data from chrome.storage
document.addEventListener("DOMContentLoaded", function () {
  // Set checkbox
  const checkbox = document.getElementById("checkbox");

  chrome.storage.local.get(["toggleState"], function (result) {
    if (result.toggleState === undefined) {
      checkbox.checked = true;
    } else {
      checkbox.checked = result.toggleState;
    }
  });

  // Listen changes
  checkbox.addEventListener("change", function () {
    chrome.storage.local.set({ toggleState: checkbox.checked });
  });

  // ------

  // Set language
  const selectLanguage = document.getElementById("select-language");

  chrome.storage.local.get(["selectedLanguage"], function (result) {
    if (result.selectedLanguage) {
      selectLanguage.value = result.selectedLanguage;
      updateLanguage(result.selectedLanguage);
    } else {
      selectLanguage.value = "en"; // Default
      updateLanguage("en");
    }
  });

  // Listen changes
  selectLanguage.addEventListener("change", function () {
    const selectedLanguage = selectLanguage.value;
    chrome.storage.local.set({ selectedLanguage: selectedLanguage });
    updateLanguage(selectedLanguage);
  });
});
