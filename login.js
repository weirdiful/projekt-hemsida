document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("https://projekt-backend-x0s8.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
  
    if (res.ok && data.token) {
      sessionStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginFeedback").textContent = data.message || "Fel vid inloggning";
    }
  });
  