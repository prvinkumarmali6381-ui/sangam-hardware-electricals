export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Sending to Apps Script:", {
  action: data.action,
  row: data.row,
  product: data.product,
  price: data.price,
  image: data.image,
  category: data.category,
}); 

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxzALbvns73sxw9yZe0y9cD1IzCahTD-V8QN4-nzl9vKDkJhcKm7ubUlCX2wmieMzuByA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  action: data.action,
  row: data.row,
  product: data.product,
  price: data.price,
  image: data.image,
  category: data.category,
}),
      }
    );

    const text = await response.text();

console.log("Google Response:", text);

return Response.json({
  success: true,
  google: text,
});

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}