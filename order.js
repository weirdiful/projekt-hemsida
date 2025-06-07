const form = document.getElementById("orderForm");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());


  if (data.topping === "inga") {
    data.topping = "";
  }

  const response = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (response.ok) {
    feedback.textContent = "Din beställning är skickad! 🍹";
    form.reset();
  } else {
    feedback.textContent = "Något gick fel: " + (result.message || "okänt fel");
  }
});
