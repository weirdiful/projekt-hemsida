const form = document.getElementById("orderForm");
const feedback = document.getElementById("feedback");
const drinkTypeSelect = document.getElementById("drinkTypeSelect");
const flavorSelect = document.getElementById("flavorSelect");

// Dryckestyper med smaker och ikoner
const drinkMenu = {
  milk_tea: {
    label: "Mjölkte",
    flavors: ["Taro", "Matcha", "Chai", "Original", "Honungsmelon"]
  },
  fruit_tea: {
    label: "Fruktte",
    flavors: ["Jordgubb", "Grape", "Passionsfrukt", "Mango", "Citron"]
  },
  fresh_tea: {
    label: "Te",
    flavors: ["Svart te", "Grönt te", "Oolong"]
  },
  latte: {
    label: "Latte",
    flavors: ["Matcha", "Brown Sugar", "Vanilj"]
  },
  smoothie: {
    label: "Smoothie",
    flavors: ["Jordgubb", "Mango", "Passionsfrukt"]
  }
};

// Fyll dryckestyp-menyn
const drinkTypeContainer = document.getElementById("drinkTypeContainer");
const drinkTypeInput = document.getElementById("drinkTypeInput");

function populateDrinkTypes() {
  drinkTypeContainer.innerHTML = "";

  for (const key in drinkMenu) {
    const item = drinkMenu[key];

    const button = document.createElement("button");
    button.type = "button";
    button.className = "drink-type-option";
    button.dataset.value = key;

    button.innerHTML = `<span>${item.label}</span>`;

    button.addEventListener("click", () => {
      document.querySelectorAll(".drink-type-option").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      drinkTypeInput.value = key;
      updateFlavors();
    });

    drinkTypeContainer.appendChild(button);
  }

  // Välj första som standard
  const firstKey = Object.keys(drinkMenu)[0];
  drinkTypeInput.value = firstKey;
  const firstButton = drinkTypeContainer.querySelector(".drink-type-option");
  if (firstButton) firstButton.classList.add("selected");
  updateFlavors();
}


// Uppdatera smaker
function updateFlavors() {
  const selectedType = drinkTypeInput.value;
  const flavors = drinkMenu[selectedType]?.flavors || [];
  flavorSelect.innerHTML = "";
  flavors.forEach(flavor => {
    const option = document.createElement("option");
    option.value = flavor.toLowerCase();
    option.textContent = flavor;
    flavorSelect.appendChild(option);
  });
}

// Initiera menyer
populateDrinkTypes();
drinkTypeSelect.addEventListener("change", updateFlavors);
updateFlavors();

// Skicka formuläret
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("https://projekt-backend-x0s8.onrender.com/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  if (response.ok) {
    feedback.textContent = "Din beställning är skickad!";
    form.reset();
    updateFlavors();
  } else {
    feedback.textContent = "Något gick fel: " + (result.message || "okänt fel");
  }
});
