'use client';

import { useState, useEffect } from 'react';
import { Peptide } from '@/types';
import Image from 'next/image';

const ADMIN_PASSWORD = 'peptideadmin'; // Change this to your own password

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [editing, setEditing] = useState<Peptide | null>(null);
  const [form, setForm] = useState<Partial<Peptide>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authed) {
      fetch('/data/peptides.json')
        .then(res => res.json())
        .then(setPeptides);
    }
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleEdit = (peptide: Peptide) => {
    setEditing(peptide);
    setForm(peptide);
    setImagePreview(peptide.image || null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this peptide?')) return;
    setPeptides(peptides.filter(p => p.id !== id));
    if (editing && editing.id === id) {
      setEditing(null);
      setForm({});
      setImagePreview(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, image: `/images/${file.name}` }));
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      // In a real app, upload the file to /public/images/ here
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name) {
      setError('ID and Name are required');
      return;
    }
    if (editing) {
      setPeptides(peptides.map(p => (p.id === editing.id ? { ...editing, ...form } as Peptide : p)));
    } else {
      setPeptides([...peptides, form as Peptide]);
    }
    setEditing(null);
    setForm({});
    setImagePreview(null);
    setError('');
  };

  const handleAddNew = () => {
    setEditing(null);
    setForm({});
    setImagePreview(null);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs space-y-4">
          <h2 className="text-xl font-bold text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Peptide Admin Dashboard</h1>
        <div className="mb-8 flex justify-between items-center">
          <span className="text-lg font-semibold">Total Peptides: {peptides.length}</span>
          <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">Add New Peptide</button>
        </div>
        <div className="overflow-x-auto mb-12">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Use Case</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {peptides.map(peptide => (
                <tr key={peptide.id} className="border-b">
                  <td className="p-2">
                    {peptide.image ? (
                      <Image src={peptide.image} alt={peptide.name} width={48} height={48} className="rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-2 font-mono text-xs">{peptide.id}</td>
                  <td className="p-2">{peptide.name}</td>
                  <td className="p-2">{peptide.use_case}</td>
                  <td className="p-2">${peptide.price}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(peptide)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(peptide.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Peptide' : 'Add New Peptide'}</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input name="id" value={form.id || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required disabled={!!editing} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" value={form.name || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Use Case</label>
                <input name="use_case" value={form.use_case || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input name="price" type="number" step="0.01" value={form.price || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dosage</label>
                <input name="dosage" value={form.dosage || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cycle Length</label>
                <input name="cycle_length" value={form.cycle_length || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Injection Site</label>
              <input name="injection_site" value={form.injection_site || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input name="tags" value={form.tags ? form.tags.join(', ') : ''} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
              {imagePreview && (
                <div className="mt-2">
                  <Image src={imagePreview} alt="Preview" width={96} height={96} className="rounded" />
                </div>
              )}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">{editing ? 'Save Changes' : 'Add Peptide'}</button>
          </form>
        </div>
      </div>
    </div>
  );
} 