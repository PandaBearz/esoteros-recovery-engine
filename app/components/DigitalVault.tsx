"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Lock, Loader2, Download } from "lucide-react";
import { getVaultItems, uploadVaultItem, deleteVaultItem } from "../actions/vault";

interface VaultItem {
    id: string;
    title: string;
    fileUrl: string;
    category: string;
    createdAt: Date;
}

export default function DigitalVault() {
    const [items, setItems] = useState<VaultItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const fetchedItems = await getVaultItems();
            setItems(fetchedItems);
        } catch (error) {
            console.error("Failed to load vault items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "General"); // Default for now

        setIsUploading(true);
        try {
            await uploadVaultItem(formData);
            await loadItems(); // Refresh list
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please check your Vercel Blob configuration.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        try {
            await deleteVaultItem(id);
            setItems(items.filter((i) => i.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Digital Vault</h3>
                        <p className="text-sm text-slate-500">Secure storage for your documents</p>
                    </div>
                </div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4" />
                    )}
                    Upload
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No documents yet.</p>
                    <p className="text-xs text-slate-400">Upload IDs, records, or certificates.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-white rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
