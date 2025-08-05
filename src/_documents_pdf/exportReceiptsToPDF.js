
import jsPDF from 'jspdf';
import "jspdf-autotable"; 

import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";
import formatDate from '../_utils/formatDate';

const exportReceiptsToPDF = (institution, receipts, filters, totalReceipts, dateTime, userName) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  let y = 10;

  // Logo
  if (institution.logo) {
    const img = new Image();
    img.src = institution.logo;
    img.onload = () => {
      doc.addImage(img, "PNG", 148, y, 20, 20);
      y += 25;

      addTextAndTable(); // Continue only after image is loaded
    };
  } else {
    addTextAndTable();
  }

  function addTextAndTable() {
    doc.setFontSize(12);
    doc.text("REPUBLIC OF ZAMBIA", 148, y, null, null, "center");
    y += 7;
    doc.text(institution.name, 148, y, null, null, "center");
    y += 7;
    doc.text(institution.address, 148, y, null, null, "center");
    y += 7;
    doc.text("RECEIPTS", 148, y, null, null, "center");
    y += 10;

    doc.setFontSize(10);
    doc.text(`Account Code: ${filters.coaCode || "none"} | User Name: ${filters.userName || "none"}`, 148, y, null, null, "center");
    y += 5;
    doc.text(`Start Date: ${formatDate(filters.startDate, 'short') || "none"} | End Date: ${formatDate(filters.endDate, 'short') || "none"}`, 148, y, null, null, "center");
    y += 7;
    doc.text(`Date Printed: ${dateTime}`, 148, y, null, null, "center");
    y += 5;
    const columns  = [["TXN ID", "Receipt Number", "Date", "Client Name", "Details", "Account Ref.", "Amount Due", "Amount Paid", "Balance", "Bank", "Account Name"]]
    const footer = [[
        { content: 'Total Amount', colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
        formatCurrency(totalReceipts),
      ]];
    const tableData = receipts.map(receipt => [
      receipt.txn,
      receipt.receiptNo,
      formatDate(receipt.txnDate, 'short'),
      receipt.clientName,
      receipt.txnComment,
      receipt.coaCode + ' ' + receipt.coaName,
      formatCurrency(receipt.amountDue, 'ZMW', true),
      formatCurrency(receipt.txnAmount, 'ZMW', true),
      formatCurrency(receipt.balance, 'ZMW', true),
      receipt.bankName + ' ' + receipt.branchName,
      receipt.accountName,
    ]);

    doc.autoTable({
      startY: y + 5,
      head: columns,
      body: tableData,
      foot: footer,

    });

    doc.save(`${institution.name} Receipts.pdf`);
  }
};

export default exportReceiptsToPDF;