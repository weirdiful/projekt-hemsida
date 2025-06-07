const token = sessionStorage.getItem("token");
if (!token) {
  alert("Du måste logga in");
  window.location.href = "login.html";
}

async function fetchOrders() {
  const res = await fetch("https://din-backend-url.onrender.com/api/orders", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const orders = await res.json();

  const container = document.getElementById("orders");
  container.innerHTML = "";
  orders.forEach(order => {
    const el = document.createElement("div");
    el.classList.add("order");
    el.innerHTML = `
      <strong>${order.customer_name}</strong>: ${order.size} ${order.base} med ${order.flavor} + ${order.topping || "inga"}<br />
      <em>${order.note || ""}</em>
      <button data-id="${order.id}">Markera som klar</button>
    `;
    container.appendChild(el);
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
      fetchHistory();
    });
  });
}

async function fetchHistory() {
  const res = await fetch("onrender.com/api/orders/history", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const orders = await res.json();

  const container = document.getElementById("history");
  container.innerHTML = "";
  orders.forEach(order => {
    const el = document.createElement("div");
    el.classList.add("order", "done");
    el.textContent = `${order.customer_name} – ${order.size} ${order.base} (${order.flavor})`;
    container.appendChild(el);
  });
}

fetchOrders();
fetchHistory();
