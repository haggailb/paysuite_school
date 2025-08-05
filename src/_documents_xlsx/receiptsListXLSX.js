
import * as XLSX from "xlsx";
import formatDate from "../_utils/formatDate";

const exportReceiptToExcel = (institution, receipts, filters, dateTime) => {
  // 1. Header rows
  const heading = [
    ["REPUBLIC OF ZAMBIA"],
    [""],
    [institution.name],
    [institution.address],
    ["RECEIPTS"],
    [""],
    [
      `Account Code: ${filters.coaCode || "none"} | User Name: ${filters.userName || "none"} |
        Start Date: ${formatDate(filters.startDate, 'short') || "none"} |
        End Date: ${formatDate(filters.endDate, 'short') || "none"}`
    ],
    [`Date Printed: ${dateTime}`],
    [""],
  ];

  // 2. Column headers + data
  const columnHeaders = [["TXN ID", "Receipt Number", "Date", "Client Name", "Details", "Account Ref.", "Amount Due", "Amount Paid", "Balance", "Bank", "Account Name"]];
  const dataRows = receipts.map(receipt => [
    receipt.txn,
    receipt.receiptNo,
    formatDate(receipt.txnDate, 'short'),
    receipt.clientName,
    receipt.txnComment,
    receipt.coaCode + ' ' + receipt.coaName,
    receipt.amountDue,
    receipt.txnAmount,
    receipt.balance,
    receipt.bankName + ' ' + receipt.branchName,
    receipt.accountName,
  ]);

  // 3. Combine all
  const sheetData = [...heading, ...columnHeaders, ...dataRows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");

  XLSX.writeFile(workbook, `${institution.name} Receipts.xlsx`);
};

export default exportReceiptToExcel;