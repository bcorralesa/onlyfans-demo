import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome          from './routes/Welcome'
import AgeVerification  from './routes/AgeVerification'
import Verified         from './routes/Verified'     // ← nuevo
import Result           from './routes/Result'
import LivenessError    from './routes/LivenessError'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Welcome />} />
        <Route path="/verify"   element={<AgeVerification />} />
        <Route path="/verified"      element={<Verified />} />
        <Route path="/liveness-error" element={<LivenessError />} />
        <Route path="/result"         element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}
