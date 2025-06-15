// app/api/quote/route.js
export async function GET() {
  try {
    const response = await fetch("https://zenquotes.io/api/today", {
      headers: {
        "User-Agent": "MyApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    return Response.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
