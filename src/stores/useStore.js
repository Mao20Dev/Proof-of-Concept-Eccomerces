import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { makeProducts, cats } from './data'

export function useStore(brand, mult = 1) {
  const products = makeProducts(brand, mult)
  const [params, setParams] = useSearchParams()
  const page = params.get('p') || 'home'
  const pid = params.get('id')
  const cat = params.get('cat') || 'All'
  const sq = params.get('q') || ''
  const [search, setSearch] = useState(sq)
  const [selSize, setSelSize] = useState('')
  const [selColor, setSelColor] = useState('')

  // Loading state - initial store load
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [])

  // Page transition state
  const [transitioning, setTransitioning] = useState(false)
  const [transIn, setTransIn] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setTransIn(false), 50)
      return () => clearTimeout(t)
    }
  }, [loading, page])

  const go = useCallback((p, extra = {}) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTransitioning(true)
    timerRef.current = setTimeout(() => {
      setParams({ p, ...extra })
      window.scrollTo(0, 0)
      setSelSize(''); setSelColor('')
      setTransitioning(false)
      setTransIn(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransIn(false))
      })
    }, 420)
  }, [setParams])

  const doSearch = useCallback(() => go('shop', { cat: 'All', q: search }), [go, search])

  const filtered = products.filter(pr => {
    if (cat !== 'All' && pr.cat !== cat) return false
    if (sq && !pr.name.toLowerCase().includes(sq.toLowerCase()) && !pr.cat.toLowerCase().includes(sq.toLowerCase())) return false
    return true
  })

  const product = pid ? products.find(pr => pr.id === +pid) : null
  const related = product ? products.filter(pr => pr.id !== product.id && pr.cat === product.cat).slice(0, 4) : []

  return { products, page, pid, cat, sq, search, setSearch, selSize, setSelSize, selColor, setSelColor, go, doSearch, filtered, product, related, cats, loading, transitioning, transIn }
}
