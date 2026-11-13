import React, { useEffect, useState } from 'react';
import { Download, FileSpreadsheet, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { SafeImage } from '../../components/common/SafeImage';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import {
  adminAddProductImageRecord,
  adminBulkImportProducts,
  adminDeleteProduct,
  adminDeleteProductImage,
  adminDeleteVariant,
  adminFetchAllProducts,
  adminFetchBrands,
  adminFetchCategories,
  adminSaveProduct,
  adminUploadProductImage,
  adminUpsertVariant,
  BulkImportSummary,
  CsvImportRow,
} from '../../services/adminService';
import { Brand, Category, CollectionType, Product } from '../../types';
import { formatPKR, getPrimaryImage, getTotalStock, slugify } from '../../utils/format';

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function escapeCsvCell(val: unknown): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const VALID_COLLECTIONS: CollectionType[] = [
  'casual',
  'running',
  'sports',
  'training',
  'lifestyle',
  'walking',
  'high-top',
  'low-top',
];

const CSV_TEMPLATE = `name,slug,sku,brand,category_slug,gender,collection_type,price_pkr,discount_price_pkr,short_description,description,material_notes,sizes,color_name,color_hex,stock_per_size,image_url
Apex Carbon Runner,apex-carbon-runner,SV-901,Vanguard Lab,running-shoes,unisex,running,38500,34900,Carbon-plated race day runner,Engineered breathable mesh upper with full-length carbon propulsion plate.,Mono-mesh · Nitrogen EVA · Carbon plate,40|41|42|43|44,Volt Obsidian,#101114,12,/images/sneakers/sv-01-obsidian-apex-low.jpg`;

export function AdminProductsPage() {
  const { refreshCatalog, showToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Modal / Drawer editing state
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('SOLEVERSE Atelier');
  const [brandId, setBrandId] = useState<string>('');
  const [categoryId, setCategoryId] = useState('');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [collectionType, setCollectionType] = useState<CollectionType>('casual');
  const [pricePkr, setPricePkr] = useState('28000');
  const [discountPricePkr, setDiscountPricePkr] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [materialNotes, setMaterialNotes] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image & variant creation inside edit modal
  const [newImgUrl, setNewImgUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [vSize, setVSize] = useState('42');
  const [vColor, setVColor] = useState('Obsidian Black');
  const [vHex, setVHex] = useState('#101114');
  const [vStock, setVStock] = useState('10');

  // Bulk CSV Import Modal
  const [csvOpen, setCsvOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvSummary, setCsvSummary] = useState<BulkImportSummary | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prods, cats, brs] = await Promise.all([
        adminFetchAllProducts(),
        adminFetchCategories(),
        adminFetchBrands(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setIsCreating(true);
    setName('');
    setSlug('');
    setSku(`SV-${Math.floor(200 + Math.random() * 799)}`);
    const defaultBrand = brands[0];
    setBrand(defaultBrand?.name ?? 'SOLEVERSE Atelier');
    setBrandId(defaultBrand?.id ?? '');
    setCategoryId(categories[0]?.id ?? '');
    setGender('men');
    setCollectionType('casual');
    setPricePkr('28500');
    setDiscountPricePkr('');
    setShortDesc('');
    setDescription('');
    setMaterialNotes('Italian full-grain leather · Rubber cupsole');
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(true);
    setIsTrending(false);
    setIsExclusive(false);
    setIsActive(true);
  };

  const openEdit = (p: Product) => {
    setIsCreating(false);
    setEditing(p);
    setName(p.name);
    setSlug(p.slug);
    setSku(p.sku);
    setBrand(p.brand);
    setBrandId(
      p.brand_id ?? brands.find((b) => b.name.toLowerCase() === p.brand.toLowerCase())?.id ?? ''
    );
    setCategoryId(p.category_id ?? categories[0]?.id ?? '');
    setGender(p.gender);
    setCollectionType(p.collection_type);
    setPricePkr(String(p.price_pkr));
    setDiscountPricePkr(p.discount_price_pkr ? String(p.discount_price_pkr) : '');
    setShortDesc(p.short_description);
    setDescription(p.description);
    setMaterialNotes(p.material_notes);
    setIsFeatured(p.is_featured);
    setIsBestseller(p.is_bestseller);
    setIsNewArrival(p.is_new_arrival);
    setIsTrending(p.is_trending);
    setIsExclusive(p.is_exclusive);
    setIsActive(p.is_active);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const matchedBrand = brands.find((b) => b.id === brandId);
      const saved = await adminSaveProduct({
        id: editing?.id,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        sku: sku.trim(),
        brand: matchedBrand?.name ?? brand.trim(),
        brand_id: brandId || null,
        short_description: shortDesc.trim(),
        description: description.trim(),
        material_notes: materialNotes.trim(),
        category_id: categoryId || null,
        gender,
        collection_type: collectionType,
        price_pkr: Number(pricePkr),
        discount_price_pkr: discountPricePkr ? Number(discountPricePkr) : null,
        is_featured: isFeatured,
        is_bestseller: isBestseller,
        is_new_arrival: isNewArrival,
        is_trending: isTrending,
        is_exclusive: isExclusive,
        is_active: isActive,
      });

      showToast(`Saved ${saved.name}.`, 'success');
      await load();
      await refreshCatalog();
      setEditing(saved);
      setIsCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    try {
      await adminDeleteProduct(p.id);
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      setConfirmDeleteId(null);
      await refreshCatalog();
      showToast(`Deleted ${p.name}.`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'sku',
      'name',
      'slug',
      'brand',
      'category_slug',
      'gender',
      'collection_type',
      'price_pkr',
      'discount_price_pkr',
      'total_stock',
      'is_featured',
      'is_bestseller',
      'is_new_arrival',
      'is_trending',
      'is_active',
    ];
    const rows = products.map((p) =>
      [
        p.sku,
        p.name,
        p.slug,
        p.brand,
        p.category?.slug ?? '',
        p.gender,
        p.collection_type,
        p.price_pkr,
        p.discount_price_pkr ?? '',
        getTotalStock(p),
        p.is_featured,
        p.is_bestseller,
        p.is_new_arrival,
        p.is_trending,
        p.is_active,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soleverse-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${products.length} sneakers to CSV.`, 'success');
  };

  const parseCsvRows = (raw: string): CsvImportRow[] => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const idx = (key: string) => headers.indexOf(key);

    return lines.slice(1).map((line) => {
      const cells = parseCsvLine(line);
      const get = (key: string, fallback = '') => {
        const i = idx(key);
        return i >= 0 && cells[i] !== undefined ? cells[i] : fallback;
      };
      const rawName = get('name');
      const rawGender = get('gender', 'unisex').toLowerCase();
      const genderVal: 'men' | 'women' | 'unisex' =
        rawGender === 'men' || rawGender === 'women' ? rawGender : 'unisex';
      const rawCol = get('collection_type', 'casual').toLowerCase() as CollectionType;
      const collectionVal = VALID_COLLECTIONS.includes(rawCol) ? rawCol : 'casual';

      return {
        name: rawName,
        slug: get('slug') || slugify(rawName),
        sku: get('sku'),
        brand: get('brand', 'SOLEVERSE Atelier'),
        category_slug: get('category_slug', 'casual-sneakers'),
        gender: genderVal,
        collection_type: collectionVal,
        price_pkr: Number(get('price_pkr', '28000')) || 28000,
        discount_price_pkr: get('discount_price_pkr') ? Number(get('discount_price_pkr')) : null,
        short_description: get('short_description'),
        description: get('description'),
        material_notes: get('material_notes'),
        sizes: get('sizes', '40|41|42|43|44')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        color_name: get('color_name', 'Obsidian'),
        color_hex: get('color_hex', '#101114'),
        stock_per_size: Number(get('stock_per_size', '10')) || 10,
        image_url: get('image_url'),
      };
    });
  };

  const handleBulkImport = async () => {
    const parsed = parseCsvRows(csvText);
    if (parsed.length === 0) {
      showToast('Paste or upload a valid CSV with header row + at least 1 product row.', 'error');
      return;
    }
    setCsvImporting(true);
    setCsvSummary(null);
    try {
      const summary = await adminBulkImportProducts(parsed);
      setCsvSummary(summary);
      await load();
      await refreshCatalog();
      showToast(`Bulk import complete: ${summary.inserted} added.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Bulk import failed.', 'error');
    } finally {
      setCsvImporting(false);
    }
  };

  const handleCsvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    setCsvSummary(null);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soleverse-bulk-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingFile(true);
    try {
      const url = await adminUploadProductImage(file, editing.slug);
      await adminAddProductImageRecord({
        product_id: editing.id,
        image_url: url,
        alt_text: editing.name,
        is_primary: editing.images.length === 0,
        display_order: editing.images.length,
      });
      await load();
      const updated = (await adminFetchAllProducts()).find((x) => x.id === editing.id);
      if (updated) setEditing(updated);
      showToast('Image uploaded to Supabase Storage.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed.', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddImageUrl = async () => {
    if (!editing || !newImgUrl.trim()) return;
    try {
      await adminAddProductImageRecord({
        product_id: editing.id,
        image_url: newImgUrl.trim(),
        alt_text: editing.name,
        is_primary: editing.images.length === 0,
        display_order: editing.images.length,
      });
      setNewImgUrl('');
      const updatedList = await adminFetchAllProducts();
      setProducts(updatedList);
      const updated = updatedList.find((x) => x.id === editing.id);
      if (updated) setEditing(updated);
      showToast('Image added.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to add image.', 'error');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!editing) return;
    await adminDeleteProductImage(imageId);
    const updatedList = await adminFetchAllProducts();
    setProducts(updatedList);
    const updated = updatedList.find((x) => x.id === editing.id);
    if (updated) setEditing(updated);
  };

  const handleAddVariant = async () => {
    if (!editing) return;
    try {
      await adminUpsertVariant({
        product_id: editing.id,
        size_eu: vSize,
        color_name: vColor.trim(),
        color_hex: vHex,
        sku_variant: `${editing.sku}-${vSize}-${Date.now().toString().slice(-3)}`,
        stock_quantity: Number(vStock) || 0,
        is_active: true,
      });
      const updatedList = await adminFetchAllProducts();
      setProducts(updatedList);
      const updated = updatedList.find((x) => x.id === editing.id);
      if (updated) setEditing(updated);
      showToast(`Added EU ${vSize} variant.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Variant error.', 'error');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!editing) return;
    await adminDeleteVariant(variantId);
    const updatedList = await adminFetchAllProducts();
    setProducts(updatedList);
    const updated = updatedList.find((x) => x.id === editing.id);
    if (updated) setEditing(updated);
  };

  const visibleProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls =
    'w-full px-3 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED]';

  return (
    <>
      <SeoHead title="Admin Products & CSV" />

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Catalog Studio
            </p>
            <h1 className="font-editorial text-3xl font-semibold">
              Product Management ({products.length})
            </h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
              Create, edit, bulk-import CSV sheets, and manage studio images & size variants.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2.5 border border-[#C5C7CB] dark:border-white/20 bg-white dark:bg-[#202126] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:border-[#101114] dark:hover:border-[#D7FF45]"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setCsvOpen(true);
                setCsvSummary(null);
              }}
              className="px-4 py-2.5 border border-[#C5C7CB] dark:border-white/20 bg-white dark:bg-[#202126] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:border-[#101114] dark:hover:border-[#D7FF45]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Import CSV
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="px-5 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Add Sneaker
            </button>
          </div>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by name, SKU, or brand..."
          className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
        />

        <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price (PKR)</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-[#52525B] dark:text-[#C5C7CB]"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : (
                visibleProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#F5F3ED]/60 dark:hover:bg-[#101114]/40"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={getPrimaryImage(p)}
                          alt={p.name}
                          className="w-14 h-10 object-cover bg-[#EAE6DC] dark:bg-[#101114] shrink-0"
                        />
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-[#52525B] dark:text-[#C5C7CB]">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{p.sku}</td>
                    <td className="py-3 px-4 text-xs text-[#52525B] dark:text-[#C5C7CB]">
                      {p.category?.name ?? p.collection_type}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {formatPKR(p.discount_price_pkr ?? p.price_pkr)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {getTotalStock(p)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-[#101114] dark:text-[#F5F3ED] hover:text-[#52525B] dark:hover:text-[#D7FF45]"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {confirmDeleteId === p.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p)}
                              className="px-2 py-1 bg-[#DC2626] text-white text-[10px] font-semibold uppercase"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 border border-[#C5C7CB] dark:border-white/20 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-1.5 text-[#52525B] dark:text-[#C5C7CB] hover:text-[#DC2626]"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk CSV Import Modal */}
      {csvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 w-full max-w-2xl p-6 sm:p-8 space-y-5 text-[#101114] dark:text-[#F5F3ED]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA] dark:border-white/10">
              <div>
                <h2 className="font-editorial text-2xl font-semibold">Bulk Import Sneakers CSV</h2>
                <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-0.5">
                  Validates duplicate slugs/SKUs and generates EU size variants automatically.
                </p>
              </div>
              <button type="button" onClick={() => setCsvOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3.5 py-2 border border-[#C5C7CB] dark:border-white/20 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV Template
              </button>
              <label className="px-3.5 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Select .CSV File
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={CSV_TEMPLATE}
              className="w-full p-3 bg-[#F5F3ED] dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs font-mono"
            />

            {csvSummary && (
              <div className="p-4 bg-[#F5F3ED] dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/10 text-xs space-y-1.5">
                <p className="font-semibold text-[#16A34A]">
                  Inserted: {csvSummary.inserted} sneakers
                </p>
                {csvSummary.skippedDuplicates.length > 0 && (
                  <p className="text-amber-700 dark:text-amber-300">
                    Skipped Duplicates ({csvSummary.skippedDuplicates.length}):{' '}
                    {csvSummary.skippedDuplicates.join(', ')}
                  </p>
                )}
                {csvSummary.errors.length > 0 && (
                  <p className="text-[#DC2626]">
                    Errors ({csvSummary.errors.length}): {csvSummary.errors.join(' | ')}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCsvOpen(false)}
                className="px-5 py-2.5 border border-[#C5C7CB] dark:border-white/20 text-xs font-semibold uppercase tracking-wider"
              >
                Close
              </button>
              <button
                type="button"
                disabled={csvImporting}
                onClick={handleBulkImport}
                className="px-6 py-2.5 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                {csvImporting
                  ? 'Importing...'
                  : `Import ${parseCsvRows(csvText).length || 0} Rows`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-[#101114] dark:text-[#F5F3ED]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DA] dark:border-white/10">
              <h2 className="font-editorial text-2xl font-semibold">
                {editing ? `Edit: ${editing.name}` : 'Create New Sneaker'}
              </h2>
              <button type="button" onClick={closeModal} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editing) setSlug(slugify(e.target.value));
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Brand House *</label>
                  {brands.length > 0 ? (
                    <select
                      value={brandId}
                      onChange={(e) => {
                        setBrandId(e.target.value);
                        const match = brands.find((b) => b.id === e.target.value);
                        if (match) setBrand(match.name);
                      }}
                      className={inputCls}
                    >
                      <option value="">Custom Brand ({brand})</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className={inputCls}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputCls}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as typeof gender)}
                      className={inputCls}
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Type</label>
                    <select
                      value={collectionType}
                      onChange={(e) => setCollectionType(e.target.value as CollectionType)}
                      className={inputCls}
                    >
                      <option value="casual">Casual</option>
                      <option value="running">Running</option>
                      <option value="sports">Sports</option>
                      <option value="training">Training</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="walking">Walking</option>
                      <option value="high-top">High-Top</option>
                      <option value="low-top">Low-Top</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePkr}
                    onChange={(e) => setPricePkr(e.target.value)}
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Discount Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={discountPricePkr}
                    onChange={(e) => setDiscountPricePkr(e.target.value)}
                    placeholder="Optional"
                    className={`${inputCls} font-mono`}
                  />
                </div>
              </div>

              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Short one-line description"
                className={inputCls}
              />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full craftsmanship & engineering description"
                className={inputCls}
              />
              <input
                type="text"
                value={materialNotes}
                onChange={(e) => setMaterialNotes(e.target.value)}
                placeholder="Materials specification"
                className={inputCls}
              />

              <div className="flex flex-wrap gap-4 text-xs pt-1">
                {[
                  { label: 'Featured', val: isFeatured, set: setIsFeatured },
                  { label: 'Best Seller', val: isBestseller, set: setIsBestseller },
                  { label: 'New Arrival', val: isNewArrival, set: setIsNewArrival },
                  { label: 'Trending', val: isTrending, set: setIsTrending },
                  { label: 'Exclusive', val: isExclusive, set: setIsExclusive },
                  { label: 'Active', val: isActive, set: setIsActive },
                ].map((flag) => (
                  <label key={flag.label} className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flag.val}
                      onChange={(e) => flag.set(e.target.checked)}
                    />
                    {flag.label}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
              >
                {saving ? 'Saving...' : editing ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>

            {/* Images & Variants Manager (available once product exists) */}
            {editing && (
              <div className="space-y-6 pt-6 border-t border-[#E5E2DA] dark:border-white/10">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    Product Images ({editing.images.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {editing.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative border border-[#E5E2DA] dark:border-white/10"
                      >
                        <SafeImage
                          src={img.image_url}
                          alt={img.alt_text}
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1 right-1 bg-white dark:bg-[#101114] p-1 text-[#DC2626]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="px-3.5 py-2 border border-[#101114] dark:border-white/25 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingFile ? 'Uploading...' : 'Upload to Storage'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={newImgUrl}
                      onChange={(e) => setNewImgUrl(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-1 min-w-[200px] px-3 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    Size & Color Variants ({editing.variants.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {editing.variants.map((v) => (
                      <div
                        key={v.id}
                        className="border border-[#E5E2DA] dark:border-white/10 p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-mono font-semibold">EU {v.size_eu}</p>
                          <p className="text-[#52525B] dark:text-[#C5C7CB] truncate max-w-[90px]">
                            {v.color_name}
                          </p>
                          <p className="font-mono text-[#16A34A] dark:text-[#D7FF45]">
                            Stock: {v.stock_quantity}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(v.id)}
                          className="text-[#52525B] dark:text-[#C5C7CB] hover:text-[#DC2626]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                    <input
                      type="text"
                      value={vSize}
                      onChange={(e) => setVSize(e.target.value)}
                      placeholder="EU Size"
                      className="px-2.5 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={vColor}
                      onChange={(e) => setVColor(e.target.value)}
                      placeholder="Color Name"
                      className="px-2.5 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs"
                    />
                    <input
                      type="text"
                      value={vHex}
                      onChange={(e) => setVHex(e.target.value)}
                      placeholder="#101114"
                      className="px-2.5 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs font-mono"
                    />
                    <input
                      type="number"
                      value={vStock}
                      onChange={(e) => setVStock(e.target.value)}
                      placeholder="Stock"
                      className="px-2.5 py-2 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-2 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold"
                    >
                      Add Variant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
