// js/login.js
import backendless from 'https://cdn.jsdelivr.net/npm/backendless@7.0.5/+esm';

// تهيئة الاتصال بـ Backendless
backendless.initApp(
  '86F15FBA-3175-47FF-A061-D7DEECE8F699',
  '25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A'
);

// عند الضغط على زر الدخول
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
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
    errorMsg.innerText = "فشل تسجيل الدخول: " + err.message;
  }
});