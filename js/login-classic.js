Backendless.initApp(
  "86F15FBA-3175-47FF-A061-D7DEECE8F699",
  "25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A"
);

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("errorMsg");

  Backendless.UserService.login(email, password, true)
    .then(user => {
      if (user.email === "ahmedaltalqani@gmail.com") {
        window.location.href = "admin.html";
      } else {
        localStorage.setItem("username", user.name || email);
        window.location.href = "flights.html";
      }
    })
    .catch(error => {
      errorBox.textContent = "فشل تسجيل الدخول: " + error.message;
    });
}
