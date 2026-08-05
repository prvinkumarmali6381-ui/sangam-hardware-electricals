import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Cleaning data before sending
    const payload = {
      action: data.action,
      row: data.row,
      product: data.product,
      price: data.price,
      image: data.image ? data.image.trim() : "",
      category: data.category,
    };

    console.log("Sending to Apps Script:", payload);

    // Google Apps Script Web App URL
    const googleScriptUrl =
      "https://script.google.com/macros/s/AKfycbxzALbvns73sxw9yZe0y9cD1IzCahTD-V8QN4-nzl9vKDkJhcKm7ubUlCX2wmieMzuByA/exec";

    // Fetching data from Google Apps Script
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow", // Follows Google Apps Script 302 redirects automatically
    });

    const text = await response.text();
    console.log("Google Response:", text);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      parsedResponse = text;
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