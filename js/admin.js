// js/admin.js

import Backendless from 'https://cdn.jsdelivr.net/npm/backendless/+esm';
import { exportFlightToWord } from './export-word.js';

const APP_ID = '86F15FBA-3175-47FF-A061-D7DEECE8F699';
const API_KEY = '25E5E83A-21C4-4F45-86AF-5E8AFB3AD17A';

Backendless.initApp(APP_ID, API_KEY);

// التحقق من دخول المشرف فقط
const currentUser = await Backendless.UserService.getCurrentUser();
if (!currentUser || currentUser.email !== "ahmedaltalqani@gmail.com") {
  alert("غير مصرح لك بالوصول");
  window.location.href = "index.html";
}

// تسجيل الخروج
document.getElementById("logoutBtn").onclick = async () => {
  await Backendless.UserService.logout();
  window.location.href = "index.html";
};

const flightsContainer = document.getElementById("all-flights");
const statsContainer = document.getElementById("flights-summary");
const userFilter = document.getElementById("userFilter");
const monthFilter = document.getElementById("monthFilter");

// تحميل جميع الرحلات وتطبيق الفلاتر
async function loadAllFlights() {
  try {
    const query = Backendless.DataQueryBuilder.create().setPageSize(100).setSortBy(["Date DESC"]);
    const flights = await Backendless.Data.of("flights").find(query);
    
    if (!flights.length) {
      flightsContainer.innerHTML = "<p>لا توجد رحلات مسجلة.</p>";
      return;
    }
    
    const counts = {};
    const uniqueUsers = new Set();
    const uniqueMonths = new Set();
    
    flightsContainer.innerHTML = "";
    statsContainer.innerHTML = "";
    
    flights.forEach(flight => {
      const name = flight["اسم المنسق"] || "غير معروف";
      const date = flight["Date"] || "";
      const month = date.slice(0, 7); // yyyy-mm
      
      // تحديث العدادات
      counts[name] = (counts[name] || 0) + 1;
      uniqueUsers.add(name);
      if (month) uniqueMonths.add(month);
      
      // التحقق من الفلاتر
      if (
        (userFilter.value && userFilter.value !== name) ||
        (monthFilter.value && monthFilter.value !== month)
      ) return;
      
      const card = document.createElement("div");
      card.className = "admin-flight-card";
      card.innerHTML = `
        <p><strong>FLT.NO:</strong> ${flight["FLT.NO"] || "-"}</p>
        <p><strong>Date:</strong> ${date || "-"}</p>
        <p><strong>اسم المنسق:</strong> ${name}</p>
        <p><strong>ملاحظات:</strong> ${flight["NOTES"] || "-"}</p>
        <button>📄 تصدير</button>
      `;
      card.querySelector("button").onclick = () => exportFlightToWord(flight);
      flightsContainer.appendChild(card);
    });
    
    // عرض إحصائية عدد الرحلات
    statsContainer.innerHTML = "<h3>عدد الرحلات لكل منسق:</h3>";
    Object.entries(counts).forEach(([user, count]) => {
      const stat = document.createElement("p");
      stat.textContent = `${user}: ${count} رحلة`;
      statsContainer.appendChild(stat);
    });
    
    // تعبئة الفلاتر إن لم تكن ممتلئة سابقًا
    if (userFilter.options.length === 1) {
      Array.from(uniqueUsers).sort().forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        userFilter.appendChild(option);
      });
    }
    
    if (monthFilter.options.length === 1) {
      Array.from(uniqueMonths).sort().forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
      });
    }
    
  } catch (err) {
    console.error("فشل تحميل الرحلات:", err);
    flightsContainer.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات.</p>";
  }
}

// إعادة تحميل عند تغيير الفلاتر
userFilter.onchange = loadAllFlights;
monthFilter.onchange = loadAllFlights;

loadAllFlights();
