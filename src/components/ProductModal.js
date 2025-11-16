import React, { useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import CommentsSection from "./CommentsSection";

export default function ProductModal({ product, user, onClose }) {
  const [current, setCurrent] = useState(0);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [available, setAvailable] = useState(product?.available ?? true);
  const [holiday, setHoliday] = useState(product?.holidaySpecial ?? false);
  const [tiktok, setTiktok] = useState(product?.tiktokLink || "");
  const [images, setImages] = useState(product?.images || []);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  if (!product) return null;

  const next = () => setCurrent((c) => (c + 1) % Math.max(1, images.length));
  const prev = () =>
    setCurrent((c) => (c - 1 + images.length) % Math.max(1, images.length));

  const handleSave = async () => {
    setSaving(true);
    try {
      const pRef = doc(db, "products", product.id);
      await updateDoc(pRef, {
        name,
        description,
        price: Number(price),
        available,
        holidaySpecial: holiday,
        tiktokLink: tiktok || null,
      });
      setSaving(false);
      setEditing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save product", err);
      setSaving(false);
    }
  };

  const handleDeleteImage = async (idx) => {
    const nextImages = images.filter((_, i) => i !== idx);
    try {
      const pRef = doc(db, "products", product.id);
      await updateDoc(pRef, { images: nextImages });
      setImages(nextImages);
      setCurrent((c) => Math.max(0, Math.min(c, nextImages.length - 1)));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete image", err);
    }
  };

  const handleReplaceImage = async (idx, file) => {
    try {
      const filename = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const path = `products/${
        user?.uid || "anon"
      }/${Date.now()}_${idx}_${filename}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      const nextImages = images.slice();
      nextImages[idx] = url;
      const pRef = doc(db, "products", product.id);
      await updateDoc(pRef, { images: nextImages });
      setImages(nextImages);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to replace image", err);
    }
  };

  const handleAddImages = async (files) => {
    if (!files || files.length === 0) return;
    try {
      const uploadPromises = Array.from(files).map((f, idx) => {
        const filename = f.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const path = `products/${
          user?.uid || "anon"
        }/${Date.now()}_add_${idx}_${filename}`;
        const ref = storageRef(storage, path);
        return uploadBytes(ref, f).then(() => getDownloadURL(ref));
      });
      const urls = await Promise.all(uploadPromises);
      const nextImages = [...images, ...urls];
      const pRef = doc(db, "products", product.id);
      await updateDoc(pRef, { images: nextImages });
      setImages(nextImages);
      setCurrent(images.length); // jump to first new
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to add images", err);
    }
  };

  const handleFileChangeReplace = (e) => {
    const file = e.target.files?.[0];
    if (file == null) return;
    handleReplaceImage(current, file);
    e.target.value = null;
  };

  const handleFileChangeAdd = (e) => {
    const files = e.target.files;
    handleAddImages(files);
    e.target.value = null;
  };

  const handleDeleteAllImages = async () => {
    try {
      const pRef = doc(db, "products", product.id);
      await updateDoc(pRef, { images: [] });
      setImages([]);
      setCurrent(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete all images", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-11/12 max-w-4xl max-h-[90vh] overflow-auto rounded">
        <div className="p-4 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.price} €</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
              Aizvērt
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="w-full mb-2">
              {images && images.length > 0 ? (
                <div className="w-full aspect-square rounded overflow-hidden relative">
                  <img
                    src={images[current]}
                    alt={product.name}
                    className="w-full h-full object-contain bg-black"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded"
                      >
                        ‹
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center">
                  Nav attēla
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <input
                ref={fileRef}
                onChange={handleFileChangeReplace}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1 rounded bg-yellow-100"
              >
                Mainīt attēlu
              </button>
              <input
                onChange={handleFileChangeAdd}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="add-files"
              />
              <label
                htmlFor="add-files"
                className="px-3 py-1 rounded bg-green-200 cursor-pointer"
              >
                Pievienot attēlu
              </label>
              <button
                onClick={() => handleDeleteImage(current)}
                className="px-3 py-1 rounded bg-red-100"
              >
                Noņemt attēlu
              </button>
              <button
                onClick={handleDeleteAllImages}
                className="px-3 py-1 rounded bg-gray-100"
              >
                Noņemt visus
              </button>
            </div>

            {images && images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto mt-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-20 h-20 rounded overflow-hidden border ${
                      i === current ? "ring-2 ring-green-300" : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {!editing ? (
              <div>
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="mt-2 whitespace-pre-wrap">
                  {product.description}
                </p>
                {product.tiktokLink && (
                  <p className="mt-2">
                    <a
                      href={product.tiktokLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Atvērt TikTok
                    </a>
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 rounded bg-gray-100">
                    {available ? "Pieejams" : "Pārdots"}
                  </span>
                  {holiday && (
                    <span className="px-2 py-1 rounded bg-yellow-100">
                      Svētku piedāvājums
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  {user && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-3 py-1 rounded bg-blue-500 text-white"
                    >
                      Rediģēt
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm">Nosaukums</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <label className="block text-sm">Cena (€)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <label className="block text-sm">Apraksts</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full border rounded px-3 py-2"
                />
                <label className="block text-sm">TikTok saite</label>
                <input
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                    />{" "}
                    Pieejams
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={holiday}
                      onChange={(e) => setHoliday(e.target.checked)}
                    />{" "}
                    Svētku piedāvājums
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1 rounded bg-green-600 text-white"
                  >
                    Saglabāt
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1 rounded bg-gray-200"
                  >
                    Atcelt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-6">
          <CommentsSection productId={product.id} />
        </div>
      </div>
    </div>
  );
}
