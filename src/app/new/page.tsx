"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import './exclamation-mark.css';



export const runtime = "experimental-edge";

export default function NewRanking() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [items, setItems] = useState<string[]>([""]);

    const [loading, setLoading] = useState(false);

    const createPost = async () => {
        if (loading) return;

        const itemsFiltered = items.filter(item => item.trim() !== "");
        setLoading(true);

        try {
            const data: { id: string } = await (await fetch("/api/createranking", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    description,
                    items: itemsFiltered
                })
            })).json();

            router.push(`/rank/${data.id}`);
        } catch {
            setLoading(false);
        }
    };

    const addItem = () => {
        setItems([...items, ""]);
        setFocusIndex(items.length);
    };

    const removeItem = (index: number) => {
        if (items.length <= 1) {
            updateItem("", index);
            return;
        }
    
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const updateItem = (value: string, index: number) => {
        const newItems = items.map((item, i) => (i === index ? value : item));
        setItems(newItems);
    };

    const addItemOnEnter = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
        if (e.key === "Enter") {
          e.preventDefault();
      
          const emptyIndexBelow = items.findIndex((item, index) => index > currentIndex && item.trim() === "");
      
          if (emptyIndexBelow !== -1) {
            setFocusIndex(emptyIndexBelow);
          } else {
            addItem();
          }
        }
      };
      
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    const removeItemOnBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const inputIsEmpty = e.currentTarget.value === "";
      
        if (e.key === "Backspace" && inputIsEmpty && items.length > 1) {
          e.preventDefault();
          let newIndex: number | null = null;
          if (index > 0) {
            newIndex = index - 1;
          } else if (index === 0 && items.length > 1) {
            newIndex = index;
          }
          removeItem(index);
          setFocusIndex(newIndex);
        }
      };
       
    useLayoutEffect(() => {
        if (focusIndex !== null && focusIndex < items.length) {
            const inputRef = document.getElementById(`item-${focusIndex}`);
            if (inputRef) {
                (inputRef as HTMLInputElement).focus();
                (inputRef as HTMLInputElement).setSelectionRange(
                    (inputRef as HTMLInputElement).value.length,
                    (inputRef as HTMLInputElement).value.length
                );
            }
        }
    }, [focusIndex, items.length]);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const hasDuplicates = useCallback((arr: string[]) => {
        return new Set(arr).size !== arr.length;
    }, []);

    const isDuplicate = useCallback((itemValue: string) => {
        if (itemValue.trim() === "") {
            return false;
        }
        const occurrences = items.filter((item) => item.trim().toLowerCase() === itemValue.trim().toLowerCase()).length;
        return occurrences > 1;
        },
        [items]
    );

    const hasDuplicateItems = useMemo(() => hasDuplicates(items), [hasDuplicates, items]);

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
                    <div key={index} className="flex items-center relative">
                        <Input
                            id={`item-${index}`}
                            className={`flex-grow ${isDuplicate(item) ? "border-red-500 border-2" : ""}`}
                            value={item}
                            onChange={(e) => updateItem(e.target.value, index)}
                            onKeyDown={(e) => {
                                removeItemOnBackspace(e, index);
                                addItemOnEnter(e, index);
                            }}
                            onFocus={() => setFocusIndex(index)}
                            type="text"
                            placeholder={`Item ${index + 1}`}
                        />
                        {isDuplicate(item) && (
                            <span className="exclamation-mark">!&#x20DD;</span>
                        )}
                        <Button
                            variant="destructive"
                            className="ml-2 text-2xl aspect-square"
                            onClick={() => removeItem(index)}
                        >
                            <span style={{position: 'relative', top: '-4px'}}>⨯</span>
                        </Button>
                    </div>
                ))}
                <button
                    className="mt-2 mb-4 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
                    onClick={addItem}
                >
                    Add Item
                </button>
                <Button onClick={createPost} className={`${loading ? "animate-pulse" : ""} ${hasDuplicateItems ? "opacity-50" : ""}`} disabled={hasDuplicateItems}>
                    Submit
                </Button>
            </div>
        </main >
    )
}
