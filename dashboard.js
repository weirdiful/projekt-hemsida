const token = sessionStorage.getItem("token");
if (!token) {
  alert("Du måste logga in");
  window.location.href = "login.html";
}

async function fetchOrders() {
  const container = document.getElementById("orders");
  container.innerHTML = "<p>Laddar beställningar...</p>";

  try {
    const res = await fetch("https://projekt-backend-x0s8.onrender.com/api/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Kunde inte hämta beställningar");

    const orders = await res.json();

    container.innerHTML = "";

    if (orders.length === 0) {
      container.innerHTML = "<p>Inga inkomna beställningar just nu.</p>";
      return;
    }

    orders.forEach(order => {
      const el = document.createElement("div");
      el.classList.add("order");
      el.innerHTML = `
        <strong>${order.customer_name}</strong><br />
        ${order.size || ""} ${order.base || ""} med ${order.flavor || ""}
        ${order.topping ? `+ ${order.topping}` : ""}<br />
        <em>${order.note || ""}</em><br />
        <button data-id="${order.id}">Markera som klar</button>
      `;
      container.appendChild(el);
    });

    document.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await fetch(`https://projekt-backend-x0s8.onrender.com/api/orders/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
        fetchHistory();
      });
    });

  } catch (err) {
    container.innerHTML = `<p class="error">Fel vid hämtning av beställningar: ${err.message}</p>`;
  }
}


async function fetchHistory() {
  const container = document.getElementById("history");
  container.innerHTML = "<p>Laddar slutförda beställningar...</p>";

  try {
    const res = await fetch("https://projekt-backend-x0s8.onrender.com/api/orders/history", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Kunde inte hämta historik");

    const orders = await res.json();

    container.innerHTML = "";

    if (orders.length === 0) {
      container.innerHTML = "<p>Inga slutförda beställningar ännu.</p>";
      return;
    }

    orders.forEach(order => {
      const el = document.createElement("div");
      el.classList.add("order", "done");
      el.textContent = `${order.customer_name} – ${order.size || ""} ${order.base || ""} (${order.flavor || ""})`;
      container.appendChild(el);
    });

  } catch (err) {
    container.innerHTML = `<p class="error">Fel vid hämtning av historik: ${err.message}</p>`;
  }
}


fetchOrders();
fetchHistory();
