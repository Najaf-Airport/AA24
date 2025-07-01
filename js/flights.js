import Backendless from 'https://cdn.jsdelivr.net/npm/backendless/+esm';
import { exportFlightToWord } from './export-word.js'; // تصدير إلى Word

// إعدادات الاتصال بـ Backendless
const APP_ID = '86F15FBA-3175-47FF-A061-D7DEECE8F699';
const API_KEY = '25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A';

Backendless.initApp(APP_ID, API_KEY);

// التأكد من تسجيل الدخول
const currentUser = await Backendless.UserService.getCurrentUser();
if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً");
  window.location.href = "index.html";
}

const username = currentUser.username || currentUser.name || currentUser["اسم المنسق"] || "مستخدم";

document.getElementById("logoutBtn").onclick = async () => {
  await Backendless.UserService.logout();
  window.location.href = "index.html";
};

// تحميل الرحلات من Backendless
async function loadFlights() {
  const flightsContainer = document.getElementById("saved-flights");
  flightsContainer.innerHTML = "جاري تحميل الرحلات...";
  
  try {
    const query = Backendless.DataQueryBuilder.create()
      .setWhereClause(`ownerId = '${currentUser.objectId}'`)
      .setPageSize(100);
    const flights = await Backendless.Data.of("flights").find(query);
    
    if (!flights.length) {
      flightsContainer.innerHTML = "<p>لا توجد رحلات محفوظة.</p>";
      return;
    }
    
    flightsContainer.innerHTML = ""; // إفراغ الحاوية
    
    flights.forEach(flight => {
      const card = document.createElement("div");
      card.className = "flight-card";
      card.innerHTML = `
        <p><strong>FLT.NO:</strong> ${flight["FLT.NO"] || "-"}</p>
        <p><strong>Time on Chocks:</strong> ${flight["Time on Chocks"] || "-"}</p>
        <p><strong>Time open Door:</strong> ${flight["Time open Door"] || "-"}</p>
        <p><strong>Time Start Cleaning:</strong> ${flight["Time Start Cleaning"] || "-"}</p>
        <p><strong>Time complete cleaning:</strong> ${flight["Time complete cleaning"] || "-"}</p>
        <p><strong>Time ready boarding:</strong> ${flight["Time ready boarding"] || "-"}</p>
        <p><strong>Time start boarding:</strong> ${flight["Time start boarding"] || "-"}</p>
        <p><strong>Boarding Complete:</strong> ${flight["Boarding Complete"] || "-"}</p>
        <p><strong>Time Close Door:</strong> ${flight["Time Close Door"] || "-"}</p>
        <p><strong>Time off Chocks:</strong> ${flight["Time off Chocks"] || "-"}</p>
        <p><strong>NOTES:</strong> ${flight["NOTES"] || "-"}</p>
        <p><strong>اسم المنسق:</strong> ${flight["اسم المنسق"] || username}</p>
      `;
      
      const exportBtn = document.createElement("button");
      exportBtn.textContent = "📄 تصدير إلى Word";
      exportBtn.onclick = () => exportFlightToWord(flight);
      card.appendChild(exportBtn);
      
      flightsContainer.appendChild(card);
    });
    
  } catch (err) {
    console.error("خطأ في تحميل الرحلات:", err);
    flightsContainer.innerHTML = "<p>فشل في تحميل الرحلات.</p>";
  }
}

loadFlights();
