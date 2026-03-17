import type { Form, Response } from '../../types/types'
import './ResponseTable.css'

type Props = {
  form: Form
  responses: Response[]
}

function answerToText(a: { value?: string | null; values: string[] }) {
  const v = (a.value ?? '').trim()
  if (v) return v
  if (a.values?.length) return a.values.join(', ')
  return '—'
}

export default function ResponseTable({ form, responses }: Props) {
  const questionById = new Map(form.questions.map((q) => [q.id, q.title]))

  return (
    <div className="ResponseTable panel">
      <div className="panelHeader">
        <div style={{ fontWeight: 900 }}>Responses ({responses.length})</div>
      </div>
      <div className="panelBody">
        {responses.length === 0 ? (
          <div className="muted">No responses yet.</div>
        ) : (
          <div className="ResponseTable__wrap">
            <table className="ResponseTable__table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  {form.questions.map((q) => (
                    <th key={q.id}>{q.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => {
                  const answersByQ = new Map(r.answers.map((a) => [a.questionId, a]))
                  return (
                    <tr key={r.id}>
                      <td className="ResponseTable__date">
                        {new Date(r.submittedAt).toLocaleString()}
                      </td>
                      {form.questions.map((q) => {
                        const a = answersByQ.get(q.id)
                        return (
                          <td key={q.id} title={questionById.get(q.id)}>
                            {a ? answerToText(a) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

