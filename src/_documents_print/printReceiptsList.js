
import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";
import formatDate from "../_utils/formatDate";

const printReceiptsList = (institution, receipts, filters, totalAmount, userName, dateTime) => {
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
      <title>${institution.name} Property Rates Bills for ${filters.period + '-' + filters.year}</title>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      />
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 20px; }
        img { max-height: 80px; margin-bottom: 10px; }
        h4, p { margin: 0; }
        .table th, .table td { padding: 5px; vertical-align: middle; }
        .table thead th { background-color: #000; color: #fff; }
        tfoot th { background-color: #000; color: #fff; }
        .total-row th, .total-row td { font-weight: bold; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="text-center mb-3">
          <h4>REPUBLIC OF ZAMBIA</h4>
          <img src="${institution.logo}" alt="Institution Logo" />
          <h4>${institution.name}</h4>
          <p>${institution.address}</p>
          <p><strong>RECEIPTS</strong></p>
          <p class="mt-2">Data Filters:</p>
          <p>
            <strong>Account Code:</strong> ${filters.coaCode || "none"} |
            <strong>User Name:</strong> ${filters.userName || "none"} |
            <strong>Start Date:</strong> ${formatDate(filters.startDate, 'short') || "none"} |
            <strong>End Date:</strong> ${formatDate(filters.endDate, 'short') || "none"}
          </p>
          <p>Date Printed: <strong>${dateTime}</strong></p>
        </div>

        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>TXN ID.</th>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Details</th>
              <th>C.O.A</th>
              <th>Due</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            ${receipts.map(receipt => `
              <tr>
                <td>${receipt.txn}</td>
                <td>${receipt.receiptNo}</td>
                <td>${formatDate(receipt.txnDate, 'short')}</td>
                <td>${receipt.txnComment}</td>
                <td>${receipt.coaCode} - ${receipt.coaName}</td>
                <td class="text-end">${formatCurrency(receipt.amountDue || 0, 'ZMW', true)}</td>
                <td class="text-end">${formatCurrency(receipt.txnAmount || 0, 'ZMW', true)}</td>
                <td class="text-end">${formatCurrency(receipt.balance || 0, 'ZMW', true)}</td>
                <td>${receipt.accountName}</td>
              </tr>`)
            .join("")}
          </tbody>
        </table>

        <div class="container text-end total-section">
          <table class="table table-bordered">
            <tfoot>
              <tr class="total-row">
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>${formatCurrency(totalAmount)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <div class="footer mt-3">
            <div class="d-flex"> 
              <div class="col-6 text-center">
                <p class="footer-note my-0">Printed by ${userName} on ${dateTime}</p>
              </div>
              <div class="col-6 text-end">
                <p class="footer-note my-0"><i>Powered by PaySuite Financial Systems</i></p>
              </div>
            </div>
          </div>
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


export default printReceiptsList