import React, { useState, useEffect, useCallback } from "react";
import { MdCreditCard } from "react-icons/md";
import { IoRefresh } from "react-icons/io5";
import PullToRefresh from "react-simple-pull-to-refresh";

const BANKS = [
  "HDFC Bank",
  "SBI Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
];

const randomFrom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1));

const maskAccount = () =>
  `A/c ************${randBetween(1000, 9999)}`;

const formatTime = (d) =>
  d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const generateDeposit = () => {
  const date = new Date();

  // ✅ Minimum 3000
  let amount = randBetween(30, 100) * 100;

  // Extra safety check (double protection)
  if (amount < 3000) {
    amount = 3000;
  }

  return {
    id: `${Date.now()}-${randBetween(0, 9999)}`,
    timeText: formatTime(date),
    amount,
    bank: randomFrom(BANKS),
    acct: maskAccount(),
  };
};



export default function DepositHistory({
  visibleCount = 6,
  onNewDeposit,
}) {
  const [deposits, setDeposits] = useState(() =>
    Array.from({ length: visibleCount }).map(generateDeposit)
  );
  const [loading, setLoading] = useState(false);

  const handlePull = useCallback(async () => {
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    const newDep = generateDeposit();

    setDeposits((prev) => [
      newDep,
      ...prev.slice(0, visibleCount - 1),
    ]);

    if (onNewDeposit) {
      onNewDeposit(Number(newDep.amount));
    }

    setLoading(false);
  }, [visibleCount, onNewDeposit]);

  useEffect(() => {
    const interval = setInterval(handlePull, 3000);
    return () => clearInterval(interval);
  }, [handlePull]);

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-semibold">
        <div className="flex items-center gap-2">
          <span>Live Deposits</span>
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
        </div>

        <button
          onClick={handlePull}
          className={`p-2 rounded-full hover:bg-white/20 transition ${
            loading ? "animate-spin" : ""
          }`}
        >
          <IoRefresh size={20} />
        </button>
      </div>

      {/* Scroll Area */}
      <PullToRefresh onRefresh={handlePull}>
        <div className="max-h-[60vh] overflow-y-auto">
          {deposits.map((d, i) => (
            <div
              key={d.id + i}
              className="h-16 flex items-center px-4 border-b last:border-b-0"
            >
              <div className="w-10 flex-shrink-0 text-[#6a11cb]">
                <MdCreditCard size={26} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {d.bank} •{" "}
                  <span className="font-normal text-gray-600">
                    {d.acct}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  {d.timeText}
                </div>

                <div className="text-sm text-gray-700 mt-1">
                  ₹{d.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PullToRefresh>

      {loading && (
        <div className="p-2 text-center text-xs text-gray-500 animate-pulse">
          Generating new deposit...
        </div>
      )}
    </div>
  );
}
