import React, { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from '../services/product'

export default function ProductList() {
  const [items, setItems] = useState<Product[]>([])
  const [name, setName] = useState('Cafe')
  const [price, setPrice] = useState(25000)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setItems(data)
      setMsg('')
    } catch (e:any) {
      setMsg(`Lỗi tải dữ liệu: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) { setMsg('Tên không được trống'); return }
    if (price <= 0) { setMsg('Giá phải > 0'); return }

    try {
      const saved = await createProduct({ name, price })
      setItems(prev => [...prev, saved])
      setMsg('Thêm sản phẩm thành công')
    } catch (e:any) {
      setMsg(`Lỗi thêm: ${e.message}`)
    }
  }

  const remove = async (id:number) => {
    try {
      await deleteProduct(id)
      setItems(prev => prev.filter(x => x.id !== id))
    } catch (e:any) {
      setMsg(`Lỗi xóa: ${e.message}`)
    }
  }

  const patch = async (p: Product) => {
    if (!p.id) return
    try {
      const newPrice = p.price + 1000
      const updated = await updateProduct(p.id, { ...p, price: newPrice })
      setItems(prev => prev.map(x => x.id === p.id ? updated : x))
    } catch (e:any) {
      setMsg(`Lỗi cập nhật: ${e.message}`)
    }
  }

  return (
    <div style={{maxWidth:720, margin:'20px auto'}}>
      <h2>Products</h2>
      <div style={{display:'flex', gap:8}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên sản phẩm"/>
        <input type="number" value={price} onChange={e=>setPrice(+e.target.value)} placeholder="Giá"/>
        <button onClick={add}>Thêm</button>
        <button onClick={load} disabled={loading}>{loading ? 'Đang tải...' : 'Tải lại'}</button>
      </div>
      <div style={{color: msg.startsWith('Lỗi') ? 'crimson':'#2b7b2b', marginTop:8}}>{msg}</div>
      <ul>
        {items.map(p =>
          <li key={p.id} style={{display:'flex', gap:8, alignItems:'center'}}>
            <span style={{minWidth:60}}>#{p.id}</span>
            <span style={{minWidth:200}}>{p.name}</span>
            <span style={{minWidth:120}}>{p.price} đ</span>
            <button onClick={()=>patch(p)}>+1000</button>
            <button onClick={()=>p.id && remove(p.id)}>Xóa</button>
          </li>
        )}
      </ul>
    </div>
  )
}
