import type { AnswerInput, Question } from '../../types/types'
import './QuestionRenderer.css'

type Props = {
  question: Question
  value: AnswerInput | undefined
  onChange: (next: AnswerInput) => void
}

function defaultAnswerFor(q: Question): AnswerInput {
  if (q.type === 'CHECKBOX') return { questionId: q.id, values: [] }
  return { questionId: q.id, value: '' }
}

export default function QuestionRenderer({ question, value, onChange }: Props) {
  const current = value ?? defaultAnswerFor(question)

  return (
    <div className="QuestionRenderer panel">
      <div className="panelBody">
        <div className="QuestionRenderer__titleRow">
          <div className="QuestionRenderer__title">
            {question.title} {question.required ? <span className="QuestionRenderer__req">*</span> : null}
          </div>
          <span className="chip">{question.type}</span>
        </div>

        {question.type === 'TEXT' ? (
          <input
            className="input"
            value={current.value ?? ''}
            onChange={(e) =>
              onChange({ questionId: question.id, value: e.target.value })
            }
            placeholder="Your answer"
          />
        ) : null}

        {question.type === 'DATE' ? (
          <input
            className="input"
            type="date"
            value={current.value ?? ''}
            onChange={(e) =>
              onChange({ questionId: question.id, value: e.target.value })
            }
          />
        ) : null}

        {question.type === 'MULTIPLE_CHOICE' ? (
          <div className="QuestionRenderer__choices">
            {question.options.map((opt) => (
              <label key={opt} className="QuestionRenderer__choice">
                <input
                  type="radio"
                  name={question.id}
                  checked={(current.value ?? '') === opt}
                  onChange={() => onChange({ questionId: question.id, value: opt })}
                />
                {opt}
              </label>
            ))}
          </div>
        ) : null}

        {question.type === 'CHECKBOX' ? (
          <div className="QuestionRenderer__choices">
            {question.options.map((opt) => {
              const selected = (current.values ?? []).includes(opt)
              return (
                <label key={opt} className="QuestionRenderer__choice">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      const next = new Set(current.values ?? [])
                      if (e.target.checked) next.add(opt)
                      else next.delete(opt)
                      onChange({ questionId: question.id, values: Array.from(next) })
                    }}
                  />
                  {opt}
                </label>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

