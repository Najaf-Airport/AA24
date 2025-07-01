// js/export-word.js
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType
} from "https://cdn.jsdelivr.net/npm/docx@8.0.0/+esm";

export async function exportFlightToWord(flight) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${flight["Date"] || "-"}`,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Najaf International Airport",
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Airside Operations Dept",
                italics: true,
                size: 26
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Aircraft Coordination Unit",
                italics: true,
                size: 24
              })
            ]
          }),
          new Paragraph({ text: " " }),
          createTable(flight),
          new Paragraph({ text: " " }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `اسم المنسق: ${flight["اسم المنسق"] || "غير معروف"}`,
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `ملاحظات: ${flight["NOTES"] || "-"}`,
                size: 22
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `رحلة_${flight["FLT.NO"] || "بدون_رقم"}.docx`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function createTable(data) {
  const fields = [
    "FLT.NO",
    "Time on Chocks",
    "Time open Door",
    "Time Start Cleaning",
    "Time complete cleaning",
    "Time ready boarding",
    "Time start boarding",
    "Boarding Complete",
    "Time Close Door",
    "Time off Chocks"
  ];

  const headerRow = new TableRow({
    children: fields.map(field =>
      new TableCell({
        width: { size: 100 / fields.length, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ text: field, bold: true })]
      })
    )
  });

  const valueRow = new TableRow({
    children: fields.map(field =>
      new TableCell({
        children: [new Paragraph({ text: data[field] || "-" })]
      })
    )
  });

  return new Table({
    rows: [headerRow, valueRow]
  });
}