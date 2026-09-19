import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatInrPlain, hsnTaxBreakdown } from '@/lib/billingMath'
import { BILL_PDF_BUCKET, supabase } from '@/lib/supabase'

function money(v) {
  return formatInrPlain(v)
}

function formatRatePlain(value) {
  const num = Number(value) || 0
  if (Number.isInteger(num)) {
    return new Intl.NumberFormat('en-IN').format(num)
  }
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatInvoiceDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(d.getDate()).padStart(2, '0')
  const mon = months[d.getMonth()]
  const yr = String(d.getFullYear()).slice(-2)
  return `${day}-${mon}-${yr}`
}

function drawRupeeSymbol(doc, x, y) {
  const prevWidth = doc.getLineWidth()
  doc.setLineWidth(0.65)
  // Bar 1 (top)
  doc.line(x, y - 6.2, x + 5, y - 6.2)
  // Bar 2 (mid)
  doc.line(x, y - 4.4, x + 5, y - 4.4)
  // Vertical stem
  doc.line(x + 1, y - 6.2, x + 1, y - 2.2)
  // Loop curve
  doc.line(x + 1, y - 6.2, x + 3.8, y - 6.2)
  doc.line(x + 3.8, y - 6.2, x + 4.5, y - 5.3)
  doc.line(x + 4.5, y - 5.3, x + 3.8, y - 4.4)
  doc.line(x + 3.8, y - 4.4, x + 1, y - 2.2)
  // Diagonal leg
  doc.line(x + 1.8, y - 2.5, x + 4.8, y - 0.2)
  doc.setLineWidth(prevWidth)
}

