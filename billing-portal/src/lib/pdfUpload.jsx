import { pdf } from '@react-pdf/renderer'
import SaleInvoiceDoc from '../pdf/SaleInvoiceDoc'
import PurchaseInvoiceDoc from '../pdf/PurchaseInvoiceDoc'
import { BILL_PDF_BUCKET, supabase } from '../supabaseClient'

export async function generateAndUploadBillPdf({ userId, company, bill, lines, existingPath }) {
  const Doc = bill.bill_type === 'purchase' ? PurchaseInvoiceDoc : SaleInvoiceDoc
  const blob = await pdf(<Doc company={company} bill={bill} lines={lines} />).toBlob()

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
