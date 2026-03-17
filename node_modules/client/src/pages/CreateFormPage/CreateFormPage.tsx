import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateFormMutation } from '../../api/formsApi'
import QuestionBuilder from '../../components/QuestionBuilder/QuestionBuilder'
import type { QuestionType } from '../../types/types'
import {
  createDraftQuestion,
  toQuestionInputs,
  validateDraft,
  type DraftQuestion,
} from '../../utils/formBuilder'
import './CreateFormPage.css'

export default function CreateFormPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    createDraftQuestion('TEXT'),
  ])
  const [createForm, { isLoading, error }] = useCreateFormMutation()
  const [localError, setLocalError] = useState<string | null>(null)

  const validationErrors = useMemo(
    () => validateDraft({ title, questions }),
    [title, questions],
  )

  const canSave = validationErrors.length === 0 && !isLoading

  const addQuestion = (type: QuestionType) => {
    setQuestions((prev) => [...prev, createDraftQuestion(type)])
  }

  const save = async () => {
    const errs = validateDraft({ title, questions })
    if (errs.length) {
      setLocalError(errs[0]!)
      return
    }
    setLocalError(null)

    const result = await createForm({
      title,
      description: description.trim() ? description : null,
      questions: toQuestionInputs(questions),
    }).unwrap()

    navigate(`/forms/${result.id}/fill`)
  }

  return (
    <div className="CreateFormPage stack">
      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="CreateFormPage__h">Create new form</div>
            <div className="muted">Add questions and save</div>
          </div>
          <button className="btn btnPrimary" onClick={save} disabled={!canSave}>
            {isLoading ? 'Saving…' : 'Save form'}
          </button>
        </div>
        <div className="panelBody stack">
          {localError ? <div className="error">{localError}</div> : null}
          {error ? (
            <div className="error">Failed to save form. Please try again.</div>
          ) : null}

          <div className="row">
            <div>
              <div className="CreateFormPage__label">Title</div>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Event registration"
              />
            </div>
            <div>
              <div className="CreateFormPage__label">Description</div>
              <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="optional"
              />
            </div>
          </div>

          <div className="CreateFormPage__addRow">
            <div className="muted" style={{ fontWeight: 700 }}>
              Add question:
            </div>
            <div className="CreateFormPage__addBtns">
              <button className="btn" type="button" onClick={() => addQuestion('TEXT')}>
                Text
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => addQuestion('MULTIPLE_CHOICE')}
              >
                Multiple choice
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => addQuestion('CHECKBOX')}
              >
                Checkboxes
              </button>
              <button className="btn" type="button" onClick={() => addQuestion('DATE')}>
                Date
              </button>
            </div>
          </div>

          <div className="stack">
            {questions.map((q) => (
              <QuestionBuilder
                key={q.id}
                question={q}
                onChange={(next) =>
                  setQuestions((prev) => prev.map((x) => (x.id === q.id ? next : x)))
                }
                onRemove={() =>
                  setQuestions((prev) => prev.filter((x) => x.id !== q.id))
                }
              />
            ))}
          </div>

          {validationErrors.length ? (
            <div className="muted">
              <div style={{ fontWeight: 700 }}>Fix to enable saving:</div>
              <ul className="CreateFormPage__errors">
                {validationErrors.slice(0, 5).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