function buildSalePdf(company, bill, lines) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  const startX = 40
  const startY = 36
  const boxW = pageW - startX * 2 // 515.28 pt
  const endX = startX + boxW

  // Table column widths
  const colW = {
    sr: 28,
    desc: 172,
    hsn: 65,
    qty: 40,
    rate: 85,
    amount: 125.28,
  }

  const xSr = startX
  const xDesc = xSr + colW.sr
  const xHsn = xDesc + colW.desc
  const xQty = xHsn + colW.hsn
  const xRate = xQty + colW.qty
  const xAmount = xRate + colW.rate

  doc.setDrawColor(0)
  doc.setLineWidth(0.65)

  // 1. TOP HEADER: TAX INVOICE & Original Copy
  let curY = startY
  const topBarH = 22
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('TAX INVOICE', startX + boxW / 4 + 15, curY + 15, { align: 'center' })
  doc.setFontSize(9)
  doc.text('Original Copy', startX + boxW * 0.75, curY + 15, { align: 'center' })

  curY += topBarH
  doc.line(startX, curY, endX, curY)

  // 2. COMPANY HEADER
  const companyH = 76
  const centerX = startX + boxW / 2
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(company.business_name || 'IDEAL ENERGY', centerX, curY + 16, { align: 'center' })

  doc.setFontSize(9.5)
  const rawAddr = company.address || 'B/4/41 VAIKUTH CO OP HOU SOC LTD, NR.CADILA BRIDEG GHODASAR AHMEDABAD'
  const addrParts = rawAddr.split(/\r?\n|, (?=NR\.)|, (?=Nr\.)/i)
  if (addrParts.length > 1) {
    doc.text(addrParts[0].trim(), centerX, curY + 29, { align: 'center' })
    doc.text(addrParts[1].trim(), centerX, curY + 42, { align: 'center' })
  } else {
    const split = doc.splitTextToSize(rawAddr, boxW - 20)
    doc.text(split[0] || '', centerX, curY + 29, { align: 'center' })
    if (split[1]) doc.text(split[1], centerX, curY + 42, { align: 'center' })
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Mobile: ${company.phone || '+91 6355859771'} | Email: ${company.email || 'Idealeneergy@gmail.com'}`, centerX, curY + 55, { align: 'center' })
  doc.text(`GSTIN - ${company.gstin || '24JMFPK6119C1Z8'} | PAN - ${company.pan || 'JMFPK6119C'}`, centerX, curY + 68, { align: 'center' })

  curY += companyH
  doc.line(startX, curY, endX, curY)

  // 3. BILLING DETAILS & INVOICE DETAILS
  const billingH = 78
  const splitX = startX + 270
  doc.line(splitX, curY, splitX, curY + billingH)

  // Left side: Billing Details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('Billing Details', startX + 6, curY + 13)
  doc.text(`Name :${(bill.party_name || '').toUpperCase()}`, startX + 6, curY + 25)
  doc.text(`GSTIN:${bill.party_gstin || '-'}`, startX + 6, curY + 37)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const addrText = `Add Address:${bill.party_address || '-'}`
  const splitAddr = doc.splitTextToSize(addrText, splitX - startX - 12)
  doc.text(splitAddr, startX + 6, curY + 49)

  // Right side: Invoice Details
  const rightX = splitX + 6
  const colonX = splitX + 102
  const valX = colonX + 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)

  doc.text('Invoice Number', rightX, curY + 13)
  doc.text(':', colonX, curY + 13)
  doc.text(String(bill.invoice_no || ''), valX, curY + 13)

  doc.text('Invoice Date', rightX, curY + 25)
  doc.text(':', colonX, curY + 25)
  doc.text(formatInvoiceDate(bill.invoice_date), valX, curY + 25)

  doc.text('E-WAY BILLNO.', rightX, curY + 37)
  doc.text(':', colonX, curY + 37)
  doc.text(bill.eway_bill_no || '', valX, curY + 37)

  doc.text('MOTOR VEHICLE NO.', rightX, curY + 49)
  doc.text(':', colonX, curY + 49)
  doc.text(bill.vehicle_no || '', valX, curY + 49)

  curY += billingH
  doc.line(startX, curY, endX, curY)

  // 4. ITEMS TABLE HEADER
  const tableHeaderH = 18
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)

  doc.text('Sr.', xSr + colW.sr / 2, curY + 12, { align: 'center' })
  doc.text('Item Description', xDesc + colW.desc / 2, curY + 12, { align: 'center' })
  doc.text('HSN/SAC', xHsn + colW.hsn / 2, curY + 12, { align: 'center' })
  doc.text('Qty', xQty + colW.qty / 2, curY + 12, { align: 'center' })
  doc.text('Rate', xRate + colW.rate / 2, curY + 12, { align: 'center' })

  // Amount (₹) header cleanly spaced
  const amtCenter = xAmount + colW.amount / 2
  const textBefore = 'Amount ('
  const wBefore = doc.getTextWidth(textBefore)
  const rupeeW = 6
  const wAfter = doc.getTextWidth(')')
  const totalAmtW = wBefore + rupeeW + wAfter
  const amtStartX = amtCenter - totalAmtW / 2

  doc.text(textBefore, amtStartX, curY + 12)
  drawRupeeSymbol(doc, amtStartX + wBefore + 0.5, curY + 12)
  doc.text(')', amtStartX + wBefore + rupeeW + 1, curY + 12)

  // Vertical lines for header
  doc.line(xDesc, curY, xDesc, curY + tableHeaderH)
  doc.line(xHsn, curY, xHsn, curY + tableHeaderH)
  doc.line(xQty, curY, xQty, curY + tableHeaderH)
  doc.line(xRate, curY, xRate, curY + tableHeaderH)
  doc.line(xAmount, curY, xAmount, curY + tableHeaderH)

  curY += tableHeaderH
  doc.line(startX, curY, endX, curY)

  // 5. ITEMS TABLE BODY (Data Rows + Empty grid rows)
  const itemRowH = 16.5
  const totalGridRows = 19 // exactly matches the 19 grid rows in screenshot
  const tableTopY = curY

  for (let i = 0; i < totalGridRows; i++) {
    const rowY = curY
    const line = lines[i]

    if (line) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)

      // Sr
      doc.text(String(i + 1), xSr + colW.sr / 2, rowY + 11.5, { align: 'center' })
      // Description
      doc.text(line.description || '', xDesc + 6, rowY + 11.5)
      // HSN
      doc.text(line.hsn || '', xHsn + colW.hsn / 2, rowY + 11.5, { align: 'center' })
      // Qty
      doc.text(String(line.qty || ''), xQty + colW.qty / 2, rowY + 11.5, { align: 'center' })
      // Rate
      doc.text(formatRatePlain(line.rate), xRate + colW.rate - 6, rowY + 11.5, { align: 'right' })
      // Amount
      doc.text(formatInrPlain(line.amount), endX - 6, rowY + 11.5, { align: 'right' })
    }

    curY += itemRowH
    doc.line(startX, curY, endX, curY)
  }

  // Draw vertical column lines through the entire table body
  doc.line(xDesc, tableTopY, xDesc, curY)
  doc.line(xHsn, tableTopY, xHsn, curY)
  doc.line(xQty, tableTopY, xQty, curY)
  doc.line(xRate, tableTopY, xRate, curY)
  doc.line(xAmount, tableTopY, xAmount, curY)

  // 6. TOTALS & TAXES
  const gstGroups = {}
  for (const line of lines) {
    const key = Number(line.cgst_rate)
    if (!gstGroups[key]) gstGroups[key] = { rate: key, cgst: 0, sgst: 0 }
    gstGroups[key].cgst += Number(line.cgst_amount) || 0
    gstGroups[key].sgst += Number(line.sgst_amount) || 0
  }
  const sortedTaxes = Object.values(gstGroups).sort((a, b) => a.rate - b.rate)

  // Row: TOTAL
  const totalRowH = 16
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('TOTAL', startX + 6, curY + 11.5)
  doc.text(formatInrPlain(bill.taxable_total), endX - 6, curY + 11.5, { align: 'right' })
  doc.line(xAmount, curY, xAmount, curY + totalRowH)
  curY += totalRowH
  doc.line(startX, curY, endX, curY)

  // Tax Rows: CGST & SGST
  const taxRowH = 15
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)

  for (const g of sortedTaxes) {
    const labelRateStr = `${g.rate}%`
    const colRateStr = g.rate % 1 === 0 ? `${g.rate}%` : `${g.rate.toFixed(2)}%`

    // CGST
    doc.text(`CGST@${labelRateStr}`, startX + 6, curY + 11)
    doc.text(colRateStr, xAmount - 6, curY + 11, { align: 'right' })
    doc.text(formatInrPlain(g.cgst), endX - 6, curY + 11, { align: 'right' })
    doc.line(xRate, curY, xRate, curY + taxRowH)
    doc.line(xAmount, curY, xAmount, curY + taxRowH)
    curY += taxRowH
    doc.line(startX, curY, endX, curY)

    // SGST
    doc.text(`SGST@${labelRateStr}`, startX + 6, curY + 11)
    doc.text(colRateStr, xAmount - 6, curY + 11, { align: 'right' })
    doc.text(formatInrPlain(g.sgst), endX - 6, curY + 11, { align: 'right' })
    doc.line(xRate, curY, xRate, curY + taxRowH)
    doc.line(xAmount, curY, xAmount, curY + taxRowH)
    curY += taxRowH
    doc.line(startX, curY, endX, curY)
  }

  // Row: R.Off(+/-)
  const roundOffVal = Number(bill.round_off) || 0
  doc.text('R.Off(+/-)', startX + 6, curY + 11)
  doc.text(formatInrPlain(roundOffVal), endX - 6, curY + 11, { align: 'right' })
  doc.line(xAmount, curY, xAmount, curY + taxRowH)
  curY += taxRowH
  doc.line(startX, curY, endX, curY)

  // Row: TOTAL AMOUNT
  const grandTotalRowH = 18
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('TOTAL AMOUNT', xAmount - 15, curY + 13, { align: 'right' })
  doc.text(formatInrPlain(bill.grand_total), endX - 6, curY + 13, { align: 'right' })
  doc.line(xAmount, curY, xAmount, curY + grandTotalRowH)
  curY += grandTotalRowH
  doc.line(startX, curY, endX, curY)

  // 7. AMOUNT CHARGEABLE (IN WORDS)
  const wordsH = 26
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Amount Chargeable (In Words)', startX + 6, curY + 10)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(bill.amount_in_words || 'INR Only', startX + 6, curY + 20)
  curY += wordsH
  doc.line(startX, curY, endX, curY)

  // 8. BANK DETAILS & SIGNATURE
  const bankH = 55
  doc.line(splitX, curY, splitX, curY + bankH)

  // Left: Bank details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(`Name On A/C:-${company.bank_account_name || company.business_name || 'IDEAL ENERGY'}`, startX + 6, curY + 13)
  doc.text(`A/C NO:-${company.bank_account_no || '251010190313'}`, startX + 6, curY + 25)
  doc.text(`Bank Name:-${company.bank_name || 'INDUSLND BANK'}`, startX + 6, curY + 37)
  doc.text(`IFSC CODE:-${company.bank_ifsc || 'INDB0000727'}`, startX + 6, curY + 49)

  // Right: Signature
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(company.business_name || 'IDEAL ENERGY', endX - 6, curY + 40, { align: 'right' })
  doc.setFontSize(8.5)
  doc.text('PROPERTIES', endX - 6, curY + 50, { align: 'right' })

  curY += bankH
  doc.line(startX, curY, endX, curY)

  // 9. FOOTER
  const footerH = 16
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('This Is A Computer Generated Invoice', centerX, curY + 11.5, { align: 'center' })

  curY += footerH

  // OUTER RECTANGLE (Enclosing entire invoice)
  doc.setLineWidth(1.2)
  doc.rect(startX, startY, boxW, curY - startY)

  return doc
}

async function buildPurchasePdf(company, bill, lines) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  const startX = 35
  const startY = 30
  const boxW = pageW - startX * 2 // 525.28 pt
  const endX = startX + boxW

  doc.setDrawColor(0)
  doc.setLineWidth(0.65)

  // 1. TOP HEADER: Tax Invoice & e-Invoice + QR Code
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Tax Invoice', startX + boxW / 2 - 40, startY + 14, { align: 'center' })

  doc.setFontSize(10)
  doc.text('e-Invoice', endX - 35, startY + 12, { align: 'center' })

  // Generate real QR code
  const qrData = bill.irn
    ? `IRN:${bill.irn}\nAck:${bill.ack_no}\nDate:${bill.ack_date}\nInvoice:${bill.invoice_no}\nTotal:${bill.grand_total}`
    : `Invoice:${bill.invoice_no}\nDate:${bill.invoice_date}\nParty:${bill.party_name}\nTotal:${bill.grand_total}`

  try {
    const qrDataUrl = await QRCode.toDataURL(qrData, { width: 140, margin: 1 })
    doc.addImage(qrDataUrl, 'PNG', endX - 72, startY + 16, 70, 70)
  } catch (e) {
    console.error('QR error', e)
  }

  // IRN box: draw a bordered box around IRN / Ack No / Ack Date
  const irnBoxY = startY + 22
  const irnBoxH = 58
  doc.rect(startX, irnBoxY, boxW - 78, irnBoxH)

  let irnY = irnBoxY + 16
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)

  doc.text('IRN :', startX + 5, irnY)
  const irnVal = bill.irn || '-'
  const irnLines = doc.splitTextToSize(irnVal, boxW - 100)
  doc.setFont('helvetica', 'normal')
  doc.text(irnLines, startX + 38, irnY)
  irnY += 16

  doc.text('Ack No. :', startX + 5, irnY)
  doc.text(String(bill.ack_no || '-'), startX + 50, irnY)
  irnY += 14

  doc.text('Ack Date :', startX + 5, irnY)
  doc.text(formatInvoiceDate(bill.ack_date), startX + 55, irnY)

  // ─────────────────────────────────────────────────────────────────────────
  // 2. MAIN SUPPLIER / BUYER GRID (matching screenshot exactly)
  // ─────────────────────────────────────────────────────────────────────────
  const boxTopY = startY + 88
  const partyBoxH = 76   // Supplier (left) & Buyer (right) section height
  const splitX = startX + boxW / 2

  // Outer rect
  doc.rect(startX, boxTopY, boxW, partyBoxH)
  // Vertical divider between supplier & buyer
  doc.line(splitX, boxTopY, splitX, boxTopY + partyBoxH)

  // LEFT COLUMN: Supplier (the party from whom we purchase)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text((bill.party_name || '-').toUpperCase(), startX + 5, boxTopY + 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  const supAddr = doc.splitTextToSize(bill.party_address || '-', splitX - startX - 10)
  doc.text(supAddr.slice(0, 3), startX + 5, boxTopY + 24)
  doc.text(`GSTIN/UIN: ${bill.party_gstin || '-'}`, startX + 5, boxTopY + 55)
  doc.text(
    `State Name : ${bill.party_state_name || 'Gujarat'}, Code : ${bill.party_state_code || '24'}`,
    startX + 5,
    boxTopY + 65,
  )

  // RIGHT COLUMN: Buyer (Bill to) = OUR company
  const rightX = splitX + 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('Buyer (Bill to)', rightX, boxTopY + 10)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text((company.business_name || 'IDEAL ENERGY').toUpperCase(), rightX, boxTopY + 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  const buyAddr = doc.splitTextToSize(company.address || '-', splitX - 10)
  doc.text(buyAddr.slice(0, 3), rightX, boxTopY + 33)
  doc.text(`GSTIN/UIN : ${company.gstin || '-'}`, rightX, boxTopY + 55)
  doc.text(
    `State Name : ${company.state_name || 'Gujarat'}, Code : ${company.state_code || '24'}`,
    rightX,
    boxTopY + 65,
  )

  // ─────────────────────────────────────────────────────────────────────────
  // 3. INVOICE DETAILS ROW (Invoice No | Dated | E-Way | Vehicle)
  // ─────────────────────────────────────────────────────────────────────────
  const detailsY = boxTopY + partyBoxH
  const detailsH = 28
  const dColW = boxW / 4
  const dMids = [startX, startX + dColW, startX + dColW * 2, startX + dColW * 3]

  doc.rect(startX, detailsY, boxW, detailsH)
  // vertical dividers
  for (let i = 1; i < 4; i++) {
    doc.line(startX + dColW * i, detailsY, startX + dColW * i, detailsY + detailsH)
  }

  const dLabels = ['Invoice No.', 'Dated', 'E-Way :', 'Vehicle :']
  const dVals = [
    String(bill.invoice_no || ''),
    formatInvoiceDate(bill.invoice_date),
    bill.eway_bill_no || '-',
    bill.vehicle_no || '-',
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  for (let i = 0; i < 4; i++) {
    doc.text(dLabels[i], dMids[i] + 5, detailsY + 10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text(dVals[i], dMids[i] + 5, detailsY + 21)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. ITEMS TABLE
  // ─────────────────────────────────────────────────────────────────────────
  const tableTopY = detailsY + detailsH
  const colW = {
    sl: 24,
    desc: 168,
    hsn: 52,
    part: 42,
    qty: 54,
    rate: 55,
    per: 32,
    amt: 98.28,
  }

  const xSl = startX
  const xDesc = xSl + colW.sl
  const xHsn = xDesc + colW.desc
  const xPart = xHsn + colW.hsn
  const xQty = xPart + colW.part
  const xRate = xQty + colW.qty
  const xPer = xRate + colW.rate
  const xAmt = xPer + colW.per

  const thH = 20
  doc.rect(startX, tableTopY, boxW, thH)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('Sl\nNo.', xSl + colW.sl / 2, tableTopY + 8, { align: 'center' })
  doc.text('Description of Goods', xDesc + colW.desc / 2, tableTopY + 12, { align: 'center' })
  doc.text('HSN/SAC', xHsn + colW.hsn / 2, tableTopY + 12, { align: 'center' })
  doc.text('Part No.', xPart + colW.part / 2, tableTopY + 12, { align: 'center' })
  doc.text('Quantity', xQty + colW.qty / 2, tableTopY + 12, { align: 'center' })
  doc.text('Rate', xRate + colW.rate / 2, tableTopY + 12, { align: 'center' })
  doc.text('per', xPer + colW.per / 2, tableTopY + 12, { align: 'center' })
  doc.text('Amount', xAmt + colW.amt / 2, tableTopY + 12, { align: 'center' })

  // Column header vertical dividers
  doc.line(xDesc, tableTopY, xDesc, tableTopY + thH)
  doc.line(xHsn, tableTopY, xHsn, tableTopY + thH)
  doc.line(xPart, tableTopY, xPart, tableTopY + thH)
  doc.line(xQty, tableTopY, xQty, tableTopY + thH)
  doc.line(xRate, tableTopY, xRate, tableTopY + thH)
  doc.line(xPer, tableTopY, xPer, tableTopY + thH)
  doc.line(xAmt, tableTopY, xAmt, tableTopY + thH)

  // Table Body Rows
  let curY = tableTopY + thH
  const tableBodyTop = curY

  // Render items
  lines.forEach((line, index) => {
    const rowY = curY
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)

    // Sl No.
    doc.text(String(index + 1), xSl + colW.sl / 2, rowY + 11, { align: 'center' })
    // Description
    doc.text(line.description || '', xDesc + 5, rowY + 11)
    // HSN
    doc.setFont('helvetica', 'normal')
    doc.text(line.hsn || '', xHsn + colW.hsn / 2, rowY + 11, { align: 'center' })

    // Qty
    doc.setFont('helvetica', 'bold')
    doc.text(`${line.qty} ${line.unit || 'NOS'}`, xQty + colW.qty - 5, rowY + 11, { align: 'right' })

    // Rate
    doc.setFont('helvetica', 'normal')
    doc.text(formatInrPlain(line.rate), xRate + colW.rate - 5, rowY + 11, { align: 'right' })

    // per
    doc.text(line.unit || 'NOS', xPer + colW.per / 2, rowY + 11, { align: 'center' })

    // Amount
    doc.setFont('helvetica', 'bold')
    doc.text(formatInrPlain(line.amount), endX - 5, rowY + 11, { align: 'right' })

    curY += 16
  })

  // Render Taxes inside table under description
  const gstGroups = {}
  for (const line of lines) {
    const key = Number(line.cgst_rate)
    if (!gstGroups[key]) gstGroups[key] = { rate: key, cgst: 0, sgst: 0 }
    gstGroups[key].cgst += Number(line.cgst_amount) || 0
    gstGroups[key].sgst += Number(line.sgst_amount) || 0
  }
  const sortedTaxes = Object.values(gstGroups).sort((a, b) => a.rate - b.rate)

  curY += 6
  for (const g of sortedTaxes) {
    const rateStr = g.rate % 1 === 0 ? `${g.rate}%` : `${g.rate.toFixed(2)}%`
    doc.setFont('helvetica', 'bolditalic')
    doc.setFontSize(8)

    // OUTPUT SGST
    doc.text(`OUTPUT SGST@${rateStr}`, xDesc + 18, curY + 10)
    doc.setFont('helvetica', 'normal')
    doc.text(`${rateStr} %`, xRate + colW.rate - 5, curY + 10, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(formatInrPlain(g.sgst), endX - 5, curY + 10, { align: 'right' })
    curY += 13

    // OUTPUT CGST
    doc.setFont('helvetica', 'bolditalic')
    doc.text(`OUTPUT CGST@${rateStr}`, xDesc + 18, curY + 10)
    doc.setFont('helvetica', 'normal')
    doc.text(`${rateStr} %`, xRate + colW.rate - 5, curY + 10, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(formatInrPlain(g.cgst), endX - 5, curY + 10, { align: 'right' })
    curY += 13
  }

  // Ensure minimum height for table
  const minTableH = 140
  if (curY - tableBodyTop < minTableH) {
    curY = tableBodyTop + minTableH
  }

  // Subtotal row
  doc.line(xAmt, curY, endX, curY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(formatInrPlain(bill.taxable_total), endX - 5, curY + 11, { align: 'right' })
  curY += 14

  // Round off row
  doc.line(startX, curY, endX, curY)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.text('Less :', xSl + 5, curY + 11)
  doc.setFont('helvetica', 'bold')
  doc.text('R.Off (+/-)', xDesc + 50, curY + 11)
  const roundOffNum = Number(bill.round_off) || 0
  const roundOffStr = roundOffNum < 0 ? `(-)${Math.abs(roundOffNum).toFixed(2)}` : roundOffNum.toFixed(2)
  doc.text(roundOffStr, endX - 5, curY + 11, { align: 'right' })
  curY += 14

  // Total row
  doc.line(startX, curY, endX, curY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text('Total', xDesc + 100, curY + 11)
  doc.setFont('helvetica', 'bold')
  drawRupeeSymbol(doc, endX - 70, curY + 11)
  doc.text(formatInrPlain(bill.grand_total), endX - 5, curY + 11, { align: 'right' })
  curY += 15
  doc.line(startX, curY, endX, curY)

  // Vertical column dividers through the table
  doc.line(startX, tableBodyTop, startX, curY)
  doc.line(xDesc, tableBodyTop, xDesc, curY - 29)
  doc.line(xHsn, tableBodyTop, xHsn, curY - 29)
  doc.line(xPart, tableBodyTop, xPart, curY - 29)
  doc.line(xQty, tableBodyTop, xQty, curY - 29)
  doc.line(xRate, tableBodyTop, xRate, curY - 29)
  doc.line(xPer, tableBodyTop, xPer, curY - 29)
  doc.line(xAmt, tableBodyTop, xAmt, curY)
  doc.line(endX, tableBodyTop, endX, curY)

  // ─────────────────────────────────────────────────────────────────────────
  // 5. AMOUNT CHARGEABLE (IN WORDS)
  // ─────────────────────────────────────────────────────────────────────────
  doc.rect(startX, curY, boxW, 24)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('Amount Chargeable (in words)', startX + 5, curY + 9)
  doc.text('E. & O.E', endX - 5, curY + 9, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(bill.amount_in_words || 'INR Only', startX + 5, curY + 19)
  curY += 24

  // ─────────────────────────────────────────────────────────────────────────
  // 6. HSN/SAC TAX BREAKDOWN TABLE
  // ─────────────────────────────────────────────────────────────────────────
  const breakdown = hsnTaxBreakdown(lines)
  const hsnH = 14
  const hsnW = {
    code: 110,
    taxable: 80,
    cgstR: 35,
    cgstA: 55,
    sgstR: 35,
    sgstA: 55,
    total: 155.28,
  }

  const xHsnCode = startX
  const xHsnTax = xHsnCode + hsnW.code
  const xHsnCgstR = xHsnTax + hsnW.taxable
  const xHsnCgstA = xHsnCgstR + hsnW.cgstR
  const xHsnSgstR = xHsnCgstA + hsnW.cgstA
  const xHsnSgstA = xHsnSgstR + hsnW.sgstR
  const xHsnTot = xHsnSgstA + hsnW.sgstA

  // HSN Header Row 1
  doc.rect(startX, curY, boxW, hsnH * 2)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)

  doc.text('HSN/SAC', xHsnCode + hsnW.code / 2, curY + 14, { align: 'center' })
  doc.text('Taxable\nValue', xHsnTax + hsnW.taxable / 2, curY + 6, { align: 'center' })
  doc.text('CGST', (xHsnCgstR + xHsnCgstA + hsnW.cgstA) / 2, curY + 9, { align: 'center' })
  doc.text('SGST/UTGST', (xHsnSgstR + xHsnSgstA + hsnW.sgstA) / 2, curY + 9, { align: 'center' })
  doc.text('Total\nTax Amount', xHsnTot + hsnW.total / 2, curY + 6, { align: 'center' })

  // Sub-header line
  doc.line(xHsnCgstR, curY + hsnH, xHsnTot, curY + hsnH)
  doc.text('Rate', xHsnCgstR + hsnW.cgstR / 2, curY + hsnH + 9, { align: 'center' })
  doc.text('Amount', xHsnCgstA + hsnW.cgstA / 2, curY + hsnH + 9, { align: 'center' })
  doc.text('Rate', xHsnSgstR + hsnW.sgstR / 2, curY + hsnH + 9, { align: 'center' })
  doc.text('Amount', xHsnSgstA + hsnW.sgstA / 2, curY + hsnH + 9, { align: 'center' })

  // Vertical lines for HSN header
  doc.line(xHsnTax, curY, xHsnTax, curY + hsnH * 2)
  doc.line(xHsnCgstR, curY, xHsnCgstR, curY + hsnH * 2)
  doc.line(xHsnCgstA, curY + hsnH, xHsnCgstA, curY + hsnH * 2)
  doc.line(xHsnSgstR, curY, xHsnSgstR, curY + hsnH * 2)
  doc.line(xHsnSgstA, curY + hsnH, xHsnSgstA, curY + hsnH * 2)
  doc.line(xHsnTot, curY, xHsnTot, curY + hsnH * 2)

  curY += hsnH * 2

  // HSN Data Rows
  let totTaxable = 0
  let totCgst = 0
  let totSgst = 0
  let totTax = 0

  breakdown.forEach((row) => {
    const rowY = curY
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)

    doc.text(row.hsn || '', xHsnCode + 5, rowY + 9)
    doc.text(formatInrPlain(row.taxable), xHsnCgstR - 5, rowY + 9, { align: 'right' })
    doc.text(`${row.cgst_rate}%`, xHsnCgstA - 5, rowY + 9, { align: 'right' })
    doc.text(formatInrPlain(row.cgst), xHsnSgstR - 5, rowY + 9, { align: 'right' })
    doc.text(`${row.sgst_rate}%`, xHsnSgstA - 5, rowY + 9, { align: 'right' })
    doc.text(formatInrPlain(row.sgst), xHsnTot - 5, rowY + 9, { align: 'right' })
    doc.text(formatInrPlain(row.tax), endX - 5, rowY + 9, { align: 'right' })

    totTaxable += row.taxable
    totCgst += row.cgst
    totSgst += row.sgst
    totTax += row.tax

    curY += 12
    doc.line(startX, curY, endX, curY)
  })

  // HSN Total Row
  doc.setFont('helvetica', 'bold')
  doc.text('Total', xHsnTax - 15, curY + 9, { align: 'right' })
  doc.text(formatInrPlain(totTaxable), xHsnCgstR - 5, curY + 9, { align: 'right' })
  doc.text(formatInrPlain(totCgst), xHsnSgstR - 5, curY + 9, { align: 'right' })
  doc.text(formatInrPlain(totSgst), xHsnTot - 5, curY + 9, { align: 'right' })
  doc.text(formatInrPlain(totTax), endX - 5, curY + 9, { align: 'right' })

  curY += 12
  doc.line(startX, curY, endX, curY)

  // Vertical lines through HSN data
  doc.line(startX, curY - (breakdown.length + 1) * 12, startX, curY)
  doc.line(xHsnTax, curY - (breakdown.length + 1) * 12, xHsnTax, curY)
  doc.line(xHsnCgstR, curY - (breakdown.length + 1) * 12, xHsnCgstR, curY)
  doc.line(xHsnCgstA, curY - (breakdown.length + 1) * 12, xHsnCgstA, curY)
  doc.line(xHsnSgstR, curY - (breakdown.length + 1) * 12, xHsnSgstR, curY)
  doc.line(xHsnSgstA, curY - (breakdown.length + 1) * 12, xHsnSgstA, curY)
  doc.line(xHsnTot, curY - (breakdown.length + 1) * 12, xHsnTot, curY)
  doc.line(endX, curY - (breakdown.length + 1) * 12, endX, curY)

  // ─────────────────────────────────────────────────────────────────────────
  // 7. DECLARATION & SIGNATURE
  // ─────────────────────────────────────────────────────────────────────────
  doc.rect(startX, curY, boxW, 85)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(`Tax Amount (in words) :`, startX + 5, curY + 9)
  doc.setFont('helvetica', 'bold')
  doc.text(`INR ${formatInrPlain(totTax)} Only`, startX + 110, curY + 9)

  doc.setFont('helvetica', 'normal')
  doc.text(`Company's PAN         :`, startX + 5, curY + 20)
  doc.setFont('helvetica', 'bold')
  doc.text(company.pan || '-', startX + 110, curY + 20)

  doc.line(startX, curY + 24, endX, curY + 24)

  // Declaration text
  doc.setFont('helvetica', 'bold')
  doc.text('Declaration', startX + 5, curY + 32)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  const declText =
    'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. 1. Subject to Ahmedabad Jurisdiction  2. Interest @ 24% p.a. will be payable on bills which are not paid on due date.  3. We are not ourselves responsible for any damage caused in transit. 4. Goods are sold with understanding that buyer is holding all requisite licences & Tax registrations.'
  const splitDecl = doc.splitTextToSize(declText, boxW - 10)
  doc.text(splitDecl.slice(0, 3), startX + 5, curY + 41)

  doc.line(startX, curY + 58, endX, curY + 58)

  // Signature row
  const sigMidX = startX + boxW / 2
  doc.line(sigMidX, curY + 58, sigMidX, curY + 85)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text("Customer's Seal and Signature", startX + 5, curY + 68)

  doc.text(`for ${(bill.party_name || 'SUPPLIER').toUpperCase()}`, endX - 5, curY + 68, { align: 'right' })
  doc.text('Authorised Signatory', endX - 5, curY + 81, { align: 'right' })

  curY += 85

  // 8. FOOTER
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('SUBJECT TO AHMEDABAD JURISDICTION', startX + boxW / 2, curY + 10, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text('This is a Computer Generated Invoice', startX + boxW / 2, curY + 20, { align: 'center' })

  return doc
}

export async function generateAndUploadBillPdf({ userId, company, bill, lines, existingPath }) {
  const doc = bill.bill_type === 'purchase' ? await buildPurchasePdf(company, bill, lines) : buildSalePdf(company, bill, lines)
  const blob = doc.output('blob')

  const path = `${userId}/${bill.bill_type}/${bill.financial_year}/${bill.invoice_no}-${Date.now()}.pdf`

  const { error: uploadError } = await supabase.storage
    .from(BILL_PDF_BUCKET)
    .upload(path, blob, { contentType: 'application/pdf', upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BILL_PDF_BUCKET).getPublicUrl(path)
  return { pdf_url: data.publicUrl, pdf_path: path }
}
