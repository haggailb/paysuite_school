import jsPDF from "jspdf";
import "jspdf-autotable";

import formatCurrency from "../_utils/formatCurrency";
import formatDate from "../_utils/formatDate";
import formatMobileNumber from "../_utils/formatMobileNumber";

const savePDFPropertyStatement = (institution, defaultAccount, transactions, propertyDetails, date, dateTime, userName) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Y cursor start
  let y = 10;

  // Header
  if (institution.logo) {
    // Assuming logo is a base64 or URL - if URL, needs to be loaded first (out of scope)
    doc.addImage(institution.logo, "PNG", 85, y, 20, 20); // center approx
    y += 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("REPUBLIC OF ZAMBIA", 105, y, { align: "center" });
  y += 8;

  doc.setFontSize(12);
  doc.text(institution.name || "", 105, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(institution.address || "", 105, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("PROPERTY RATES STATEMENT", 105, y, { align: "center" });
  y += 12;

  // Property Details Left column start
  const leftX = 15;
  const rightX = 110;
  const lineSpacing = 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Property Details", leftX, y);
  doc.text("Valuation Details", rightX, y);
  y += lineSpacing;

  doc.setFont("helvetica", "normal");

  // Left side property details
  const leftDetails = [
    ["Client Name:", `${propertyDetails.firstName}  ${propertyDetails.lastName}`],
    ["Property No.:", propertyDetails.propertyNo],
    ["Land Use:", propertyDetails.propertyTypeName],
    ["House Number:", propertyDetails?.houseNumber || "Unknown House No."],
    ["Location:", `${propertyDetails.locationName}, ${propertyDetails?.street || ""}`],
    ["Contact:", `${formatMobileNumber(propertyDetails?.mobileNumber) || "Unknown"}, ${propertyDetails?.email || "Unknown"}`],
  ];

  // Right side valuation details
  const rightDetails = [
    ["Land Extent (Hectares):", propertyDetails?.land_extent || "N/A"],
    ["Value of Land:", formatCurrency(propertyDetails?.land_value || 0, "ZMW", true)],
    ["Value of Improvements:", formatCurrency(propertyDetails?.improvement_value || 0, "ZMW", true)],
    ["Plant and Machinery:", formatCurrency(propertyDetails?.pandm || 0, "ZMW", true)],
    ["Total Rateable Value:", formatCurrency(propertyDetails?.trv || 0, "ZMW", true)],
    ["Poundage:", propertyDetails?.propertyTypePoundage || "N/A"],
  ];

  for (let i = 0; i < leftDetails.length; i++) {
    doc.text(leftDetails[i][0], leftX, y);
    doc.text(String(leftDetails[i][1]), leftX + 40, y);
    doc.text(rightDetails[i][0], rightX, y);
    doc.text(String(rightDetails[i][1]), rightX + 50, y);
    y += lineSpacing;
  }

  y += 10;

  // Transaction Summary Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TRANSACTION SUMMARY", leftX, y);
  y += 8;

  // Prepare transaction table data
  const tableColumnHeaders = [
    "TXN ID",
    "Date",
    "Details",
    "Bill (ZMW)",
    "Receipt (ZMW)",
    "Balance (ZMW)",
  ];

  let totalBills = 0;
  let totalReceipts = 0;

  const tableRows = transactions.length > 0 ? transactions.map(txn => {
    if (txn.type === "Bill") totalBills += txn.txnAmount || 0;
    if (txn.type === "Receipt") totalReceipts += txn.txnAmount || 0;

    return [
      txn.txn,
      formatDate(txn.txnDate, "long"),
      txn.txnComment || "",
      txn.type === "Bill" ? formatCurrency(txn.txnAmount || 0, "ZMW", true) : "",
      txn.type === "Receipt" ? formatCurrency(txn.txnAmount || 0, "ZMW", true) : "",
      formatCurrency(txn.balance || 0, "ZMW", true),
    ];
  }) : [
    ["-", "-", "No transactions found", "-", "-", "-"]
  ];

  // Add transactions table using autotable
  doc.autoTable({
    startY: y,
    head: [tableColumnHeaders],
    body: tableRows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
    foot: [
      [
        { content: "Total", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
        { content: formatCurrency(totalBills, "ZMW", true), styles: { halign: "right", fontStyle: "bold" } },
        { content: formatCurrency(totalReceipts, "ZMW", true), styles: { halign: "right", fontStyle: "bold" } },
        { content: "", styles: { halign: "right" } },
      ],
    ],
  });

  y = doc.lastAutoTable.finalY + 10;

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
    ["Payment Reference", `Property rates for ${propertyDetails.propertyNo}`],
  ];

  doc.setFont("helvetica", "normal");
  bankDetails.forEach(([label, value]) => {
    doc.text(label + ":", leftX + 5, y);
    doc.text(value || "-", leftX + 50, y);
    y += 5;
  });

  // Footer
  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(`Printed by ${userName || "System"} on ${dateTime}`, leftX, y);
  y += 4;
  doc.text("Powered by PaySuite Financial Systems", leftX, y);

  // Save file with institution name and date
  doc.save(`${propertyDetails?.propertyNo || ""}  Property Statement - ${date}.pdf`);
};

export default savePDFPropertyStatement;
