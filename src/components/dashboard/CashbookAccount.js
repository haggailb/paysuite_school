import React from 'react';
import '../styles/Navbar.css';
import formatCurrency from "../../_utils/formatCurrency";
import { Link } from 'react-router-dom';

const CashbookAccount = ({ accountId, accountKey, balance, currency, accountName, accountNumber, bankName, branchName }) => {
  return (
    <div className="cashbook-card hoverable shadow bg-primary">
      <Link 
        to={`/cashbooks/${accountKey}`}
        state={{
          accountId,
          accountName,
          accountNumber,
          bankName,
          branchName,
          balance,
          currency
        }} 
        className='text-decoration-none'>
        <h4 className='text-white'>{accountName}</h4>
        <p>{accountNumber}</p>
        <p>{bankName} - {branchName}</p>
        {/* <h3>{formatCurrency(balance, currency, true)}</h3> */}
      </Link>
    </div>
  );
};

export default CashbookAccount;
