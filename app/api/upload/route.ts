import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzR61KAFLt8329jqzRfjuNB8LXOxNsvLQyyUm8Q7ZWpd6348ZA9EDBAnDL8-kY5YeTBEA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}