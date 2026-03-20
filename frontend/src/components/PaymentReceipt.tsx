import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReceiptData {
  id: string;
  plan: string;
  status: string;
  amount_paid: number;
  currency: string;
  start_date: string;
  end_date: string | null;
  payment_method: string | null;
  payment_gateway: string | null;
  transaction_id: string | null;
  created_at: string;
}

const generateReceiptHTML = (sub: ReceiptData, userEmail: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Receipt - Poultry Connect</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #16a34a; margin: 0; font-size: 24px; }
    .header p { color: #666; margin: 5px 0 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-expired { background: #f3f4f6; color: #6b7280; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .details td:first-child { font-weight: 600; color: #374151; width: 40%; }
    .details td:last-child { color: #6b7280; }
    .amount { text-align: center; margin: 30px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; }
    .amount .value { font-size: 32px; font-weight: bold; color: #16a34a; }
    .amount .label { color: #666; font-size: 14px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🐔 Poultry Connect</h1>
    <p>Payment Receipt</p>
  </div>
  <div class="amount">
    <div class="label">Amount Paid</div>
    <div class="value">₹${sub.amount_paid}</div>
    <div class="label">${sub.currency.toUpperCase()}</div>
  </div>
  <table class="details">
    <tr><td>Receipt ID</td><td>${sub.id.slice(0, 8).toUpperCase()}</td></tr>
    <tr><td>Plan</td><td>${sub.plan}</td></tr>
    <tr><td>Status</td><td><span class="badge ${sub.status === 'active' ? 'badge-active' : 'badge-expired'}">${sub.status}</span></td></tr>
    <tr><td>Email</td><td>${userEmail}</td></tr>
    <tr><td>Start Date</td><td>${new Date(sub.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
    ${sub.end_date ? `<tr><td>End Date</td><td>${new Date(sub.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>` : ''}
    ${sub.payment_gateway ? `<tr><td>Payment Gateway</td><td>${sub.payment_gateway}</td></tr>` : ''}
    ${sub.payment_method ? `<tr><td>Payment Method</td><td>${sub.payment_method}</td></tr>` : ''}
    ${sub.transaction_id ? `<tr><td>Transaction ID</td><td>${sub.transaction_id}</td></tr>` : ''}
    <tr><td>Date of Payment</td><td>${new Date(sub.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td></tr>
  </table>
  <div class="footer">
    <p>This is a computer-generated receipt and does not require a signature.</p>
    <p>Poultry Connect &copy; ${new Date().getFullYear()}</p>
  </div>
</body>
</html>`;

export const downloadReceipt = (sub: ReceiptData, userEmail: string) => {
  const html = generateReceiptHTML(sub, userEmail);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${sub.id.slice(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

interface DownloadReceiptButtonProps {
  subscription: ReceiptData;
  userEmail: string;
}

export const DownloadReceiptButton = ({ subscription, userEmail }: DownloadReceiptButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => downloadReceipt(subscription, userEmail)}
    className="text-green-600 hover:text-green-700 text-xs gap-1"
  >
    <Download className="h-3 w-3" />
    Download Bill
  </Button>
);
