import type { DraftQuestion } from '../../utils/formBuilder'
import { isChoiceType } from '../../utils/formBuilder'
import type { QuestionType } from '../../types/types'
import './QuestionBuilder.css'

type Props = {
  question: DraftQuestion
  onChange: (next: DraftQuestion) => void
  onRemove: () => void
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT', label: 'Text' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
  { value: 'CHECKBOX', label: 'Checkboxes' },
  { value: 'DATE', label: 'Date' },
]

export default function QuestionBuilder({ question, onChange, onRemove }: Props) {
  const set = (patch: Partial<DraftQuestion>) => onChange({ ...question, ...patch })

  return (
    <div className="QuestionBuilder panel">
      <div className="panelBody">
        <div className="QuestionBuilder__top">
          <input
            className="input"
            value={question.title}
            placeholder="Question title"
            onChange={(e) => set({ title: e.target.value })}
          />

          <select
            className="select"
            value={question.type}
            onChange={(e) => {
              const nextType = e.target.value as QuestionType
              set({
                type: nextType,
                options: isChoiceType(nextType) ? question.options.length ? question.options : ['Option 1'] : [],
              })
            }}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {isChoiceType(question.type) ? (
          <div className="QuestionBuilder__options">
            <div style={{ fontWeight: 700 }}>Options</div>
            <div className="stack">
              {question.options.map((opt, idx) => (
                <div key={idx} className="QuestionBuilder__optionRow">
                  <input
                    className="input"
                    value={opt}
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) => {
                      const next = [...question.options]
                      next[idx] = e.target.value
                      set({ options: next })
                    }}
                  />
                  <button
                    className="btn btnDanger"
                    type="button"
                    onClick={() => {
                      const next = question.options.filter((_, i) => i !== idx)
                      set({ options: next })
                    }}
                    disabled={question.options.length <= 1}
                    title={question.options.length <= 1 ? 'Keep at least one option' : 'Remove option'}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn"
              type="button"
              onClick={() => set({ options: [...question.options, `Option ${question.options.length + 1}`] })}
            >
              Add option
            </button>
          </div>
        ) : null}

        <div className="QuestionBuilder__bottom">
          <label className="QuestionBuilder__required">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => set({ required: e.target.checked })}
            />
            Required
          </label>

          <button className="btn btnDanger" type="button" onClick={onRemove}>
            Delete question
          </button>
        </div>
      </div>
    </div>
  )
}

