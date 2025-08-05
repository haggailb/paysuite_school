
import { Document, Packer, Paragraph, TextRun, Table as DocxTable, TableCell, TableRow, HeadingLevel, Media, AlignmentType, WidthType  } from "docx";
import { saveAs } from "file-saver";
import formatCurrency from "../_utils/formatCurrency";
import formatMobileNumber from "../_utils/formatMobileNumber";

const exportBillsWord = async (institution, filteredBills, search, filters, dateTime) => {
  const heading = [
    new Paragraph({
      text: "REPUBLIC OF ZAMBIA",
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: institution.name,
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: institution.address,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: "Property Rates Bills",
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Search: ${search || "none"} | Client ID: ${filters.clientId || "none"} | Land Use ID: ${filters.propertyTypeId || "none"} | Location ID: ${filters.locationId || "none"} | Period: ${
        filters.period === 1 ? "January - June" : "July - December"
      } | Year: ${filters.year || "none"}`,
    }),
    new Paragraph({
      text: `Date Printed: ${dateTime}`,
      spacing: { after: 300 },
    }),
  ];

  const tableHeader = [
    "Property No",
    "Description",
    "Client Name",
    "Details",
    "Brought Forward",
    "Amount Billed",
    "Balance After Billing",
    "Current Balance",
  ].map((text) =>
    new TableCell({
      children: [new Paragraph({ text, alignment: AlignmentType.CENTER })],
    })
  );

  const rows = [
    new TableRow({ children: tableHeader }),
    ...filteredBills.map((bill) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(bill.propertyNo || "")] }),
          new TableCell({ children: [new Paragraph(bill.description || "")] }),
          new TableCell({ children: [new Paragraph(bill.clientName || "")] }),
          new TableCell({ children: [new Paragraph(bill.txnComment || "")] }),
          new TableCell({
            children: [new Paragraph(formatCurrency(bill.broughtForward))],
          }),
          new TableCell({
            children: [new Paragraph(formatCurrency(bill.currentBill))],
          }),
          new TableCell({
            children: [new Paragraph(formatCurrency(bill.balanceAfterBilling))],
          }),
          new TableCell({
            children: [new Paragraph(formatCurrency(bill.closingBalance))],
          }),
        ],
      })
    ),
  ];

  const doxTable = new DocxTable({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  const doc = new Document({
    creator: "PaySuite Financial Systems",
    title: "Property Rates Bills",
    description: "Exported property rates bills document",
    sections: [
      {
        children: [...heading, doxTable],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${institution.name} Property Rates Bills.docx`);
};

export default exportBillsWord;