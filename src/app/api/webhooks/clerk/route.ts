import { verifyWebhook } from "@clerk/backend/webhooks";
import { type NextRequest, NextResponse } from "next/server";
import { createUser } from "@/db/queries";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    console.log(`Clerk Webhook received: ${evt.type}`);

    if (evt.type === "user.created") {
      const user = await createUser(evt.data.id);
      if (!user) return NextResponse.json({ success: false });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
