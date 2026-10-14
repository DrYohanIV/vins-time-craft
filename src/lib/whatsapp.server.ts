type SendWhatsAppInput = {
  phone: string;
  text: string;
  apiKey: string;
};

export async function sendWhatsAppMessage({ phone, text, apiKey }: SendWhatsAppInput) {
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`CallMeBot request failed (${res.status})`);
  }
  return res.text();
}
