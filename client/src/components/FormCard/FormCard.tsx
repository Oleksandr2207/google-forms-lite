import { Link } from 'react-router-dom'
import type { Form } from '../../types/types'
import './FormCard.css'

type Props = {
  form: Pick<Form, 'id' | 'title' | 'description'>
}

export default function FormCard({ form }: Props) {
  return (
    <div className="FormCard panel">
      <div className="panelBody">
        <div className="FormCard__titleRow">
          <div className="FormCard__title">{form.title}</div>
          <span className="chip">id: {form.id.slice(0, 6)}…</span>
        </div>
        {form.description ? (
          <div className="FormCard__desc">{form.description}</div>
        ) : (
          <div className="muted">No description</div>
        )}
        <div className="FormCard__actions">
          <Link className="btn btnPrimary" to={`/forms/${form.id}/fill`}>
            View form
          </Link>
          <Link className="btn" to={`/forms/${form.id}/responses`}>
            View responses
          </Link>
        </div>
      </div>
    </div>
  )
}

