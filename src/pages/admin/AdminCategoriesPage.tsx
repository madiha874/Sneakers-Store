import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import {
  adminDeleteBrand,
  adminDeleteCategory,
  adminFetchBrands,
  adminFetchCategories,
  adminSaveBrand,
  adminSaveCategory,
} from '../../services/adminService';
import { Brand, Category, ParentCategoryGroup } from '../../types';
import { slugify } from '../../utils/format';

export function AdminCategoriesPage() {
  const { refreshCatalog, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentGroup, setParentGroup] = useState<ParentCategoryGroup>('lifestyle');
  const [description, setDescription] = useState('');

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandName, setBrandName] = useState('');
  const [brandSlug, setBrandSlug] = useState('');
  const [brandOrigin, setBrandOrigin] = useState('Milan / Lahore Studio');
  const [brandDesc, setBrandDesc] = useState('');

  const load = async () => {
    try {
      const [cats, brs] = await Promise.all([adminFetchCategories(), adminFetchBrands()]);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to load catalog taxonomy.', 'error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSaveCategory({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        parent_group: parentGroup,
        description: description.trim(),
        display_order: categories.length + 1,
        is_active: true,
      });
      setName('');
      setSlug('');
      setDescription('');
      await load();
      await refreshCatalog();
      showToast('Category saved.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await adminDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await refreshCatalog();
      showToast('Category removed.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminSaveBrand({
        name: brandName.trim(),
        slug: brandSlug.trim() || slugify(brandName),
        origin: brandOrigin.trim(),
        description: brandDesc.trim(),
        is_active: true,
      });
      setBrandName('');
      setBrandSlug('');
      setBrandDesc('');
      await load();
      await refreshCatalog();
      showToast('Brand house saved.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save brand.', 'error');
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await adminDeleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      await refreshCatalog();
      showToast('Brand house removed.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-white dark:bg-[#101114] border border-[#E5E2DA] dark:border-white/15 text-sm text-[#101114] dark:text-[#F5F3ED]';

  return (
    <>
      <SeoHead title="Categories & Brands · Admin" />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              Taxonomy Architecture
            </p>
            <h1 className="font-editorial text-3xl font-semibold">Categories & Brands</h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
              Organize footwear departments, mega-menu collections, and design houses.
            </p>
          </div>

          <div className="flex gap-1.5 bg-[#E5E2DA]/70 dark:bg-[#202126] p-1 border border-[#E5E2DA] dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                  : 'text-[#52525B] dark:text-[#C5C7CB]'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('brands')}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === 'brands'
                  ? 'bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114]'
                  : 'text-[#52525B] dark:text-[#C5C7CB]'
              }`}
            >
              Brands ({brands.length})
            </button>
          </div>
        </div>

        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleCreateCategory}
              className="lg:col-span-5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 space-y-4"
            >
              <h2 className="font-editorial text-xl font-semibold">Add Category</h2>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="Category Name *"
                className={inputCls}
              />
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug *"
                className={`${inputCls} font-mono`}
              />
              <select
                value={parentGroup}
                onChange={(e) => setParentGroup(e.target.value as ParentCategoryGroup)}
                className={inputCls}
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="running">Running</option>
                <option value="sports">Sports</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Collection summary..."
                className={inputCls}
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
              >
                Create Category
              </button>
            </form>

            <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 divide-y divide-[#E5E2DA] dark:divide-white/10">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{cat.name}</p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] font-mono">
                      /{cat.slug} · Group: {cat.parent_group}
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1">
                      {cat.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-[#52525B] dark:text-[#C5C7CB] hover:text-[#DC2626]"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleCreateBrand}
              className="lg:col-span-5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 p-6 space-y-4"
            >
              <h2 className="font-editorial text-xl font-semibold">Add Brand House</h2>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  setBrandSlug(slugify(e.target.value));
                }}
                placeholder="Brand Name (e.g. Vanguard Lab) *"
                className={inputCls}
              />
              <input
                type="text"
                required
                value={brandSlug}
                onChange={(e) => setBrandSlug(e.target.value)}
                placeholder="brand-slug *"
                className={`${inputCls} font-mono`}
              />
              <input
                type="text"
                value={brandOrigin}
                onChange={(e) => setBrandOrigin(e.target.value)}
                placeholder="Design Origin (e.g. Tokyo / Lahore)"
                className={inputCls}
              />
              <textarea
                rows={3}
                value={brandDesc}
                onChange={(e) => setBrandDesc(e.target.value)}
                placeholder="Editorial brand manifesto..."
                className={inputCls}
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#101114] dark:bg-[#D7FF45] text-[#F5F3ED] dark:text-[#101114] text-xs font-semibold uppercase tracking-wider"
              >
                Create Brand House
              </button>
            </form>

            <div className="lg:col-span-7 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 divide-y divide-[#E5E2DA] dark:divide-white/10">
              {brands.map((b) => (
                <div key={b.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] font-mono">
                      /brands/{b.slug} {b.origin ? `· ${b.origin}` : ''}
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#C5C7CB] mt-1">
                      {b.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBrand(b.id)}
                    className="p-2 text-[#52525B] dark:text-[#C5C7CB] hover:text-[#DC2626]"
                    aria-label={`Delete ${b.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
