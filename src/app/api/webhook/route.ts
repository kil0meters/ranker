import { Webhook } from "svix";
import { db } from "@/dbconfig";

const webhookSecret: string = process.env.WEBHOOK_SECRET!;

export const runtime = "edge";

function formatName(first: string, last: string, username: string): string {
    if (!last && !first) {
        return username;
    }

    if (!last) {
        return first;
    }

    if (!first) {
        return last;
    }

    return `${first} ${last}`
}

export async function POST(
    req: Request
) {
    const payload = await req.text();
    const wh = new Webhook(webhookSecret);

    const heads = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };

    const verified = wh.verify(payload, heads) as any;

    if (verified.type === "user.created" || verified.type === "user.updated") {
        const values = {
            id: verified.data.id,
            name: formatName(verified.data.first_name, verified.data.last_name, verified.data.username),
            username: verified.data.username as string
        };

        await db.insertInto("User").values(values).onDuplicateKeyUpdate(values).execute();
    }

    return new Response("", {
        status: 201,
    })
}
