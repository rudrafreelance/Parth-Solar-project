import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatInrPlain, hsnTaxBreakdown } from '@/lib/billingMath'
import { BILL_PDF_BUCKET, supabase } from '@/lib/supabase'

function money(v) {
  return formatInrPlain(v)
}

function buildSalePdf(company, bill, lines) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 40

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('TAX INVOICE', pageW / 2, y, { align: 'center' })
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80)
  doc.text('Original Copy', pageW / 2, y, { align: 'center' })
  doc.setTextColor(17)
  y += 22

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(company.business_name || 'IDEAL ENERGY', pageW / 2, y, { align: 'center' })
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const addrLines = doc.splitTextToSize(company.address || '-', pageW - 80)
  doc.text(addrLines, pageW / 2, y, { align: 'center' })
  y += addrLines.length * 12 + 4
  doc.text(`Mobile: ${company.phone || '-'} | Email: ${company.email || '-'}`, pageW / 2, y, {
    align: 'center',
  })
  y += 12
  doc.text(`GSTIN - ${company.gstin || '-'} | PAN - ${company.pan || '-'}`, pageW / 2, y, {
    align: 'center',
  })
  y += 18

  const leftX = 40
  const rightX = pageW / 2 + 10
  const boxH = 78
  doc.rect(leftX, y, pageW / 2 - 30, boxH)
  doc.rect(rightX, y, pageW / 2 - 50, boxH)
  doc.setFont('helvetica', 'bold')
  doc.text('Billing Details', leftX + 8, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name : ${bill.party_name}`, leftX + 8, y + 30)
  doc.text(`GSTIN: ${bill.party_gstin || '-'}`, leftX + 8, y + 44)
  const partyAddr = doc.splitTextToSize(`Address: ${bill.party_address || '-'}`, pageW / 2 - 50)
  doc.text(partyAddr, leftX + 8, y + 58)

  doc.text(`Invoice Number : ${bill.invoice_no}`, rightX + 8, y + 18)
  doc.text(`Invoice Date : ${bill.invoice_date}`, rightX + 8, y + 34)
  doc.text(`E-WAY BILLNO. : ${bill.eway_bill_no || '-'}`, rightX + 8, y + 50)
  doc.text(`MOTOR VEHICLE NO. : ${bill.vehicle_no || '-'}`, rightX + 8, y + 66)
  y += boxH + 12

  autoTable(doc, {
    startY: y,
    head: [['Sr.', 'Item Description', 'HSN/SAC', 'Qty', 'Rate', 'Amount (₹)']],
    body: lines.map((line, index) => [
      String(index + 1),
      line.description,
      line.hsn || '',
      `${line.qty} ${line.unit || ''}`,
      money(line.rate),
      money(line.amount),
    ]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [230, 230, 230], textColor: 17, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 28 },
      5: { halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  })

  y = doc.lastAutoTable.finalY + 14
  const gstGroups = {}
  for (const line of lines) {
    const key = Number(line.cgst_rate)
    if (!gstGroups[key]) gstGroups[key] = { rate: key, cgst: 0, sgst: 0 }
    gstGroups[key].cgst += Number(line.cgst_amount) || 0
    gstGroups[key].sgst += Number(line.sgst_amount) || 0
  }

  const totalsX = pageW - 220
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL', totalsX, y)
  doc.text(money(bill.taxable_total), pageW - 40, y, { align: 'right' })
  y += 14
  doc.setFont('helvetica', 'normal')
  for (const g of Object.values(gstGroups)) {
    doc.text(`CGST@${g.rate}%`, totalsX, y)
    doc.text(money(g.cgst), pageW - 40, y, { align: 'right' })
    y += 12
    doc.text(`SGST@${g.rate}%`, totalsX, y)
    doc.text(money(g.sgst), pageW - 40, y, { align: 'right' })
    y += 12
  }
  doc.text('R.Off(+/-)', totalsX, y)
  doc.text(money(bill.round_off), pageW - 40, y, { align: 'right' })
  y += 14
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL AMOUNT', totalsX, y)
  doc.text(money(bill.grand_total), pageW - 40, y, { align: 'right' })
  y += 22

  doc.setFont('helvetica', 'bold')
  doc.text('Amount Chargeable (In Words)', 40, y)
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.text(bill.amount_in_words || '', 40, y)
  y += 20

  doc.rect(40, y, pageW - 80, 70)
  doc.text(`Name On A/C:- ${company.bank_account_name || company.business_name}`, 48, y + 16)
  doc.text(`A/C NO:- ${company.bank_account_no || '-'}`, 48, y + 32)
  doc.text(`Bank Name:- ${company.bank_name || '-'}`, 48, y + 48)
  doc.text(`IFSC CODE:- ${company.bank_ifsc || '-'}`, 48, y + 64)
  y += 90

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(company.business_name || 'IDEAL ENERGY', pageW / 2, y, { align: 'center' })
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(85)
  doc.text('This Is A Computer Generated Invoice', pageW / 2, y, { align: 'center' })

  return doc
}

function buildPurchasePdf(company, bill, lines) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 36

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Tax Invoice', 40, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('e-Invoice', pageW - 40, y, { align: 'right' })
  y += 14

  doc.rect(40, y, pageW - 80, 42)
  doc.text(`IRN : ${bill.irn || '-'}`, 48, y + 14)
  doc.text(`Ack No. : ${bill.ack_no || '-'}`, 48, y + 26)
  doc.text(`Ack Date : ${bill.ack_date || '-'}`, 48, y + 38)
  y += 52

  const colW = (pageW - 86) / 2
  doc.rect(40, y, colW, 78)
  doc.rect(40 + colW + 6, y, colW, 78)
  doc.setFont('helvetica', 'bold')
  doc.text(bill.party_name || '-', 48, y + 14)
  doc.setFont('helvetica', 'normal')
  const supplierAddr = doc.splitTextToSize(bill.party_address || '-', colW - 16)
  doc.text(supplierAddr, 48, y + 28)
  doc.text(`GSTIN/UIN: ${bill.party_gstin || '-'}`, 48, y + 56)
  doc.text(
    `State Name : ${bill.party_state_name || 'Gujarat'}, Code : ${bill.party_state_code || '24'}`,
    48,
    y + 68,
  )

  const buyerX = 40 + colW + 14
  doc.setFont('helvetica', 'bold')
  doc.text('Buyer (Bill to)', buyerX, y + 14)
  doc.setFont('helvetica', 'normal')
  doc.text(company.business_name || 'IDEAL ENERGY', buyerX, y + 28)
  const buyerAddr = doc.splitTextToSize(company.address || '-', colW - 16)
  doc.text(buyerAddr, buyerX, y + 40)
  doc.text(`GSTIN/UIN : ${company.gstin || '-'}`, buyerX, y + 62)
  doc.text(
    `State Name : ${company.state_name || 'Gujarat'}, Code : ${company.state_code || '24'}`,
    buyerX,
    y + 74,
  )
  y += 90

  doc.text(`Invoice No. ${bill.invoice_no}`, 40, y)
  doc.text(`Dated ${bill.invoice_date}`, pageW / 2, y)
  y += 12
  doc.text(`E-Way : ${bill.eway_bill_no || '-'}`, 40, y)
  doc.text(`Vehicle : ${bill.vehicle_no || '-'}`, pageW / 2, y)
  y += 10

  autoTable(doc, {
    startY: y,
    head: [['Sl', 'Description of Goods', 'HSN/SAC', 'Quantity', 'Rate', 'per', 'Amount']],
    body: lines.map((line, index) => [
      String(index + 1),
      line.description,
      line.hsn || '',
      String(line.qty),
      money(line.rate),
      line.unit || 'NOS',
      money(line.amount),
    ]),
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: [230, 230, 230], textColor: 17, fontStyle: 'bold' },
    columnStyles: { 6: { halign: 'right' } },
    margin: { left: 40, right: 40 },
  })

  y = doc.lastAutoTable.finalY + 10
  const breakdown = hsnTaxBreakdown(lines)
  autoTable(doc, {
    startY: y,
    head: [['HSN/SAC', 'Taxable', 'CGST %', 'CGST Amt', 'SGST %', 'SGST Amt', 'Tax']],
    body: breakdown.map((row) => [
      row.hsn,
      money(row.taxable),
      String(row.cgst_rate),
      money(row.cgst),
      String(row.sgst_rate),
      money(row.sgst),
      money(row.tax),
    ]),
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: [230, 230, 230], textColor: 17, fontStyle: 'bold' },
    margin: { left: 40, right: 40 },
  })

  y = doc.lastAutoTable.finalY + 14
  doc.setFont('helvetica', 'bold')
  doc.text(`Grand Total: ${money(bill.grand_total)}`, pageW - 40, y, { align: 'right' })
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.text(bill.amount_in_words || '', 40, y)
  y += 16
  doc.setFontSize(7)
  doc.setTextColor(80)
  doc.text('This is a computer generated tax invoice.', 40, y)

  return doc
}

export async function generateAndUploadBillPdf({ userId, company, bill, lines, existingPath }) {
  const doc = bill.bill_type === 'purchase' ? buildPurchasePdf(company, bill, lines) : buildSalePdf(company, bill, lines)
  const blob = doc.output('blob')

  const path =
    existingPath ||
    `${userId}/${bill.bill_type}/${bill.financial_year}/${bill.invoice_no}-${Date.now()}.pdf`

  const { error: uploadError } = await supabase.storage
    .from(BILL_PDF_BUCKET)
    .upload(path, blob, { contentType: 'application/pdf', upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BILL_PDF_BUCKET).getPublicUrl(path)
  return { pdf_url: data.publicUrl, pdf_path: path }
}
