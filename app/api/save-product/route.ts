import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Data payload structure
    const payload = {
      action: data.action || "add",
      row: data.row || null,
      product: data.product || "",
      price: data.price || "",
      image: data.image ? data.image.trim() : "",
      category: data.category || "hardware",
    };

    console.log("Sending to Apps Script:", payload);

    // Verified Active Google Apps Script Web App URL
    const googleScriptUrl =
      "https://script.google.com/macros/s/AKfycbzOH-l4pi_G9CoqiZ7Ah9LkyGP_LP9ob_PyTArLcNIv1DmC9UVC2v2gxUw8IJkETNXFUA/exec";

    // Google Apps Script requires text/plain to prevent CORS and redirect errors
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await response.text();
    console.log("Google Apps Script Response:", text);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      parsedResponse = { success: true, responseText: text };
    }

    return NextResponse.json({
      success: true,
      google: parsedResponse,
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      {
        status: 500,
      }
    );
  }
}