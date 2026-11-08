'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash, Edit2, Plus, Save, X } from 'lucide-react'
import Image from 'next/image'

export default function ManagementPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ title: '', price: '', category: '' })
  
  const [isAdding, setIsAdding] = useState(false)
  const [addForm, setAddForm] = useState({ title: '', price: '', category: '', image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' })

  // GET
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) throw new Error('API response error')
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.warn('API fetch failed, loading offline fallback data:', err)
        // Set fallback products if internet is disconnected or API is down
        setProducts([
          {
            id: 1,
            title: "Cyberpunk Cyan Backpack (Offline Fallback)",
            price: 89.99,
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
          },
          {
            id: 2,
            title: "Slate Grey Premium Tee (Offline Fallback)",
            price: 22.30,
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
          },
          {
            id: 3,
            title: "Urban Bomber Jacket (Offline Fallback)",
            price: 55.99,
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-albTqL._AC_UX679_.jpg"
          },
          {
            id: 4,
            title: "Minimalist Slim Fit Shirt (Offline Fallback)",
            price: 15.99,
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"
          }
        ])
        setIsLoading(false)
      })
  }, [])

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, { method: 'DELETE' })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.warn("Delete request failed, updating UI locally:", err)
      setProducts(products.filter(p => p.id !== id))
    }
  }

  // POST
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      })
      if (!res.ok) throw new Error('API response error')
      const newProduct = await res.json()
      setProducts([newProduct, ...products])
    } catch (err) {
      console.warn("Post request failed, adding locally:", err)
      const localProduct = {
        ...addForm,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        price: Number(addForm.price)
      }
      setProducts([localProduct, ...products])
    } finally {
      setIsAdding(false)
      setAddForm({ title: '', price: '', category: '', image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' })
    }
  }

  // PUT
  const handleUpdate = async (id: number, e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (!res.ok) throw new Error('API response error')
      const updatedProduct = await res.json()
      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p))
    } catch (err) {
      console.warn("Update request failed, updating locally:", err)
      setProducts(products.map(p => p.id === id ? { ...p, ...editForm, price: Number(editForm.price) } : p))
    } finally {
      setEditingId(null)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen pt-20 flex justify-center"><p>Loading Product Management...</p></div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-primary font-medium tracking-widest uppercase mb-2">Management Dashboard</p>
          <h1 className="font-heading text-4xl tracking-wider text-foreground">PRODUCT CRUD (FAKESTORE API)</h1>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-secondary/50 p-6 rounded-xl border border-border mb-8 space-y-4">
          <h3 className="font-heading text-xl">Add New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input required placeholder="Title" value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground" />
            <input required type="number" step="0.01" placeholder="Price" value={addForm.price} onChange={e => setAddForm({...addForm, price: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground" />
            <input required placeholder="Category" value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground" />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="relative w-20 h-20 bg-white rounded flex-shrink-0">
              {product.image ? (
                <Image src={product.image} alt={product.title || 'Product'} fill className="object-contain p-2" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-xs">No Img</div>
              )}
            </div>
            
            {editingId === product.id ? (
              <form onSubmit={(e) => handleUpdate(product.id, e)} className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground max-w-xs" />
                <input required type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground max-w-[100px]" />
                <input required value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="bg-background border rounded px-3 py-2 text-foreground max-w-xs" />
                <div className="flex gap-2 sm:col-span-3">
                  <Button type="submit" size="sm" className="gap-1"><Save className="w-4 h-4"/> Update</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}><X className="w-4 h-4"/> Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg truncate">{product.title}</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">{product.category}</p>
                  <p className="font-bold mt-1 text-primary">${Number(product.price).toFixed(2)} USD</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={() => { setEditingId(product.id); setEditForm({ title: product.title, price: product.price, category: product.category }) }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
