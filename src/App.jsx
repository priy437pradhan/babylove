import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChooseTemplate from './pages/ChooseTemplate'
import CreateEvent from './pages/CreateEvent'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Invitation from './pages/Invitation'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Public invitation page — no site chrome, the template owns the screen */}
      <Route path="/invite/:eventUrl" element={<Invitation />} />

      {/* Platform pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events/:eventTypeKey" element={<ChooseTemplate />} />
        <Route path="/create/:eventTypeKey/:templateTypeKey" element={<CreateEvent />} />
        <Route path="/edit/:eventUrl" element={<CreateEvent editMode />} />
        <Route path="/checkout/:eventUrl" element={<Checkout />} />
        <Route path="/success/:eventUrl" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
