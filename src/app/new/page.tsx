"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Ranking } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRanking() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [items, setItems] = useState<string[]>([]);

    const createPost = async () => {
        const data: Ranking = await (await fetch("/api/createranking", {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
                items
            })
        })).json();

        router.push(`/rank/${data.id}`);
    };

    return (
        <main className="container mx-auto">
            <div className='flex grid-cols-2 gap-4 border-neutral-300 rounded p-4 flex-col border'>
                <h1 className="font-bold text-3xl">Create ranking</h1>

                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="ranking name" />

                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />

                <Label htmlFor="items">Items</Label>
                <Textarea
                    id="items"
                    className="h-64"
                    value={items.join("\n")}
                    onChange={(e) => setItems(e.target.value.trim().replace(/(\n\s*){2,}/g, '\n').split("\n"))}
                    placeholder="items"
                />

                <Button onClick={createPost}>Submit</Button>
            </div>
        </main>
    )
}
