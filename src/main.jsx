import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./UserP";
import Appointments from "./Appointmens";
import "./index.css"; // Tailwind CSS burada ekleniyor

// Ana bileşen
function Main() {
  const [userInfo, setUserInfo] = useState(null); // Başlangıçta null olarak ayarla
  const [appointments, setAppointments] = useState([]); // Randevular listesi
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 4)); // Seçili gün
  const apiUrl = "https://api.chikitabot.net:58731/erhankaya/"; // API URL'si

  const handleLogin = (user) => {
    setUserInfo(user); // Kullanıcı giriş yaparsa, kullanıcı bilgilerini güncelle
  };

  return (
    <React.StrictMode>
      {/* Kullanıcı girişi varsa App ve Appointments, yoksa LoginPage göster */}
      {userInfo ? ( // userInfo null değilse, yani giriş yapılmışsa
        <>
          <App
            userInfo={userInfo}
            setUser={setUserInfo}
            appointments={appointments}
            setAppointments={setAppointments}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            apiUrl={apiUrl}
          />
          <Appointments
            userInfo={userInfo}
            setUser={setUserInfo}
            appointments={appointments}
            setAppointments={setAppointments}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            apiUrl={apiUrl}
          />
        </>
      ) : (
        <LoginPage onLogin={handleLogin} apiUrl={apiUrl} /> // Giriş yapılmamışsa LoginPage göster
      )}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
