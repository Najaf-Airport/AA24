import backendless from './backendless.min.js';

backendless.initApp(
  '86F15FBA-3175-47FF-A061-D7DEECE8F699',
  '25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A'
);

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  try {
    const user = await backendless.UserService.login(email, password, true);
    if (user.email === "ahmedaltalqani@gmail.com") {
      window.location.href = "admin.html";
    } else {
      localStorage.setItem("username", user.name || email);
      window.location.href = "flights.html";
    }
  } catch (err) {
    console.error("Login Error:", err);
    errorMsg.textContent = "فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.";
  }
};
