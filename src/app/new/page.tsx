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
		if (items.length > 0 && items[items.length - 1] === "") {
			items.pop();
		}

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

	const addItem = () => {
		setItems([...items, ""]);
	};

	const removeItem = (index: number) => {
		const newItems = items.filter((_, i) => i !== index);
		setItems(newItems);
	};

	const updateItem = (value: string, index: number) => {
		const newItems = items.map((item, i) => (i === index ? value : item));
		setItems(newItems);
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
				{items.map((item, index) => (
					<div key={index} className="flex items-center">
						<Input
							className="flex-grow"
							value={item}
							onChange={(e) => updateItem(e.target.value, index)}
							type="text"
							placeholder={`Item ${index + 1}`}
						/>
						<button
							className="ml-2 text-red-500 focus:outline-none"
							onClick={() => removeItem(index)}
						>
							X
						</button>
					</div>
				))}
				<button
					className="mt-2 mb-4 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
					onClick={addItem}
				>
					Add Item
				</button>

				<Button onClick={createPost}>Submit</Button>
			</div>
		</main>
	)
}
