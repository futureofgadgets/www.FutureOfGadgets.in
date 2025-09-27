"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Item {
  id: string;
  name: string;
  type: string;
  description: string;
  coverImage: string;
  images: string[];
  price: string; // <-- add this line
  brand?: string;
}

// Zod schema for validation
const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().url("Must be a valid URL"),
  images: z.string().min(1, "At least one image is required"),
  price: z.string().min(1, "Price is required"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function ItemFormWithList() {
  const [items, setItems] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      coverImage: "",
      images: "",
      price: "",
    },
  });

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("items") || "[]");
    setItems(stored);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Submit handler
  const onSubmit = (data: ItemFormValues) => {
    const item: Item = {
      id: editId || Date.now().toString(),
      name: data.name,
      type: data.type,
      description: data.description,
      coverImage: data.coverImage,
      images: data.images.split(",").map((img) => img.trim()),
      price: data.price, // <-- FIXED
    };

    if (editId) {
      setItems(items.map((it) => (it.id === editId ? item : it)));
      toast.success("Item updated successfully!", {
        style: { background: "#fff", color: "#22c55e" },
      });
    } else {
      setItems([...items, item]);
      toast.success("Item added successfully!", {
        style: { background: "#fff", color: "#22c55e" }, // Tailwind green-500
      });
    }

    setEditId(null);
    form.reset({
      name: "",
      type: "",
      description: "",
      coverImage: "",
      images: "",
      price: "",
    });
  };

  const handleEdit = (item: Item) => {
    form.reset({
      name: item.name,
      type: item.type,
      description: item.description,
      coverImage: item.coverImage,
      images: item.images.join(", "),
      price: item.price,
    });
    setEditId(item.id);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item deleted successfully!", {
      style: { background: "#fff", color: "#ef4444" },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* --- Item List Section --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Added Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <h3 className="font-semibold">₹{item.price}</h3>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit this item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to edit this item? You can update its details on the next screen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleEdit(item)}
                          className="bg-blue-600"
                        >
                          Edit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* --- Form Section --- */}
      <div className="sticky top-10 max-h-[90vh] overflow-y-auto p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Item" : "Add Item"}
        </h2>

        {/* Success Message */}
        {/* {successMessage && (
          <div
            className={`text-sm font-medium px-4 py-2 rounded-md mb-4 border ${
              successMessage.includes("added")
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }`}
          >
            {successMessage}
          </div>
        )} */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Shirt, Pant, Shoes, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Item description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Additional Images (comma separated URLs)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://img1.jpg, https://img2.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (INR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1299" {...field} className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer">
                {editId ? "Update Item" : "Add Item"}
              </Button>
              {editId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setEditId(null);
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
