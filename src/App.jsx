import React, { useState } from "react";

function App({ userInfo , setUserInfo, appointments, setAppointments , selectedDate, setSelectedDate, apiUrl}) {
  const [selectedTime, setSelectedTime] = useState(null); // Seçili saat

  const dailyAvailableTimes = {
    // Haftaiçi (23-27 Aralık)
    "2024-12-23": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 23 Aralık
    "2024-12-24": [], // 24 Aralık - Gelibolu seyahati sebebiyle çekim yok
    "2024-12-25": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 25 Aralık
    "2024-12-26": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 26 Aralık
    "2024-12-27": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 27 Aralık
  
    // Haftasonu (28-29 Aralık)
    "2024-12-28": ["11:00-12:30", "12:30-14:00", "14:30-16:00", "16:00-17:30", "18:00-19:30", "19:30-21:00"], // 28 Aralık
    "2024-12-29": ["11:00-12:30", "12:30-14:00", "14:30-16:00", "16:00-17:30", "18:00-19:30", "19:30-21:00"], // 29 Aralık
  
    // Haftaiçi (30 Aralık-3 Ocak)
    "2024-12-30": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 30 Aralık
    "2024-12-31": [], // 31 Aralık - Yılbaşı sebebiyle çekim yok
    "2025-01-01": [], // 1 Ocak - Yılbaşı sebebiyle çekim yok
    "2025-01-02": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 2 Ocak
    "2025-01-03": ["17:00-18:30", "18:30-20:00", "20:30-22:00"], // 3 Ocak
  
    // Haftasonu (4-5 Ocak)
    "2025-01-04": ["11:00-12:30", "12:30-14:00", "14:30-16:00", "16:00-17:30", "18:00-19:30", "19:30-21:00"], // 4 Ocak
    "2025-01-05": ["11:00-12:30", "12:30-14:00", "14:30-16:00", "16:00-17:30", "18:00-19:30", "19:30-21:00"], // 5 Ocak
  
    default: ["10:00-12:00", "12:00-14:00", "15:00-17:00", "17:00-19:00", "19:00-21:00"], // Varsayılan saatler
  };
  
  // Musait olmayan günler
  const unavailableDates = [
    new Date(2024, 11, 24), // 24 Aralık - Gelibolu seyahati
    new Date(2024, 11, 31), // 31 Aralık - Yılbaşı
    new Date(2025, 0, 1),
    new Date(2025, 0, 6),   // 1 Ocak - Yılbaşı
  ];
  

const confirmAppointment = async () => {
    if (!selectedTime) {
      alert("Lütfen bir saat seçin!");
      return;
    }

    // Kullanıcı bilgilerini doğrula
    if (!userInfo.username) {
      alert("Lütfen geçerli bir kullanıcı girin!");
      return;
    }

    const formattedDate = new Date(selectedDate).toLocaleDateString("tr-TR");
    const newAppointment = {
      ...userInfo,
      date: formattedDate,
      time: selectedTime,
    };

    try {
      const response = await fetch(apiUrl+"add_appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });

      // Hata durumunda yanıtı kontrol et
      if (!response.ok) {
        // Yanıtın JSON içeriğini alın ve hata mesajını oluşturun
        const errorData = await response.json();
        throw new Error(errorData.error || "Bir hata oluştu.");
      }

      // Başarılı yanıt durumunda randevuyu ekle
      const result = await response.json();
      setAppointments([...appointments, result.appointment]);
      alert("Randevunuz başarıyla oluşturuldu!");
      setSelectedTime(null);
    } catch (error) {
      // Hata mesajını al
      alert(`Hata: ${error.message}`);
    }    
  };


  // Ay geçişi işlemi
  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(newDate); // State güncellemesi yapılırken doğru tarih gönderilsin
  };

  // Takvim günlerini oluşturma
  const generateCalendarDays = () => {
    const days = [];
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
    const startDay = startOfMonth.getDay();
    for (let i = 0; i < startDay; i++) {
      const prevDay = new Date(startOfMonth);
      prevDay.setDate(prevDay.getDate() - (startDay - i));
      prevDay.setHours(0, 0, 0, 0); // Saat diliminden bağımsız, 00:00'ı kullan
      days.push({ day: prevDay, disabled: true });
    }
  
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const day = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      day.setHours(0, 0, 0, 0); // Saat diliminden bağımsız, 00:00'ı kullan
      days.push({ day, disabled: false });
    }
  
    const endDay = endOfMonth.getDay();
    for (let i = endDay + 1; i <= 6; i++) {
      const nextDay = new Date(endOfMonth);
      nextDay.setDate(nextDay.getDate() + (i - endDay));
      nextDay.setHours(0, 0, 0, 0); // Saat diliminden bağımsız, 00:00'ı kullan
      days.push({ day: nextDay, disabled: true });
    }
  
    return days;
  };  


  const calendarDays = generateCalendarDays();

  // Haftanın günleri
  const weekDays = ["Pzr", "Pzt", "Sal", "Çarş", "Perş", "Cum", "Cmt"];

  // Ay ve Yıl Başlığını Düzenleme
  const monthYear = selectedDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  // Musait olmayan günleri kontrol et
  // Musait olmayan günleri kontrol et
  const isUnavailableDate = (day) => {
    return (
      day &&
      (unavailableDates.some(
        (unavailableDate) => unavailableDate.toDateString() === day.toDateString()
      ) || 
      // 23 Aralık öncesi ve 6 Ocak sonrası günleri kapalı yap
      (day < new Date(2024, 11, 23) || day > new Date(2025, 0, 6))
      )
    );
  };


  // Seçilen güne uygun saatler
  const getAvailableTimesForSelectedDate = () => {
    // Seçili tarihi doğru formatta al
    const formattedDate = selectedDate.toLocaleDateString("tr-TR", { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.').reverse().join('-');
    return dailyAvailableTimes[formattedDate] || dailyAvailableTimes.default;
  };

  const availableTimes = getAvailableTimesForSelectedDate();

  const isTimeAvailable = (time) => {
    // Seçilen tarihe ait, belirli bir saatte zaten alınmış bir randevu olup olmadığını kontrol et
    const formattedDate = selectedDate.toLocaleDateString("tr-TR");
    return !appointments.some(
      (appointment) => appointment.date === formattedDate && appointment.time === time
    );
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 bg-white/90">
      <h1 className="text-2xl font-bold text-center mb-6">Rezervasyon Sistemi</h1>
      <h2 className="text-lg text-center mb-6" style={{ fontFamily: 'Inter', fontWeight: 'bold', fontStyle: 'normal' }}>
        {userInfo.name}
      </h2>
  
      {/* Takvim ve Saat Seçimi Alanı */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 bg-white/50">
        {/* Gün seçimi */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6">
          {/* Ay Önceki Butonu */}
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-l shadow-md mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          >
            {"<"} Önceki Ay
          </button>
  
          {/* Seçili Ay ve Yıl */}
          <h2 className="px-5 mx-5 text-lg font-semibold text-blue-500 bg-blue-200 p-2 rounded shadow-lg w-full sm:w-auto text-center">
            {monthYear}
          </h2>
  
          {/* Ay Sonraki Butonu */}
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-r shadow-md mb-2 sm:mb-0 sm:ml-2 w-full sm:w-auto"
          >
            Sonraki Ay {">"}
          </button>
        </div>
  
        {/* Haftanın Günleri Başlıkları */}
        <div className="grid grid-cols-7 gap-2 mb-6 text-center text-sm font-semibold">
          {weekDays.map((day, index) => (
            <div key={index} className="text-gray-700 w-full min-w-[50px] sm:w-auto">
              {day}
            </div>
          ))}
        </div>
  
        {/* Takvim Günleri */}
        <div className="grid grid-cols-7 gap-2 mb-6 justify-center">
          {calendarDays.map(({ day, disabled }, index) => (
            <button
              key={index}
              onClick={() => !disabled && day && !isUnavailableDate(day) && setSelectedDate(day)}
              className={`px-4 py-2 rounded-lg border border-gray-300 text-center ${
                day && day.toDateString() === selectedDate.toDateString()
                  ? "bg-blue-500 text-white"
                  : "bg-white-100 hover:bg-gray-200"
              } ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed text-gray-300 hover:bg-gray-100 border-gray-100"
                  : isUnavailableDate(day)
                  ? "bg-gray-200 cursor-not-allowed text-gray-500 "
                  : ""
              } w-full sm:w-auto`}
              disabled={disabled || isUnavailableDate(day)}
            >
              {day ? day.getDate() : ""}
            </button>
          ))}
        </div>
  
        {/* Saat Seçimi */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 w-full sm:w-auto">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-4 py-2 rounded border text-sm font-medium ${
                selectedTime === time
                  ? "bg-green-500 text-white"
                  : isTimeAvailable(time)
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-red-500 text-white cursor-not-allowed"
              } w-full sm:w-auto`}
              disabled={!isTimeAvailable(time)}  // Zaten alınmışsa tıklanamaz
            >
              {time}
            </button>
          ))}
        </div>
  
        {/* Randevu onaylama */}
        <div className="text-center">
          <button
            onClick={confirmAppointment}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Randevuyu Onayla
          </button>
          <div className="text-center mt-4">
      <h1 className="text-xl mb-1">Çekim Lokasyonu</h1>
            <p className="text-sm text-gray-500">
              BAU Galata Kampüsü <br />
              Müeyyetzade Mahallesi, Kemeraltı Caddesi, <br />
              Karaoğlan Sokağı No: 24/A <br />
              34425 Galata, Karaköy, Beyoğlu, İstanbul
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  

}

export default App;
