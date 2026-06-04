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
 * Calculate estimated delivery date: 2 days from now.
 */
export function getEstimatedDeliveryDate(lang: string = "fr"): string {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + 2);
  delivery.setHours(0, 0, 0, 0);

  if (lang === "en") {
    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const dayName = dayNames[delivery.getDay()];
    const monthName = monthNames[delivery.getMonth()];
    const day = delivery.getDate();
    const year = delivery.getFullYear();
    const ordinal = getOrdinalSuffix(day);
    return `${dayName}, ${monthName} ${day}${ordinal}, ${year}`;
  } else {
    const dayNamesFr = [
      "Dimanche", "Lundi", "Mardi", "Mercredi",
      "Jeudi", "Vendredi", "Samedi",
    ];
    const monthNamesFr = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];
    const dayName = dayNamesFr[delivery.getDay()];
    const monthName = monthNamesFr[delivery.getMonth()];
    const day = delivery.getDate();
    const year = delivery.getFullYear();
    return `${dayName} ${day} ${monthName} ${year}`;
  }
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
  phone: string;
  address: string;
  city: string;
}

/**
 * Build the HTML for order details section in the email.
 */
function buildOrderDetailsHtml(items: OrderItem[], totalPrice: string, lang: string = "fr"): string {
  const isFr = lang === "fr";
  const productHeader = isFr ? "Produit" : "Product";
  const qtyHeader = isFr ? "Qté" : "Qty";
  const priceHeader = isFr ? "Prix" : "Price";
  const totalLabel = isFr ? "Total" : "Total";

  let html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;">`;
  html += `<tr style="background:#f8f9fa;border-bottom:2px solid #eee;">
    <th style="text-align:left;padding:12px;font-size:14px;">${productHeader}</th>
    <th style="text-align:center;padding:12px;font-size:14px;">${qtyHeader}</th>
    <th style="text-align:right;padding:12px;font-size:14px;">${priceHeader}</th>
  </tr>`;

  items.forEach((item) => {
    html += `<tr style="border-bottom:1px solid #eee;">
      <td style="padding:12px;font-size:14px;">${item.name}</td>
      <td style="text-align:center;padding:12px;font-size:14px;">${item.quantity}</td>
      <td style="text-align:right;padding:12px;font-size:14px;font-weight:bold;">${item.price}</td>
    </tr>`;
  });

  html += `<tr style="background:#f8f9fa;">
    <td colspan="2" style="padding:12px;font-weight:bold;font-size:15px;">${totalLabel}</td>
    <td style="text-align:right;padding:12px;font-weight:bold;font-size:15px;color:#c1272d;">${totalPrice} MAD</td>
  </tr>`;
  html += `</table>`;

  return html;
}

/**
 * Send order notification email via EmailJS (admin only).
 */
export async function sendOrderConfirmationEmail(params: {
  orderId: string;
  items: OrderItem[];
  totalPrice: string;
  shipping: ShippingInfo;
  deliveryDate: string;
  toEmail: string;
  subject: string;
  greeting: string;
  messageIntro: string;
  lang?: string;
}): Promise<void> {
  const {
    orderId,
    items,
    totalPrice,
    shipping,
    deliveryDate,
    toEmail,
    subject,
    greeting,
    messageIntro,
    lang = "fr",
  } = params;

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS configuration is missing. Please check your .env file.",
    );
  }

  const orderDetailsHtml = buildOrderDetailsHtml(items, totalPrice, lang);

  const templateParams = {
    to_email: toEmail,
    subject: subject,
    greeting: greeting,
    message_intro: messageIntro,
    order_id: orderId,
    customer_name: shipping.fullName,
    customer_phone: shipping.phone,
    customer_address: shipping.address,
    customer_city: shipping.city,
    order_details: orderDetailsHtml,
    total_price: `${totalPrice} MAD`,
    delivery_date: deliveryDate,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}

/**
 * Save order details to Google Sheets using Apps Script Web App.
 * Sends a flat named object — keys map 1-to-1 to sheet column headers.
 */
export async function saveOrderToGoogleSheets(orderData: {
  orderId: string;
  items: OrderItem[];
  totalPrice: string;
  shipping: ShippingInfo;
  deliveryDate: string;
}): Promise<void> {
  const webhookUrl = (import.meta as any).env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Google Sheets Webhook URL is missing from .env");
    return;
  }

  // Build a readable products string: "Samsung TV x1, Sony Headphones x2"
  const productsString = orderData.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(", ");

  // Flat payload — matches current sheet columns exactly:
  // Order ID | Customer Name | Phone | Address | City |
  // Products Ordered | Total Price | Estimated Delivery | Date Placed | Delivered
  const payload = {
    orderId:           orderData.orderId,
    customerName:      orderData.shipping.fullName,
    phone:             orderData.shipping.phone,
    address:           orderData.shipping.address,
    city:              orderData.shipping.city,
    products:          productsString,
    totalPrice:        `${orderData.totalPrice} MAD`,
    estimatedDelivery: orderData.deliveryDate,
    datePlaced:        new Date().toLocaleString("fr-MA"),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // Prevents CORS preflight with Apps Script
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to save order to Google Sheets: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error occurred while sending order to Google Sheets:", error);
    throw error;
  }
}

export interface ContactInquiryData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  organization?: string;
  inquiryPurpose: string;
  description: string;
  message: string;
}

/**
 * Send contact form submission email via EmailJS.
 */
export async function sendContactInquiryEmail(inquiry: ContactInquiryData): Promise<void> {
  const CONTACT_TEMPLATE_ID = (import.meta as any).env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;

  if (!SERVICE_ID || !CONTACT_TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS contact configuration is missing. Please check your .env file."
    );
  }

  const templateParams = {
    fullName: inquiry.fullName,
    email: inquiry.email,
    phoneNumber: inquiry.phoneNumber || "N/A",
    organization: inquiry.organization || "N/A",
    inquiryPurpose: inquiry.inquiryPurpose,
    description: inquiry.description,
    message: inquiry.message,
    to_email: "datamgt2023@gmail.com",
  };

  await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, PUBLIC_KEY);
}
