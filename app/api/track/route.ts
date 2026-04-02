import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID              = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY           = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const STEP_NAMES: Record<number, string> = {
  1: "Landing Page",
  2: "Location",
  3: "Job Size",
  4: "Contact Info",
  5: "Booking",
};

async function ensureSheetsExist(sheets: ReturnType<typeof google.sheets>) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID! });
  const existing = (meta.data.sheets ?? []).map((s) => s.properties?.title);

  const toCreate: string[] = [];
  if (!existing.includes("Events"))   toCreate.push("Events");
  if (!existing.includes("Dashboard")) toCreate.push("Dashboard");

  if (toCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID!,
      requestBody: {
        requests: toCreate.map((title) => ({
          addSheet: { properties: { title } },
        })),
      },
    });
  }

  // Write Events headers if the sheet is empty
  const eventsCheck = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID!,
    range: "Events!A1",
  });
  if (!eventsCheck.data.values) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID!,
      range: "Events!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Timestamp", "Session ID", "Step #", "Step Name"]],
      },
    });
  }

  // Write Dashboard if it's empty
  const dashCheck = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID!,
    range: "Dashboard!A1",
  });
  if (!dashCheck.data.values) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID!,
      range: "Dashboard!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["Step", "Page", "Views", "% of Landing", "Step Drop-off"],
          [1, "Landing Page",  '=COUNTIF(Events!C:C,1)', "100%",                               "—"],
          [2, "Location",      '=COUNTIF(Events!C:C,2)', '=IFERROR(C3/C2,0)',                  '=IFERROR(1-C3/C2,0)'],
          [3, "Job Size",      '=COUNTIF(Events!C:C,3)', '=IFERROR(C4/C2,0)',                  '=IFERROR(1-C4/C3,0)'],
          [4, "Contact Info",  '=COUNTIF(Events!C:C,4)', '=IFERROR(C5/C2,0)',                  '=IFERROR(1-C5/C4,0)'],
          [5, "Booking",       '=COUNTIF(Events!C:C,5)', '=IFERROR(C6/C2,0)',                  '=IFERROR(1-C6/C5,0)'],
          [],
          ["", "Total leads captured (step 4+):", '=COUNTIF(Events!C:C,4)+COUNTIF(Events!C:C,5)'],
          ["", "Booking conversion rate:",         '=IFERROR(C6/C2,0)'],
        ],
      },
    });

    // Format % columns (D and E) as percentages
    const dashMeta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID! });
    const dashSheet = dashMeta.data.sheets?.find((s) => s.properties?.title === "Dashboard");
    const dashSheetId = dashSheet?.properties?.sheetId;

    if (dashSheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID!,
        requestBody: {
          requests: [
            // Format D3:E7 and D10 as percentage
            {
              repeatCell: {
                range: { sheetId: dashSheetId, startRowIndex: 1, endRowIndex: 6, startColumnIndex: 3, endColumnIndex: 5 },
                cell: { userEnteredFormat: { numberFormat: { type: "PERCENT", pattern: "0.0%" } } },
                fields: "userEnteredFormat.numberFormat",
              },
            },
            {
              repeatCell: {
                range: { sheetId: dashSheetId, startRowIndex: 8, endRowIndex: 9, startColumnIndex: 2, endColumnIndex: 3 },
                cell: { userEnteredFormat: { numberFormat: { type: "PERCENT", pattern: "0.0%" } } },
                fields: "userEnteredFormat.numberFormat",
              },
            },
            // Bold header row
            {
              repeatCell: {
                range: { sheetId: dashSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 5 },
                cell: { userEnteredFormat: { textFormat: { bold: true } } },
                fields: "userEnteredFormat.textFormat.bold",
              },
            },
          ],
        },
      });
    }
  }
}

export async function POST(req: NextRequest) {
  if (!SHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    return NextResponse.json({ ok: false });
  }

  try {
    const { step, session_id } = await req.json();
    if (!step) return NextResponse.json({ ok: false });

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: SERVICE_ACCOUNT_EMAIL, private_key: PRIVATE_KEY },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await ensureSheetsExist(sheets);

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "short",
      timeStyle: "short",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Events!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, session_id ?? "", step, STEP_NAMES[step] ?? ""]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ ok: false });
  }
}
