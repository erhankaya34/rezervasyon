import React, { useEffect, useState } from 'react';

function Appointments({ userInfo, appointments, setAppointments, selectedDate, apiUrl}) {
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(apiUrl+'appointments'); // API URL'si
      if (!response.ok) {
        throw new Error('Randevular alınamadı!');
      }
      const data = await response.json();
      if (Array.isArray(data.appointments)) {
        setAppointments(data.appointments); // Randevuları ayarla
      } else {
        console.error('API yanıtı geçersiz: ', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (appointment) => {
    try {
      const response = await fetch(apiUrl+'delete_appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: appointment.username,
          date: appointment.date,
          time: appointment.time,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Randevu silinemedi!');
      }

      const result = await response.json();
      console.log(result.message);

      // Başarılı bir şekilde silindiyse, state'den kaldır
      setAppointments((prev) =>
        prev.filter(
          (item) =>
            item.username !== appointment.username ||
            item.date !== appointment.date ||
            item.time !== appointment.time
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleDownload = async () => {
    try {
      const response = await fetch(apiUrl+'export_appointments');
      if (!response.ok) {
        throw new Error('Randevular indirilemedi!');
      }
      
      // Dosyayı indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointments.xlsx'); // Dosya adı
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogDownload = async () => {
    try {
      const response = await fetch(apiUrl + 'export_logs');
      if (!response.ok) {
        throw new Error('Log dosyası indirilemedi!');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointments_logs.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userInfo.username]);

  const formattedDate = selectedDate.toLocaleDateString('tr-TR');
  const filteredAppointments = appointments.filter((appointment) => {
    if (userInfo.username === 'tesseractadmin' && showAllAppointments) {
      // Tüm randevuları göster
      return true;
    }
    if (userInfo.username === 'tesseractadmin') {
      // tesseractadmin ve seçili tarihteki randevuları göster
      return appointment.date === formattedDate;
    }
    // Kullanıcıya ait randevuları göster
    return appointment.username === userInfo.username
  });
  return (
    <div className="p-6 font-sans max-w-4xl mx-auto p-6 bg-white border border-gray-200 bg-white/90">
      <h1 className="text-2xl font-bold text-center mb-6">
        {userInfo.username === 'tesseractadmin' ? 'Tüm Randevular' : 'Randevularınız'}
      </h1>
      {userInfo.username === 'tesseractadmin' && (
        <div className="text-center mb-4">
          <button
            className={`px-6 py-3 rounded ${
              showAllAppointments ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'
            } hover:bg-blue-700 hover:text-white transition-all duration-200`}
            onClick={() => setShowAllAppointments((prev) => !prev)}
          >
            {showAllAppointments ? 'Seçili Tarihe Dön' : 'Tüm Randevuları Göster'}
          </button>
        </div>
      )}
      {userInfo.username === 'tesseractadmin' && (
        <>
          <div className="text-center mb-4">
            <button
              className="px-6 py-3 rounded bg-green-500 text-white hover:bg-green-700 transition-all duration-200"
              onClick={handleDownload}
            >
              Randevuları İndir
            </button>
          </div>
          <div className="text-center mb-4">
            <button
              className="px-6 py-3 rounded bg-yellow-500 text-white hover:bg-yellow-700 transition-all duration-200"
              onClick={handleLogDownload}
            >
              Logları İndir
            </button>
          </div>
        </>
      )}
      <div className="mt-8 mx-auto max-w-full sm:max-w-md">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-600 text-center">
            {showAllAppointments
              ? 'Hiç randevu bulunamadı.'
              : 'Seçilen tarihte randevu bulunamadı.'}
          </p>
        ) : (
          <ul className="list-none space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <li
                key={index}
                className="bg-white/30 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start items-center sm:space-x-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{appointment.date}</h2>
                    <p className="text-sm text-gray-800">{appointment.time}</p>
                  </div>
                  <div
                    className="text-md font-bold text-gray-800 mt-2 sm:mt-0"
                    style={{ fontFamily: 'Inter', fontWeight: 'bold', fontStyle: 'normal' }}
                  >
                    {appointment.name}
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm mt-2 sm:mt-0 hover:bg-red-700 transition-all duration-200"
                    onClick={() => handleDelete(appointment)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default Appointments;
