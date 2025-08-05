import React, { useState, useEffect } from "react";
import '../components/styles/Dashboard.css';
import CashbookAccount from "../components/dashboard/CashbookAccount";
import { getBankAccounts } from "../_services/bankAccountServices";

const CashbooksDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const result = await getBankAccounts();
        setBankAccounts(result);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await getBankAccounts();
      setBankAccounts(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-main">
      <h2 className="page-title">Cashbooks</h2>

      {loading ? (
        <p>Loading accounts...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="stats-container">
          <h3><i>Select an account</i></h3>
          <div className="cashbook-accounts">
            {bankAccounts.length === 0 && (
                <p>No bank accounts available.</p>
            )}
            {bankAccounts.map(account => (
              <CashbookAccount
                accountId={account.accountId}
                key={account.accountKey}
                accountKey={account.accountKey}
                balance={account.balance || 0} 
                currency="ZMW"
                accountName={account.accountName}
                accountNumber={account.accountNumber}
                bankName={account.bankName || "N/A"} 
                branchName={account.branchName || "N/A"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashbooksDashboard;