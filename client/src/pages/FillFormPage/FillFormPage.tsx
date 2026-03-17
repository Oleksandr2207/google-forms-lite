import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFormQuery, useSubmitResponseMutation } from '../../api/formsApi'
import QuestionRenderer from '../../components/QuestionRenderer/QuestionRenderer'
import type { AnswerInput } from '../../types/types'
import './FillFormPage.css'

function byQuestionId(list: AnswerInput[]) {
  const map = new Map<string, AnswerInput>()
  for (const a of list) map.set(a.questionId, a)
  return map
}

export default function FillFormPage() {
  const { id } = useParams()
  const formId = id ?? ''
  const { data: form, isLoading, isError } = useFormQuery(
    { id: formId },
    { skip: !formId },
  )
  const [answers, setAnswers] = useState<AnswerInput[]>([])
  const [submit, { isLoading: isSubmitting, error: submitError, isSuccess }] =
    useSubmitResponseMutation()
  const [localError, setLocalError] = useState<string | null>(null)

  const answersMap = useMemo(() => byQuestionId(answers), [answers])

  const setAnswer = (next: AnswerInput) => {
    setAnswers((prev) => {
      const map = byQuestionId(prev)
      map.set(next.questionId, next)
      return Array.from(map.values())
    })
  }

  const validate = () => {
    if (!form) return 'Form not found'
    for (const q of form.questions) {
      const a = answersMap.get(q.id)
      if (!q.required) continue

      if (q.type === 'CHECKBOX') {
        const values = (a?.values ?? []).filter(Boolean)
        if (values.length === 0) return `Required: "${q.title}"`
      } else {
        const value = (a?.value ?? '').trim()
        if (!value) return `Required: "${q.title}"`
      }
    }
    return null
  }

  const onSubmit = async () => {
    const err = validate()
    if (err) {
      setLocalError(err)
      return
    }
    setLocalError(null)
    await submit({ formId, answers }).unwrap()
  }

  if (isLoading) return <div className="muted">Loading…</div>
  if (isError || !form)
    return (
      <div className="panel">
        <div className="panelBody stack">
          <div className="error">Failed to load form.</div>
          <Link className="btn" to="/">
            Back to home
          </Link>
        </div>
      </div>
    )

  return (
    <div className="FillFormPage stack">
      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="FillFormPage__h">{form.title}</div>
            {form.description ? (
              <div className="muted">{form.description}</div>
            ) : null}
          </div>
          <Link className="btn" to={`/forms/${form.id}/responses`}>
            View responses
          </Link>
        </div>
        <div className="panelBody stack">
          {localError ? <div className="error">{localError}</div> : null}
          {submitError ? (
            <div className="error">Submit failed. Please try again.</div>
          ) : null}
          {isSuccess ? <div className="success">Form submitted successfully!</div> : null}

          {form.questions.map((q) => (
            <QuestionRenderer
              key={q.id}
              question={q}
              value={answersMap.get(q.id)}
              onChange={setAnswer}
            />
          ))}

          <div className="FillFormPage__actions">
            <button
              className="btn btnPrimary"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

