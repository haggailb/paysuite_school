
import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";

const printBillsList = (institution, filteredBills, filters, searchTerm, totalAmount, userName, dateTime) => {
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
          <p><strong>Property Rates Bills</strong></p>
          <p class="mt-2">Data Filter:</p>
          <p>
            <strong>
              Search: ${searchTerm || "none"} |
              Client ID: ${filters.clientId || "none"} |
              Land Use ID: ${filters.propertyTypeId || "none"} |
              Location ID: ${filters.locationId || "none"} |
              Period: ${filters.period === 1 ? "January - June" : "July - December"} |
              Year: ${filters.year || "none"}
            </strong>
          </p>
          <p>Date Printed: <strong>${dateTime}</strong></p>
        </div>

        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Stand No.</th>
              <th>Leaseholder</th>
              <th>Land Use</th>
              <th>Details</th>
              <th>B/F</th>
              <th>Bill</th>
              <th>Balance</th>
              <th>C/B</th>
            </tr>
          </thead>
          <tbody>
            ${filteredBills.map(bill => `
              <tr>
                <td>${bill.propertyNo}</td>
                <td>${bill.clientName}</td>
                <td>${bill.propertyTypeName}</td>
                <td>${bill.txnComment}</td>
                <td class="text-end">${formatCurrency(bill.broughtForward || 0, 'ZMW', false)}</td>
                <td class="text-end">${formatCurrency(bill.currentBill || 0, 'ZMW', false)}</td>
                <td class="text-end">${formatCurrency(bill.balanceAfterBilling || 0, 'ZMW', false)}</td>
                <td class="text-end">${formatCurrency(bill.closingBalance || 0, 'ZMW', false)}</td>
              </tr>`)
            .join("")}
          </tbody>
        </table>

        <div class="container text-end total-section">
          <table class="table table-bordered">
            <tfoot>
              <tr class="total-row">
                <td colspan="5" class="text-center">Total</td>
                <td>${formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
          <div class="footer mt-3">
            <p>Printed By: ${userName} on ${dateTime}</p>
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


export default printBillsList