import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/** Zgodne z wierszem harmonogramu ze store (PDF bez HTML/CSS — brak problemu z oklch). */
export type SchedulePdfRow = {
  yearNumber: number
  phase: 'saving' | 'retirement'
  operation: 'Wpłata' | 'Wypłata'
  flowAmount: number
  balanceStart: number
  workingCapital: number
  interest: number
  balanceEnd: number
}

export type SchedulePdfFormatters = {
  formatPln: (value: number) => string
  formatSignedFlow: (row: SchedulePdfRow) => string
  formatEndingBalance: (row: SchedulePdfRow, index: number) => string
}

export function downloadScheduleTablePdf(
  options: {
    rows: SchedulePdfRow[]
    fileName: string
    generatedAt: string
    savingYears: number
  } & SchedulePdfFormatters,
): void {
  const {
    rows,
    fileName,
    generatedAt,
    savingYears,
    formatPln,
    formatSignedFlow,
    formatEndingBalance,
  } = options

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.setFontSize(14)
  doc.setTextColor(17, 24, 39)
  doc.text('Harmonogram oszczedzania i wyplat', 14, 16)
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)
  doc.text(`Wygenerowano: ${generatedAt}`, 14, 22)

  const head = [
    [
      'Rok',
      'Saldo pocz. (1 sty.)',
      'Wplata / wyplata',
      'Kapital pracujacy',
      'Odsetki',
      'Saldo koncowe',
    ],
  ]

  const body = rows.map((row, index) => [
    String(row.yearNumber),
    formatPln(row.balanceStart),
    formatSignedFlow(row),
    formatPln(row.workingCapital),
    formatPln(row.interest),
    formatEndingBalance(row, index),
  ])

  autoTable(doc, {
    startY: 26,
    head,
    body,
    theme: 'plain',
    styles: {
      fontSize: 7,
      cellPadding: 1.2,
      valign: 'middle',
      textColor: [31, 41, 55],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [31, 41, 55],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'right', cellWidth: 30 },
      2: { halign: 'right', cellWidth: 28, fontStyle: 'bold' },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 26 },
      5: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
    },
    margin: { left: 10, right: 10 },
    showHead: 'everyPage',
    didParseCell: (data) => {
      if (data.section !== 'body') return
      const idx = data.row.index
      const row = rows[idx]
      if (!row) return

      const phaseBreak = row.phase === 'retirement' && idx === savingYears

      if (phaseBreak) {
        data.cell.styles.fillColor = [238, 242, 255]
      } else if (idx % 2 === 1) {
        data.cell.styles.fillColor = [249, 250, 251]
      }

      if (data.column.index === 3) {
        data.cell.styles.fillColor = phaseBreak ? [230, 235, 255] : [241, 245, 249]
      }

      if (data.column.index === 2) {
        data.cell.styles.textColor =
          row.operation === 'Wpłata' ? [4, 120, 87] : [220, 38, 38]
      }
      if (data.column.index === 4) {
        data.cell.styles.textColor = [3, 105, 161]
      }
    },
  })

  doc.save(fileName)
}
