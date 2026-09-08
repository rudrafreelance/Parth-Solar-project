import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatInrPlain, hsnTaxBreakdown } from '../lib/billingMath'

const styles = StyleSheet.create({
  page: { padding: 22, fontSize: 8, fontFamily: 'Helvetica', color: '#111' },
  bold: { fontFamily: 'Helvetica-Bold' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  small: { fontSize: 7, color: '#333' },
  box: { borderWidth: 1, borderColor: '#222', padding: 6 },
  grid2: { flexDirection: 'row', gap: 6, marginTop: 6 },
  col: { flex: 1 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  metaItem: { width: '48%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#222',
    paddingVertical: 4,
    paddingHorizontal: 3,
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  cSr: { width: '5%' },
  cDesc: { width: '30%' },
  cHsn: { width: '12%' },
  cQty: { width: '12%' },
  cRate: { width: '13%' },
  cPer: { width: '8%' },
  cAmt: { width: '20%', textAlign: 'right' },
  right: { textAlign: 'right' },
  section: { marginTop: 8 },
  hsnHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#222',
    paddingVertical: 3,
    paddingHorizontal: 2,
    marginTop: 6,
  },
  hsnRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  footer: { marginTop: 10, fontSize: 7, color: '#444' },
})

function money(v) {
  return formatInrPlain(v)
}

/** Purchase tax-invoice layout inspired by Gurukrupa sample (IRN + HSN tax table). */
export default function PurchaseInvoiceDoc({ company, bill, lines }) {
  const breakdown = hsnTaxBreakdown(lines)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Tax Invoice</Text>
          <Text style={styles.small}>e-Invoice</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.small}>IRN : {bill.irn || '-'}</Text>
          <Text style={styles.small}>Ack No. : {bill.ack_no || '-'}</Text>
          <Text style={styles.small}>Ack Date : {bill.ack_date || '-'}</Text>
        </View>

        <View style={styles.grid2}>
          <View style={[styles.box, styles.col]}>
            <Text style={styles.bold}>{bill.party_name}</Text>
            <Text style={styles.small}>{bill.party_address || '-'}</Text>
            <Text style={styles.small}>GSTIN/UIN: {bill.party_gstin || '-'}</Text>
            <Text style={styles.small}>
              State Name : {bill.party_state_name || 'Gujarat'}, Code : {bill.party_state_code || '24'}
            </Text>
          </View>
          <View style={[styles.box, styles.col]}>
            <Text style={styles.bold}>Buyer (Bill to)</Text>
            <Text style={styles.small}>{company.business_name}</Text>
            <Text style={styles.small}>{company.address}</Text>
            <Text style={styles.small}>GSTIN/UIN : {company.gstin || '-'}</Text>
            <Text style={styles.small}>
              State Name : {company.state_name || 'Gujarat'}, Code : {company.state_code || '24'}
            </Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaItem}>Invoice No. {bill.invoice_no}</Text>
          <Text style={styles.metaItem}>Dated {bill.invoice_date}</Text>
          <Text style={styles.metaItem}>E-Way : {bill.eway_bill_no || '-'}</Text>
          <Text style={styles.metaItem}>Vehicle : {bill.vehicle_no || '-'}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.cSr, styles.bold]}>Sl</Text>
          <Text style={[styles.cDesc, styles.bold]}>Description of Goods</Text>
          <Text style={[styles.cHsn, styles.bold]}>HSN/SAC</Text>
          <Text style={[styles.cQty, styles.bold]}>Quantity</Text>
          <Text style={[styles.cRate, styles.bold]}>Rate</Text>
          <Text style={[styles.cPer, styles.bold]}>per</Text>
          <Text style={[styles.cAmt, styles.bold]}>Amount</Text>
        </View>
        {lines.map((line, index) => (
          <View key={line.id || index} style={styles.tableRow}>
            <Text style={styles.cSr}>{index + 1}</Text>
            <Text style={styles.cDesc}>{line.description}</Text>
            <Text style={styles.cHsn}>{line.hsn}</Text>
            <Text style={styles.cQty}>
              {line.qty} {line.unit}
            </Text>
            <Text style={styles.cRate}>{money(line.rate)}</Text>
            <Text style={styles.cPer}>{line.unit}</Text>
            <Text style={styles.cAmt}>{money(line.amount)}</Text>
          </View>
        ))}

        <View style={[styles.section, { alignItems: 'flex-end' }]}>
          <Text>Taxable {money(bill.taxable_total)}</Text>
          <Text>
            CGST {money(bill.cgst_total)} | SGST {money(bill.sgst_total)}
          </Text>
          <Text>R.Off (+/-) {money(bill.round_off)}</Text>
          <Text style={styles.bold}>Total {money(bill.grand_total)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Amount Chargeable (in words)</Text>
          <Text>{bill.amount_in_words}</Text>
        </View>

        <View style={styles.hsnHeader}>
          <Text style={[{ width: '18%' }, styles.bold]}>HSN/SAC</Text>
          <Text style={[{ width: '18%' }, styles.bold]}>Taxable</Text>
          <Text style={[{ width: '12%' }, styles.bold]}>CGST%</Text>
          <Text style={[{ width: '16%' }, styles.bold]}>CGST Amt</Text>
          <Text style={[{ width: '12%' }, styles.bold]}>SGST%</Text>
          <Text style={[{ width: '16%' }, styles.bold]}>SGST Amt</Text>
          <Text style={[{ width: '8%' }, styles.bold]}>Tax</Text>
        </View>
        {breakdown.map((row) => (
          <View key={`${row.hsn}-${row.cgst_rate}`} style={styles.hsnRow}>
            <Text style={{ width: '18%' }}>{row.hsn || '-'}</Text>
            <Text style={{ width: '18%' }}>{money(row.taxable)}</Text>
            <Text style={{ width: '12%' }}>{row.cgst_rate}%</Text>
            <Text style={{ width: '16%' }}>{money(row.cgst)}</Text>
            <Text style={{ width: '12%' }}>{row.sgst_rate}%</Text>
            <Text style={{ width: '16%' }}>{money(row.sgst)}</Text>
            <Text style={{ width: '8%' }}>{money(row.tax)}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Company’s PAN : {bill.party_gstin ? bill.party_gstin.slice(2, 12) : '-'} (supplier) · Buyer PAN :{' '}
          {company.pan || '-'}
        </Text>
        <Text style={styles.footer}>
          Declaration: We declare that this invoice shows the actual price of the goods described and that all
          particulars are true and correct. Subject to Ahmedabad Jurisdiction.
        </Text>
        <Text style={[styles.footer, styles.bold]}>This is a Computer Generated Invoice</Text>
      </Page>
    </Document>
  )
}
