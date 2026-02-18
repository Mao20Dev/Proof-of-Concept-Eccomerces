import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Portfolio from './Portfolio'
import Grunge from './stores/Grunge'
import Maximalism from './stores/Maximalism'
import Glass from './stores/Glass'
import NeoBrut from './stores/NeoBrut'
import Synth from './stores/Synth'
import Swiss from './stores/Swiss'
import Luxury from './stores/Luxury'
import TechSpec from './stores/TechSpec'
import Bold from './stores/Bold'
import Brut from './stores/Brut'
import SoftClub from './stores/SoftClub'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (<><ScrollToTop /><Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="/rvlt/*" element={<Grunge />} />
    <Route path="/frmat/*" element={<Maximalism />} />
    <Route path="/glss/*" element={<Glass />} />
    <Route path="/nbrut/*" element={<NeoBrut />} />
    <Route path="/snth/*" element={<Synth />} />
    <Route path="/objkt/*" element={<Swiss />} />
    <Route path="/dore/*" element={<Luxury />} />
    <Route path="/spct/*" element={<TechSpec />} />
    <Route path="/chnk/*" element={<Bold />} />
    <Route path="/brt/*" element={<Brut />} />
    <Route path="/aftr/*" element={<SoftClub />} />
  </Routes></>)
}
