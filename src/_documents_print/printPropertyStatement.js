import formatCurrency from "../_utils/formatCurrency";
import formatDate from "../_utils/formatDate";
import formatMobileNumber from "../_utils/formatMobileNumber";

const printPropertyStatement = (institution, defaultAccount, transactions, propertyDetails, date, dateTime, userName) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  let totalBills = 0;
  let totalReceipts = 0;
  let other = 0;
  let closing = 0;

  let transactionRows = "";
  let footerRow = "";

  if (transactions.length === 0) {
    transactionRows = `
      <tr><td colspan="6" class="text-center text-danger">No transactions found</td></tr>
    `;
    footerRow = `
      <tr><td colspan="6" class="text-center text-danger"></td></tr>
    `;
  } else {
    transactions.forEach(txn => {
      if (txn.type === 'Bill') {
        totalBills += txn.txnAmount || 0;
      } else if (txn.type === 'Receipt') {
        totalReceipts += txn.txnAmount || 0;
      } else {
        other += txn.txnAmount || 0;
      }
      closing = txn.balance;

      transactionRows += `
        <tr>
          <td>${txn.txn}</td>
          <td>${formatDate(txn.txnDate, 'long')}</td>
          <td>${txn.txnComment || ''}</td>
          ${
            txn.type === 'Bill' ? `
              <td class="text-end">${formatCurrency(txn.txnAmount || 0, 'ZMW', true)}</td>
              <td></td>
              <td class="text-end">${formatCurrency(txn.balance || 0, 'ZMW', true)}</td>
            ` : txn.type === 'Receipt' ? `
              <td></td>
              <td class="text-end">${formatCurrency(txn.txnAmount || 0, 'ZMW', true)}</td>
              <td class="text-end">${formatCurrency(txn.balance || 0, 'ZMW', true)}</td>
            ` : `
              <td></td><td></td><td class="text-end">${formatCurrency(txn.balance || 0, 'ZMW', true)}</td>
            `
          }
        </tr>
      `;
    });
    footerRow += `
      <tr>
        <td colspan="3"> Total</td>
        <td class="text-end">${formatCurrency(totalBills || 0, 'ZMW', true)}</td>
        <td class="text-end">${formatCurrency(totalReceipts || 0, 'ZMW', true)}</td>
        <td class="text-end">${formatCurrency(closing || 0, 'ZMW', true)}</td>
      </tr>
    `;
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Transactions - ${institution?.name || "Institution"}</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossorigin="anonymous"
      />
      <style>
        @page { margin: 0; }
        @media print {
          body { margin: 0; padding: 0; }
          .print-page { page-break-after: always; padding: 15mm; box-sizing: border-box; }
        }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; }
        .header { text-align: center; margin-bottom: 15px; }
        .header img { max-height: 60px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: left; }
        .text-end { text-align: right; }
        .footer-note { margin-top: 20px; text-align: right; font-size: 11px; }
        .meta p { margin: 2px 0; }
        .bank-details td { padding: 0; border: 0 solid #ccc; }
        .bank-details td { border-bottom: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <div class="print-page">
        <div class="header">
          <h5>REPUBLIC OF ZAMBIA</h5>
          ${institution.logo ? `<img src="${institution.logo}" alt="logo" />` : ""}
          <h6>${institution?.name || ""}</h6>
          <p>${institution?.address || ""}</p>
          <h6 class="mt-2">PROPERTY RATES STATEMENT</h6>
        </div>
        <div class="meta d-flex">
          <div class="col-6"> 
            <h7>Property Details</h7>
            <p><strong>Client Name:</strong> ${propertyDetails?.firstName || "N/A"} ${propertyDetails?.lastName || "N/A"}</p>
            <p><strong>Property No.:</strong> ${propertyDetails?.propertyNo || "N/A"}</p>
            <p><strong>Land Use:</strong> ${propertyDetails?.propertyTypeName || "N/A"}</p>
            <p><strong>House Number:</strong> ${propertyDetails?.houseNumber || "Unknown House No."}</p>
            <p><strong>Location:</strong> ${propertyDetails?.locationName || "Unknown"},  ${propertyDetails?.street}</p>
            <p><strong>Contact:</strong> ${formatMobileNumber(propertyDetails?.mobileNumber) || "Unknown Mobile Number"},  ${propertyDetails?.email || "Unknown Email"}</p>
          </div>
          <div class="col-6"> 
            <h7>Valuation Details</h7>
            <p><strong>Land Extent ( Hactres ):</strong> ${propertyDetails?.land_extent} </p>
            <p><strong>Value of land:</strong> ${formatCurrency(propertyDetails?.land_value || 0, 'ZMW', true)} </p>
            <p><strong>Value of Improvements:</strong> ${formatCurrency(propertyDetails?.improvement_value || 0, 'ZMW', true)} </p>
            <p><strong>Plant and Machinery:</strong> ${formatCurrency(propertyDetails?.pandm || 0, 'ZMW', true)} </p>
            <p><strong>Total Rateable Value:</strong> ${formatCurrency(propertyDetails?.trv || 0, 'ZMW', true)} </p>
            <p><strong>Poundage:</strong> ${propertyDetails?.propertyTypePoundage} </p>
          </div>
        </div>
          <h6 class="mt-3">TRANSACTION SUMMARY</h6>
        <table>
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>Date</th>
              <th>Details</th>
              <th>Bill</th>
              <th>Receipt</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows}
          </tbody>
          <tfoot>
            ${footerRow}
          </tfoot>
        </table>
          <p class="mb-1">You are advised to pay the above Closing Balance to avoid any inconveniences.</p>
          <p class="mb-1">Use the following bank details to make the payment at any Branch or Agent:</p>
          <table class="bank-details">
            <tbody>
              <tr><td><strong>Bank Name</strong></td><td>${defaultAccount.bankName}</td></tr>
              <tr><td><strong>Branch Name</strong></td><td>${defaultAccount.branchName}</td></tr>
              <tr><td><strong>Account Name</strong></td><td>${defaultAccount.accountName}</td></tr>
              <tr><td><strong>Account Number</strong></td><td>${defaultAccount.accountNumber}</td></tr>
              <tr><td><strong>Sort Code</strong></td><td>${defaultAccount.sortCode}</td></tr>
              <tr><td><strong>Swift Code</strong></td><td>${defaultAccount.swiftCode}</td></tr>
              <tr><td><strong>Payment Reference</strong></td><td>Property rates for ${propertyDetails?.propertyNo}</td></tr>
            </tbody>
          </table>

        <p class="footer-note mb-1">Printed by ${userName || "System"} on ${dateTime}</p>
        <p class="footer-note mt-0"><i>Powered by PaySuite Financial Systems</i></p>
      </div>
    </body>
    </html>
  `);
  doc.close();

  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};

export default printPropertyStatement;
