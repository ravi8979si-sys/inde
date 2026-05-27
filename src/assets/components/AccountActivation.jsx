import React, { useState, useEffect } from "react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import qr from "./qr.jpeg";

const AccountActivation = ({ onClose }) => {
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState(null);

  // 🔥 Disable background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async () => {
    if (!utr || !screenshot) {
      alert("Please enter UTR and upload screenshot");
      return;
    }

    const session =
      JSON.parse(localStorage.getItem("session")) ||
      JSON.parse(sessionStorage.getItem("session"));

    const formData = new FormData();
    formData.append("userId", session?._id);
    formData.append("username", session?.username);
    formData.append("utr", utr);
    formData.append("screenshot", screenshot);

    const BASE_URL = "https://inde-hpbc.onrender.com";

    try {
      const res = await fetch(`${BASE_URL}/api/activation`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        alert("Server error. Check backend logs.");
        return;
      }

      if (res.ok) {
        setStatus("pending");
        alert("Activation request submitted successfully ✅");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Activation Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#eef4ff] rounded-3xl w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto p-6 text-center">

        <h2 className="text-xl font-bold text-blue-600 mb-1">
          Account Activation
        </h2>

        <p className="text-blue-500 font-semibold mb-4">
          Activation Deposit – ₹3000
        </p>

     {/* QR */}
<div className="relative w-56 h-56 mx-auto mb-3 border-2 border-blue-400 rounded-xl flex items-center justify-center bg-white">

  {/* QR Image */}
  <img
    src={qr}
    alt="UPI QR Code"
    className="w-52 h-52 object-contain opacity-60"
  />

  {/* Cross Overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute w-full h-1 bg-red-600 rotate-45"></div>
    <div className="absolute w-full h-1 bg-red-600 -rotate-45"></div>
  </div>

</div>

{/* QR Notice Line */}
<p className="text-xs text-red-600 font-medium mb-4">
  Ask your agent for security deposit. Working QR code giving soon.
</p>

        {/* Bank Details */}
        {/* <div className="bg-white rounded-xl p-4 shadow-md text-left text-sm mb-4 border border-blue-200">
          <h3 className="text-blue-600 font-semibold mb-2 text-center">
            Bank Account Details
          </h3>

          <p><span className="font-medium">Bank Name:</span> Indian Bank</p>
          <p><span className="font-medium">Holder Name:</span> Himanshu Baranwal</p>
          <p><span className="font-medium">Account No:</span> 8177852207</p>
          <p><span className="font-medium">IFSC Code:</span> IDIB000L558</p>
          <p><span className="font-medium">Account Type:</span> Saving</p>
        </div> */}

        <p className="text-xs text-gray-600 mb-4">
          ⚠️ Note: APK will be provided after deposit confirmation.
        </p>

        {/* UTR */}
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          UPI Transaction ID
        </label>
        <input
          type="text"
          placeholder="UTR ID"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Screenshot */}
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          Share Transaction Proof
        </label>
        <input
          type="file"
          onChange={(e) => setScreenshot(e.target.files[0])}
          className="w-full border border-gray-300 p-2 rounded-lg mb-4 bg-white"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition"
        >
          Verify Deposit
        </button>

        {/* Status */}
        {status === "pending" && (
          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded-xl text-sm">
            <p className="font-semibold">Deposit Request Sent ✅</p>
            <p>Status: <span className="font-bold">Pending</span></p>
            <p>It will be approved within 48 hours.</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-5 bg-white rounded-xl p-4 shadow-inner">
          <h3 className="font-semibold text-blue-600 mb-2">
            Need Help?
          </h3>

          <a
            href="https://t.me/indepayofficials"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-blue-500 hover:underline mb-2"
          >
            <FaTelegramPlane />
            Telegram: @indepayofficials
          </a>

          <a
            href="https://wa.me/+18076956565?text="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-green-600 hover:underline"
          >
            <FaWhatsapp />
            WhatsApp: +18076956565
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default AccountActivation;