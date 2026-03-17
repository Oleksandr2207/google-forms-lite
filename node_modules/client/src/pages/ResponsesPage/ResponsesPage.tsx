import { Link, useParams } from 'react-router-dom'
import { useFormQuery, useResponsesQuery } from '../../api/formsApi'
import ResponseTable from '../../components/ResponseTable/ResponseTable'
import './ResponsesPage.css'

export default function ResponsesPage() {
  const { id } = useParams()
  const formId = id ?? ''
  const formQuery = useFormQuery({ id: formId }, { skip: !formId })
  const responsesQuery = useResponsesQuery({ formId }, { skip: !formId })

  if (formQuery.isLoading || responsesQuery.isLoading) {
    return <div className="muted">Loading…</div>
  }

  if (formQuery.isError || responsesQuery.isError || !formQuery.data) {
    return (
      <div className="panel">
        <div className="panelBody stack">
          <div className="error">Failed to load responses.</div>
          <Link className="btn" to="/">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ResponsesPage stack">
      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="ResponsesPage__h">{formQuery.data.title}</div>
            <div className="muted">All submitted responses</div>
          </div>
          <Link className="btn" to={`/forms/${formId}/fill`}>
            Back to form
          </Link>
        </div>
      </div>

      <ResponseTable form={formQuery.data} responses={responsesQuery.data ?? []} />
    </div>
  )
}

