import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import CreateFormPage from './pages/CreateFormPage/CreateFormPage'
import FillFormPage from './pages/FillFormPage/FillFormPage'
import ResponsesPage from './pages/ResponsesPage/ResponsesPage'

export default function App() {
  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <Link to="/">Google Forms Lite</Link>
          <span className="chip">RTK Query + GraphQL</span>
        </div>
        <nav style={{ display: 'flex', gap: 10 }}>
          <Link className="btn" to="/">
            Home
          </Link>
          <Link className="btn btnPrimary" to="/forms/new">
            Create form
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<CreateFormPage />} />
        <Route path="/forms/:id/fill" element={<FillFormPage />} />
        <Route path="/forms/:id/responses" element={<ResponsesPage />} />
        <Route
          path="*"
          element={
            <div className="panel">
              <div className="panelBody">
                <div className="stack">
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Not found</div>
                  <Link className="btn" to="/">
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  )
}
