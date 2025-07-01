// ملف: js/login-classic.js

Backendless.initApp(
  '86F15FBA-3175-47FF-A061-D7DEECE8F699', 
  '25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A'
);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const user = await Backendless.UserService.login(email, password, true);

    if (user.email === "ahmedaltalqani@gmail.com") {
      window.location.href = "admin.html";
    } else {
      localStorage.setItem("username", user.name || email);
      window.location.href = "flights.html";
    }

  } catch (error) {
    document.getElementById("errorMsg").innerText = "فشل تسجيل الدخول: " + error.message;
  }
};
