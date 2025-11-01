import { useMemo, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import Card from "@/components/Card";
import Media from "@/components/Media";
import { useMarketContracts } from "@/hooks/useMarketContracts";
import { useTonConnect } from "@/hooks/useTonConnect";
import { TWA } from "@/lib/twa";
import { CHAIN } from "@tonconnect/ui-react";

const defaultImage =
  "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80";

export default function Seller() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const user = TWA?.initDataUnsafe?.user;

  const { wallet, connected, network } = useTonConnect();
  const { makeShop, shopAddress, shopName, loading } = useMarketContracts();
  const [inputShopName, setInputShopName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateShop = async () => {
    setError(null);
    setSuccess(false);

    try {
      // Создаем магазин с уникальным ID (используем timestamp)
      const id = BigInt(user?.id ?? 0);
      await makeShop(inputShopName, id);

      setSuccess(true);
      setInputShopName("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cardPreview = useMemo(() => {
    return {
      id: "preview",
      title: title || "Untitled item",
      image: imagePreview || defaultImage,
      price: price ? `${price} TON` : undefined,
      badge: "Draft",
    } as const;
  }, [title, price, imagePreview]);

  const handleHighlightChange = (index: number, value: string) => {
    setHighlights((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const addHighlight = () => {
    setHighlights((current) => [...current, ""]);
  };

  const removeHighlight = (index: number) => {
    setHighlights((current) => {
      if (current.length === 1) {
        return current;
      }
      const next = [...current];
      next.splice(index, 1);
      return next;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const nextPreview = URL.createObjectURL(file);
    setImagePreview(nextPreview);
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setHighlights([""]);
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="container pb-24 space-y-6 sm:space-y-8">
      <header className="pt-4 space-y-1">
        <span className="text-[11px] uppercase tracking-[0.16em] text-txt/60">
          Seller console
        </span>
        <h1 className="text-2xl font-semibold">Create product listing</h1>
        <p className="text-sm text-txt/70 sm:max-w-2xl">
          Fill out the product card. Once saved, it will go through moderation
          before appearing in the marketplace.
        </p>
      </header>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-txt/60">
            Create your shop
          </label>
        </div>
        {user ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={inputShopName}
                onChange={(e) => setInputShopName(e.target.value)}
                placeholder="Enter your shop name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleCreateShop}
              disabled={!inputShopName.trim() || loading}
              className={`
                    w-full py-3 px-4 rounded-md font-medium transition-all duration-300
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : success
                        ? "bg-green-500 text-white scale-105"
                        : !inputShopName.trim()
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
                    }
                `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Shop...
                </div>
              ) : success ? (
                "✅ Shop Created!"
              ) : (
                "Create Shop"
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">❌ {error}</p>
              </div>
            )}

            {shopAddress && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ Shop Created Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  <strong>Name:</strong> {shopName}
                </p>
                <p className="text-sm text-green-700 break-all">
                  <strong>Address:</strong> {shopAddress}
                </p>
                <a
                  href={`https://testnet.tonscan.org/address/${shopAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                >
                  View on TON Scan →
                </a>
              </div>
            )}
          </div>
        ) : (
          <p>
            Open inside Telegram to see your account details and manage
            purchases.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <section className="space-y-6">
          <div className="glass rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-txt/60">
                title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Genesis Shard"
                className="w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand/60"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-txt/60">
                  Price (TON)
                </label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="e.g. 12.4"
                  className="w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand/60"
                  inputMode="decimal"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-txt/60">
                  Preview image
                </label>
                <label className="flex min-h-[42px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 px-3 py-2 text-sm text-brand transition-colors duration-150 hover:border-brand/60">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {imageFile ? imageFile.name : "Upload file"}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-txt/60">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe rarity, story and value for the buyer"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand/60"
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Highlights</h2>
                <p className="text-xs text-txt/60">
                  Key selling points visible to buyers
                </p>
              </div>
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-brand transition-colors duration-150 hover:border-brand/40"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    value={highlight}
                    onChange={(event) =>
                      handleHighlightChange(index, event.target.value)
                    }
                    placeholder="e.g. Premium packaging"
                    className="flex-1 rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand/60"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="rounded-2xl border border-white/10 p-2 text-txt/60 transition-colors duration-150 hover:border-brand/40 hover:text-brand"
                    aria-label="Remove highlight"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand/25 px-5 text-sm font-medium text-txt transition-colors duration-150 hover:bg-brand/30"
            >
              Save draft
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm font-medium text-txt/80 transition-colors duration-150 hover:border-white/30 hover:text-txt"
              onClick={resetForm}
            >
              Reset form
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold">Card preview</h2>
            <p className="text-xs text-txt/60">
              This is how the product will appear in the marketplace feed.
              Update the image and fields to see live changes.
            </p>
            <Card item={cardPreview} />
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold">Moderation summary</h2>
            <p className="text-xs text-txt/60">
              Internal data for the marketplace team. Later this block will be
              linked to smart contracts and automated publishing.
            </p>
            <div className="space-y-3 text-sm text-txt/80">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-txt/50">
                  Title
                </div>
                <div className="mt-1 rounded-2xl border border-white/10 bg-white/5 p-3">
                  {title || "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-txt/50">
                  Description
                </div>
                <div className="mt-1 rounded-2xl border border-white/10 bg-white/5 p-3 whitespace-pre-wrap">
                  {description ||
                    "Add story, details and why it matters to the buyer."}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-txt/50">
                  Highlights
                </div>
                <ul className="mt-1 space-y-2">
                  {highlights.filter(Boolean).length ? (
                    highlights.filter(Boolean).map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-2xl border border-dashed border-white/10 px-3 py-2 text-txt/60">
                      Provide at least three core highlights.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
