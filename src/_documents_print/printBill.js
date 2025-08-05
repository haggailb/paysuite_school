
import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";

const printBills = (institution, filteredBills, defaultAccount, date, dateTime, userName) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Individual Bills - ${institution?.name || "Institution"}</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossorigin="anonymous"
      />
      <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
      <style>
        @page { margin: 0; }
        @media print { body { margin: 0; padding: 0; } 
          .bill-page { page-break-after: always; width: auto; min-height: 100%; padding: 5mm 10mm; box-sizing: border-box; }
        }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; margin: 0; padding: 0; }
        .bill-page { margin: 0 auto; }
        .header { text-align: center; margin-bottom: 5px; }
        .header img { max-height: 60px; margin-bottom: 5px; }
        .meta p { margin: 2px 0; }
        .bill-table { min-width: 100%; margin-top: 10px; }
        .bill-table td { padding: 0; border-bottom: 1px solid #ccc; }
        .bank-details td { padding: 0px 10px; border-bottom: 1px solid #ccc;}
        .bill-table .text-end { text-align: right; }
        .footer-note {font-size: 12px; margin: 0px; text-align: right; }
      </style>
    </head>
    <body>
      ${filteredBills.map(bill => `
        <div class="bill-page">
          <div class="header">
            <h5>REPUBLIC OF ZAMBIA</h5>
            ${institution.logo ? `<img src="${institution.logo}" alt="logo" />` : ""}
            <h6 class="my-0">${institution?.name || ""}</h6>
            <h6 class="my-0">PROPERTY RATES BILL</h6>
          </div>
          <div class="meta row">
            <div class="client-details col-5 mx-0 px-1">
              <p><strong>Property No: ${bill.propertyNo || "N/A"}</strong></p>
              <p><strong>Client Name:</strong>${bill.clientName || "N/A"}</p>
              <p><strong>Description: </strong>${bill.description || "N/A"}</p>
              <p><strong>House Number :</strong> ${bill.houseNumber || "Unknown House No."}</p>
              <p><strong>Location / Contact :</strong> ${bill.locationName || "Unknown"},  ${formatMobileNumber(bill.mobileNumber)}</p>
            </div>
            <div class="property-details col-5 mx-0 px-1">
              <p><strong>Land Extent (Ha): </strong>${bill.land_extent || "N/A"}</p>
              <p><strong>Land Value: </strong> ${formatCurrency(bill.land_value || 0, 'ZMW', true)}</p>
              <p><strong>Improvements: </strong> ${formatCurrency(bill.improvement_value || 0, 'ZMW', true)} <strong>P & M</strong> ${formatCurrency(bill.pandm || 0, 'ZMW', true)}</p>
              <p><strong>Total Ratable Value: </strong> ${formatCurrency(bill.trv || 0, 'ZMW', true)}</p>
              <p><strong>Rate Used: </strong> ${bill.propertyTypePoundage}</p>
            </div>
            <div class="property-details col-2 mx-0 px-1">
              <div id="qrcode-${bill.propertyId}"></div>
              <p class="p-0 m-0">View Statement</p>
            </div>
          </div>
          <hr class="my-0" />
          <h6 class="my-0 text-center">Billing Summary</h6>
          <table class="bill-table">
            <tbody>
              <tr><td><strong>Details</strong></td><td class="text-end">${bill.txnComment || "Property Rates Invoice"}</td></tr>
              <tr><td><strong>Brought Forward</strong></td><td class="text-end">${formatCurrency(bill.broughtForward || 0, 'ZMW', true)}</td></tr>
              <tr><td><strong>Amount Billed</strong></td><td class="text-end">${formatCurrency(bill.currentBill || 0, 'ZMW', true)}</td></tr>
              <tr><td><strong>Balance After Billing</strong></td><td class="text-end">${formatCurrency(bill.balanceAfterBilling || 0, 'ZMW', true)}</td></tr>
              <tr><td><strong>Closing Balance as at ${date}</strong></td><td class="text-end">${formatCurrency(bill.closingBalance || 0, 'ZMW', true)}</td></tr>
            </tbody>
          </table>
          <p class="my-1">You are advised to pay the above Closing Balance of <strong>${formatCurrency(bill.closingBalance || 0, 'ZMW', true)}</strong> in the following bank details to avoid any inconveniences.</p>
          <table class="bank-details">
            <tbody>
              <tr><td><strong>Bank Name</strong></td><td>${defaultAccount.bankName}</td><td><strong>Branch</strong></td><td>${defaultAccount.branchName}</td></tr>
              <tr><td><strong>Sort Code</strong></td><td>${defaultAccount.sortCode}</td><td><strong>Swift Code</strong></td><td>${defaultAccount.swiftCode}</td></tr>
              <tr><td><strong>Account Name</strong></td><td>${defaultAccount.accountName}</td><td><strong>Account Number</strong></td><td>${defaultAccount.accountNumber}</td></tr>
              <tr><td><strong>Reference</strong></td><td>Property rates for ${bill.propertyNo}</td></tr>
            </tbody>
          </table>
          <p class="footer-note">Printed by ${userName || "System"} on ${dateTime}.: <i>Powered by PaySuite Financial Systems</i></p>
        </div>
        
      `).join("")}
    </body>
    </html>
  `);
  doc.close();

  iframe.onload = function () {
    const win = iframe.contentWindow;
    const QRCode = win.QRCode;
    filteredBills.forEach(bill => {
      const qrDivId = `qrcode-${bill.propertyId}`;
      const qrDiv = win.document.getElementById(qrDivId);
      if (qrDiv && QRCode) {
        new QRCode(qrDiv, {
          text: `https://paysuite.netlify.app/property-statement/${bill.propertyId}`,
          width: 100,
          height: 100
        });
      }
    });

    win.focus();
    win.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};

export default printBills