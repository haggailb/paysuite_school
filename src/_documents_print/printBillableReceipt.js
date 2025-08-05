
import formatCurrency from "../_utils/formatCurrency";
import formatDate from "../_utils/formatDate";
import formatMobileNumber from "../_utils/formatMobileNumber";
import { getCurrentDate } from "../_utils/formatCurrentDate";

const printBillableReceipt = (receipt, property = null, institution) => {
  const currentDate = getCurrentDate('long');
  const currentTime = getCurrentDate('timeShort');
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

  let transactionRows = "";
  let footerRow = "";

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Single Item Receipt Number ${receipt.receiptNo}</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossorigin="anonymous"
      />
      <style>
        @page { margin: 0; }
        @media print {
          body { margin: 0; padding: 0; }
          .print-page { page-break-after: always; margin: 10mm; padding: 3mm; box-sizing: border-box; border: 1px solid grey}
        }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; }
        .header { text-align: center; margin-bottom: 15px; }
        .header img { max-height: 70px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: left; }
        .text-end { text-align: right; }
        .footer-note { margin-top: 20px; text-align: right; font-size: 11px; }
        .meta p { margin: 2px 0; }
        .bank-details td { padding: 0; border: 0 solid #ccc; }
        .bank-details td { border-bottom: 1px solid #ccc; }
        .client-details p {border-bottom: 1px solid grey}
      </style>
    </head>
    <body>
      <div class="print-page">
        <div class="header">
          <h5>REPUBLIC OF ZAMBIA</h5>
          <div class="logo-area d-flex"> 
            <div class="col-4 text-start">
              <img src="/images/coat_of_arms.png" alt="Coat of Arms" />
            </div>
            <div class="col-4 text-center">
              <h6>${institution?.name || ""}</h6>
              <h6 class="mt-2">OFFICIAL PAYMENT RECEIPT</h6>
            </div>
            <div class="col-4 text-end">
              ${institution.logo ? `<img src="${institution.logo}" alt="logo" />` : ""}
            </div>
          </div>
        </div>
        <div class="meta d-flex border-bottom">
          <div class="col-6 pt-2"> 
            <h6 class="border-bottom"><strong>Receipt Number: </strong> ${receipt.receiptNo}</h6>
            <p><strong>Plot Number: </strong> ${property?.propertyNo || 'Unknown'}</p>
            <p><strong>Location: </strong> ${property?.locationName || 'Unknown'}</p>
            <p><strong>Date Receipted: </strong> ${ formatDate(new Date(receipt.txnDate), 'short') }</p>
            <p><strong>Date Printed: </strong> ${currentDate} ${currentTime}</p>
          </div>
          <div class="col-6 border p-2"> 
            <h6 class="border-bottom bold text-center"><strong>Client Details</strong></h6>
            <p><strong>Client ID: </strong> ${receipt.clientId}</p>
            <p><strong>Client Name: </strong> ${receipt.clientName}</p>
            <p><strong>National ID: </strong> ${receipt.nationalId}</p>
            <p><strong>Mobile Number: </strong> ${formatMobileNumber(receipt.mobileNumber || '')}</p>
          </div>
        </div>
        <h6 class="my-2">TRANSACTION SUMMARY</h6>
        <p class="mb-0"><strong> Payment Naration</strong></p>
        <p class="my-0">${receipt.txnComment}</p>
        <div class="">
          <div class="row">
            <div class="col-10">
              <p class="border-bottom my-0">Balance Brought Forward</p>
            </div>
            <div class="col-2 text-end">
              <p class="border-bottom my-0"><strong> ${receipt.amountDue < 0 ?  '( '+ formatCurrency(receipt.amountDue*-1 || 0, 'ZMW', true)+ ' )' :formatCurrency(receipt.amountDue || 0, 'ZMW', true)}</strong></p>
            </div>
          </div>
          <div class="row">
            <div class="col-10">
              <p class="border-bottom my-0">Amount Paid</p>
            </div>
            <div class="col-2 text-end">
              <p class="border-bottom my-0"><strong> ${formatCurrency(receipt.txnAmount || 0, 'ZMW', true)}</strong></p>
            </div>
          </div>
          <div class="row">
            <div class="col-10">
              <p class="border-bottom my-0">Closing Balance</p>
            </div>
            <div class="col-2 text-end">
              <p class="border-bottom my-0"><strong> ${ receipt.balance < 0 ?  '( '+ formatCurrency(receipt.balance*-1 || 0, 'ZMW', true)+ ' )' :formatCurrency(receipt.balance || 0, 'ZMW', true)}</strong></p>
            </div>
          </div>
          <p class="mb-0"><strong> Payment Reference:</strong> ${receipt.txnRef}</p>
          <div class="d-flex"> 
            <div class="col-4 text-start h-100">
              <p class="mb-0"><strong> Received By: </strong> ${receipt.userName}</p>
            </div>
            <div class="col-8 text-start h-100 pl-3 border">
              <p class="mb-0"><strong> Sign: </strong></p>
            </div>
          </div>
        </div>
        <div class="d-flex"> 
          <div class="col-6 text-center">
            <p class="footer-note my-0">Printed by ${receipt.userName} on ${currentDate}</p>
          </div>
          <div class="col-6 text-end">
            <p class="footer-note my-0"><i>Powered by PaySuite Financial Systems</i></p>
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
  return null
};

export default printBillableReceipt;
