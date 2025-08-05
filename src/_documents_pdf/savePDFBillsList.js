
import jsPDF from 'jspdf';
import "jspdf-autotable"; 

import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";

const savePDFBillsList = (institution, filteredBills, dateTime, search, filters,totalBroughtForward, totalCurrentBill, totalBalanceAfterBilling, totalClosingBalance) => {
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
    doc.text("Property Rates Bills", 148, y, null, null, "center");
    y += 10;

    doc.setFontSize(10);
    doc.text(`Search: ${search || "none"} | Client ID: ${filters.clientId || "none"} | Land Use ID: ${filters.propertyTypeId || "none"} | Location ID: ${filters.locationId || "none"} | Period: ${
      filters.period === 1 ? "January - June" : "July - December"
    } | Year: ${filters.year || "none"}`, 148, y, null, null, "center");
    y += 7;
    doc.text(`Date Printed: ${dateTime}`, 148, y, null, null, "center");
    y += 5;
    const columns  = [["Property No", "Description", "Client Name", "Details", "Brought Forward", "Amount Billed", "Balance After Billing", "Current Balance"]]
    const footer = [[
        { content: 'Total Amounts', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        formatCurrency(totalBroughtForward),
        formatCurrency(totalCurrentBill),
        formatCurrency(totalBalanceAfterBilling),
        formatCurrency(totalClosingBalance),
      ]];
    const tableData = filteredBills.map(bill => [
      bill.propertyNo,
      bill.description,
      bill.clientName,
      bill.txnComment,
      formatCurrency(bill.broughtForward),
      formatCurrency(bill.currentBill),
      formatCurrency(bill.balanceAfterBilling),
      formatCurrency(bill.closingBalance),
    ]);

    doc.autoTable({
      startY: y + 5,
      head: columns,
      body: tableData,
      foot: footer,

    });

    doc.save(`${institution.name} Property Rates Bills.pdf`);
  }
};

export default savePDFBillsList;