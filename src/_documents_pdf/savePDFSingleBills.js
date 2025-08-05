
import jsPDF from 'jspdf';
import "jspdf-autotable"; 

import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";

const savePDFSingBills = (institution, filteredBills, defaultAccount, date, dateTime, userName, filters) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  filteredBills.forEach((bill, index) => {
    if (index > 0) doc.addPage();

    let y = 10;

    // Header
    if (institution.logo) {
      doc.addImage(institution.logo, "PNG", 62, y, 20, 20); // center
      y += 25;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("REPUBLIC OF ZAMBIA", 74, y, { align: "center" });
    y += 7;
    doc.text(institution.name || "", 74, y, { align: "center" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(institution.address || "", 74, y, { align: "center" });
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PROPERTY RATES BILL", 74, y, { align: "center" });
    y += 10;

    // Meta Section
    const leftX = 15;
    const rightX = 100;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const lines = [
      [`Property No.:`, bill.propertyNo || "N/A"],
      [`Client Name:`, bill.clientName || "N/A"],
      [`Description:`, bill.description || "N/A"],
      [`Land Use:`, bill.propertyTypeName || "N/A"],
      [`House Number:`, bill.houseNumber || "Unknown House No."],
      [`Location:`, `${bill.locationName || "Unknown"}, ${bill.street || "N/A"}`],
      [`Contact:`, `${formatMobileNumber(bill.mobileNumber) || "N/A"}, ${bill.email || "N/A"}`],
    ];

    lines.forEach(([label, value]) => {
      doc.text(`${label}`, leftX, y);
      doc.text(`${value}`, leftX + 40, y);
      y += 5;
    });

    y += 5;

    // Billing Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Billing Summary", leftX, y);
    y += 6;
    doc.setFont("helvetica", "normal");

    const financials = [
      ["Details", bill.txnComment || "Property Rates Invoice"],
      ["Brought Forward", formatCurrency(bill.broughtForward || 0, "ZMW", true)],
      ["Amount Billed", formatCurrency(bill.currentBill || 0, "ZMW", true)],
      ["Balance After Billing", formatCurrency(bill.balanceAfterBilling || 0, "ZMW", true)],
      [`Closing Balance as at ${date}`, formatCurrency(bill.closingBalance || 0, "ZMW", true)],
    ];

    financials.forEach(([label, value]) => {
      doc.text(label, leftX + 5, y);
      doc.text(value, rightX +30, y, { align: "right" });
      y += 6;
    });

    y += 4;
    doc.setFontSize(9);
    doc.text("You are advised to pay the above Closing Balance to avoid any inconveniences.", leftX, y);
    y += 5;
    doc.text("Use the following bank details to make the payment at any Branch or Agent:", leftX, y);
    y += 6;

    // Bank Details
    const bankDetails = [
      ["Bank Name", defaultAccount.bankName],
      ["Branch Name", defaultAccount.branchName],
      ["Account Name", defaultAccount.accountName],
      ["Account Number", defaultAccount.accountNumber],
      ["Sort Code", defaultAccount.sortCode],
      ["Swift Code", defaultAccount.swiftCode],
      ["Payment Reference", `Property rates for ${bill.propertyNo}`],
    ];

    doc.setFont("helvetica", "normal");
    bankDetails.forEach(([label, value]) => {
      doc.text(label + ":", leftX + 5, y);
      doc.text(value || "-", leftX + 50, y);
      y += 5;
    });

    // Footer
    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Printed by ${userName || "System"} on ${dateTime}`, leftX, y);
    y += 5;
    doc.text("Powered by PaySuite Financial Systems", leftX, y);
  });

  doc.save(`${institution.name} Property Bills - ${filters.period}-${filters.year}.pdf`);
};

export default savePDFSingBills;