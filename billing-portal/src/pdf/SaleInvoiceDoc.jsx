import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatInrPlain } from '../lib/billingMath'

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: 'Helvetica', color: '#111' },
  center: { textAlign: 'center' },
  bold: { fontFamily: 'Helvetica-Bold' },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  muted: { color: '#444', marginTop: 2 },
  section: { marginTop: 14 },
  row: { flexDirection: 'row' },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { borderWidth: 1, borderColor: '#222', padding: 8, marginTop: 8 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#222',
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  c1: { width: '6%' },
  c2: { width: '34%' },
  c3: { width: '14%' },
  c4: { width: '10%' },
  c5: { width: '16%' },
  c6: { width: '20%', textAlign: 'right' },
  right: { textAlign: 'right' },
  totals: { marginTop: 8, alignItems: 'flex-end' },
  totalLine: { flexDirection: 'row', width: 220, justifyContent: 'space-between', marginTop: 3 },
  bank: { marginTop: 16, borderWidth: 1, borderColor: '#222', padding: 8 },
  footer: { marginTop: 20, textAlign: 'center', fontSize: 8, color: '#555' },
})

function money(v) {
  return formatInrPlain(v)
}

/** Sale invoice — Ideal Energy centered header + billing details + CGST/SGST */
export default function SaleInvoiceDoc({ company, bill, lines }) {
  const gstGroups = {}
  for (const line of lines) {
    const key = Number(line.cgst_rate)
    if (!gstGroups[key]) gstGroups[key] = { rate: key, cgst: 0, sgst: 0 }
    gstGroups[key].cgst += Number(line.cgst_amount) || 0
    gstGroups[key].sgst += Number(line.sgst_amount) || 0
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>TAX INVOICE</Text>
        <Text style={[styles.center, styles.muted]}>Original Copy</Text>

        <View style={[styles.section, styles.center]}>
          <Text style={[styles.bold, { fontSize: 14 }]}>{company.business_name || 'IDEAL ENERGY'}</Text>
          <Text style={styles.muted}>{company.address}</Text>
          <Text style={styles.muted}>
            Mobile: {company.phone || '-'} | Email: {company.email || '-'}
          </Text>
          <Text style={styles.muted}>
            GSTIN - {company.gstin || '-'} | PAN - {company.pan || '-'}
          </Text>
        </View>

        <View style={styles.between}>
          <View style={[styles.box, { width: '58%' }]}>
            <Text style={styles.bold}>Billing Details</Text>
            <Text style={{ marginTop: 4 }}>Name : {bill.party_name}</Text>
            <Text>GSTIN: {bill.party_gstin || '-'}</Text>
            <Text>Address: {bill.party_address || '-'}</Text>
          </View>
          <View style={[styles.box, { width: '38%' }]}>
            <Text>Invoice Number : {bill.invoice_no}</Text>
            <Text style={{ marginTop: 4 }}>Invoice Date : {bill.invoice_date}</Text>
            <Text style={{ marginTop: 4 }}>E-WAY BILLNO. : {bill.eway_bill_no || '-'}</Text>
            <Text style={{ marginTop: 4 }}>MOTOR VEHICLE NO. : {bill.vehicle_no || '-'}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.c1, styles.bold]}>Sr.</Text>
          <Text style={[styles.c2, styles.bold]}>Item Description</Text>
          <Text style={[styles.c3, styles.bold]}>HSN/SAC</Text>
          <Text style={[styles.c4, styles.bold]}>Qty</Text>
          <Text style={[styles.c5, styles.bold]}>Rate</Text>
          <Text style={[styles.c6, styles.bold]}>Amount (₹)</Text>
        </View>
        {lines.map((line, index) => (
          <View key={line.id || index} style={styles.tableRow}>
            <Text style={styles.c1}>{index + 1}</Text>
            <Text style={styles.c2}>{line.description}</Text>
            <Text style={styles.c3}>{line.hsn}</Text>
            <Text style={styles.c4}>
              {line.qty} {line.unit}
            </Text>
            <Text style={styles.c5}>{money(line.rate)}</Text>
            <Text style={styles.c6}>{money(line.amount)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalLine}>
            <Text style={styles.bold}>TOTAL</Text>
            <Text style={styles.bold}>{money(bill.taxable_total)}</Text>
          </View>
          {Object.values(gstGroups).map((g) => (
            <View key={g.rate}>
              <View style={styles.totalLine}>
                <Text>CGST@{g.rate}%</Text>
                <Text>{money(g.cgst)}</Text>
              </View>
              <View style={styles.totalLine}>
                <Text>SGST@{g.rate}%</Text>
                <Text>{money(g.sgst)}</Text>
              </View>
            </View>
          ))}
          <View style={styles.totalLine}>
            <Text>R.Off(+/-)</Text>
            <Text>{money(bill.round_off)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.bold}>TOTAL AMOUNT</Text>
            <Text style={styles.bold}>{money(bill.grand_total)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Amount Chargeable (In Words)</Text>
          <Text style={{ marginTop: 4 }}>{bill.amount_in_words}</Text>
        </View>

        <View style={styles.bank}>
          <Text>Name On A/C:- {company.bank_account_name || company.business_name}</Text>
          <Text style={{ marginTop: 3 }}>A/C NO:- {company.bank_account_no || '-'}</Text>
          <Text style={{ marginTop: 3 }}>Bank Name:- {company.bank_name || '-'}</Text>
          <Text style={{ marginTop: 3 }}>IFSC CODE:- {company.bank_ifsc || '-'}</Text>
        </View>

        <Text style={[styles.footer, styles.bold]}>{company.business_name || 'IDEAL ENERGY'}</Text>
        <Text style={styles.footer}>This Is A Computer Generated Invoice</Text>
      </Page>
    </Document>
  )
}
