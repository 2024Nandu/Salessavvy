import React, { useState } from 'react';
import { 
  PackagePlus, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Layers, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/helpers';

const PRESET_CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Footwear' },
  { id: 4, name: 'Home' },
  { id: 5, name: 'Books' }
];

export default function AdminProducts() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  });

  const [deleteId, setDeleteId] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock || !form.imageUrl) {
      showToast('Please fill all product fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        categoryId: parseInt(form.categoryId, 10),
        imageUrl: form.imageUrl.trim()
      };

      const result = await api.admin.products.add(payload);
      showToast(`Product "${form.name}" added successfully!`, 'success');
      
      // Reset form with new default image
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: 1,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
      });
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    if (!deleteId) {
      showToast('Please enter a Product ID to delete', 'error');
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await api.admin.products.delete(deleteId);
      showToast(res || `Product #${deleteId} deleted successfully!`, 'success');
      setDeleteId('');
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add Product Form (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Add New Product</h3>
              <p className="text-xs text-slate-400">Expand your store catalog with new inventory</p>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM5 Noise Canceling Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed description of specifications and features..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Price (INR ₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="2499.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="25"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category ID *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.id} - {cat.name}
                    </option>
                  ))}
                  <option value={6}>6 - Custom Category</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <PackagePlus className="w-5 h-5" />
                  <span>Publish Product to Store</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Live Image Preview & Delete Product */}
      <div className="space-y-6">
        {/* Card Live Preview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            Live Preview
          </h4>

          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <div className="aspect-video w-full bg-slate-900 overflow-hidden relative">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80';
                }}
              />
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Category ID #{form.categoryId}
              </span>
              <h5 className="font-bold text-white text-sm line-clamp-1">
                {form.name || 'Your Product Title'}
              </h5>
              <p className="text-xs text-slate-400 line-clamp-2">
                {form.description || 'Description will appear here as you type.'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="font-extrabold text-blue-400 text-base">
                  {formatINR(form.price || 0)}
                </span>
                <span className="text-slate-400 font-medium">
                  Stock: <strong className="text-white">{form.stock || 0}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Product Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2.5 mb-3 text-rose-400">
            <Trash2 className="w-5 h-5" />
            <h4 className="font-bold text-white text-base">Delete Product</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Permanently remove a product and its images from the database.
          </p>

          <form onSubmit={handleDeleteProduct} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product ID
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 5"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={deleteLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deleteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Product</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
