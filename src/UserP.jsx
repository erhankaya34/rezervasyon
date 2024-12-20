import React, { useState } from "react";

function LoginPage({ onLogin, apiUrl }) {
  const [formData, setFormData] = useState({ username: "", password: ""});
  const [message, setMessage] = useState(""); // Geri bildirim mesajı
  const [messageType, setMessageType] = useState(""); // Mesaj tipi (success, error)

  // Form verilerini güncelle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl+"login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Giriş başarısız!");
      }

      // Başarılı giriş için mesaj ayarları
      setMessage(`Hoş geldiniz, ${result.name}!`);
      setMessageType("success");
      
      // Browser uyarısı
      alert(`Hoş geldiniz, ${result.name}!`);

      // Kullanıcı bilgilerini Main bileşenine gönder
      onLogin({ username: result.username, name: result.name });
    } catch (error) {
      // Hata durumunda mesaj ayarları
      setMessage(`Hata: ${error.message}`);
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Kullanıcı Girişi</h2>

        {/* Giriş Formu */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Giriş Yap
          </button>
        </form>

        {/* Geri Bildirim Mesajı */}
        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${messageType === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
