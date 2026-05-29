import emailjs from "@emailjs/browser";

const SERVICE_ID = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Generate a unique order ID like "ORD-20260529-A3K8"
 */
export function generateOrderId(): string {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

/**
 * Calculate estimated delivery date: 3 days from now at 12:00 AM.
 * Returns a formatted string like "Saturday, June 14th, 2026 at 12:00 AM"
 */
export function getEstimatedDeliveryDate(): string {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + 3);
  // Set to midnight (12:00 AM)
  delivery.setHours(0, 0, 0, 0);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = dayNames[delivery.getDay()];
  const monthName = monthNames[delivery.getMonth()];
  const day = delivery.getDate();
  const year = delivery.getFullYear();

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const ordinal = getOrdinalSuffix(day);

  return `${dayName}, ${monthName} ${day}${ordinal}, ${year} at 12:00 AM`;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
  notes?: string;
}

/**
 * Build the HTML for order details section in the email.
 */
function buildOrderDetailsHtml(items: OrderItem[], totalPrice: string): string {
  let html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;">`;
  html += `<tr style="background:#f8f9fa;border-bottom:2px solid #eee;">
    <th style="text-align:left;padding:12px;font-size:14px;">Product</th>
    <th style="text-align:center;padding:12px;font-size:14px;">Qty</th>
    <th style="text-align:right;padding:12px;font-size:14px;">Price</th>
  </tr>`;

  items.forEach((item) => {
    html += `<tr style="border-bottom:1px solid #eee;">
      <td style="padding:12px;font-size:14px;">${item.name}</td>
      <td style="text-align:center;padding:12px;font-size:14px;">${item.quantity}</td>
      <td style="text-align:right;padding:12px;font-size:14px;font-weight:bold;">${item.price}</td>
    </tr>`;
  });

  html += `<tr style="background:#f8f9fa;">
    <td colspan="2" style="padding:12px;font-weight:bold;font-size:15px;">Total</td>
    <td style="text-align:right;padding:12px;font-weight:bold;font-size:15px;color:#c1272d;">${totalPrice} MAD</td>
  </tr>`;
  html += `</table>`;

  return html;
}

/**
 * Send order confirmation email via EmailJS.
 */
export async function sendOrderConfirmationEmail(params: {
  orderId: string;
  items: OrderItem[];
  totalPrice: string;
  shipping: ShippingInfo;
  deliveryDate: string;
}): Promise<void> {
  const { orderId, items, totalPrice, shipping, deliveryDate } = params;

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS configuration is missing. Please check your .env file for VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.",
    );
  }

  const orderDetailsHtml = buildOrderDetailsHtml(items, totalPrice);

  const templateParams = {
    order_id: orderId,
    customer_name: shipping.fullName,
    customer_email: shipping.email,
    customer_phone: shipping.phone,
    customer_address: shipping.address,
    customer_city: shipping.city,
    customer_zip: shipping.zipCode || "N/A",
    customer_notes: shipping.notes || "None",
    order_details: orderDetailsHtml,
    total_price: `${totalPrice} MAD`,
    delivery_date: deliveryDate,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}
