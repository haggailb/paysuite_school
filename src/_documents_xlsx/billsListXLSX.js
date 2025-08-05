
import * as XLSX from "xlsx";

const exportXLSX = (institution, filteredBills, filters, search, dateTime) => {
  // 1. Header rows
  const heading = [
    ["REPUBLIC OF ZAMBIA"],
    [""],
    [institution.name],
    [institution.address],
    ["Property Rates Bills"],
    [""],
    [
      `Search: ${search || "none"} | Client ID: ${filters.clientId || "none"} | Land Use ID: ${filters.propertyTypeId || "none"} | Location ID: ${filters.locationId || "none"} | Period: ${filters.period === 1 ? "January - June" : "July - December"} | Year: ${filters.year || "none"}`
    ],
    [`Date Printed: ${dateTime}`],
    [""],
  ];

  // 2. Column headers + data
  const columnHeaders = [["Property No", "Description", "Client Name", "Details", "Brought Forward", "Amount Billed", "Balance After Billing", "Current Balance"]];
  const dataRows = filteredBills.map(bill => [
    bill.propertyNo,
    bill.description,
    bill.clientName,
    bill.txnComment,
    bill.broughtForward,
    bill.currentBill,
    bill.balanceAfterBilling,
    bill.closingBalance,
  ]);

  // 3. Combine all
  const sheetData = [...heading, ...columnHeaders, ...dataRows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");

  XLSX.writeFile(workbook, `${institution.name} Property Rates Bills.xlsx`);
};

export default exportXLSX;