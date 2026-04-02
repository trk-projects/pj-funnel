import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID              = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY           = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      service,
      location,
      drivewaySize,
      windowCount,
    } = body;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "short",
      timeStyle: "short",
    });

    const serviceLabel =
      service === "pressure"
        ? "Pressure Washing"
        : service === "window"
        ? "Window Washing"
        : "Both Services";

    // Append to Google Sheets if credentials are configured
    if (SHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: SERVICE_ACCOUNT_EMAIL,
          private_key: PRIVATE_KEY,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Row: Timestamp | Name | Phone | Email | Service | Location | Driveway Size | Window Count
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Leads!A:H",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              timestamp,
              name || "",
              phone || "",
              email || "",
              serviceLabel || "",
              location || "",
              drivewaySize || "",
              windowCount || "",
            ],
          ],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json({ success: true, warning: "Sheet write failed" });
  }
}
