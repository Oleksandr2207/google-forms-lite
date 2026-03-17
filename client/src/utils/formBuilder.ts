import type { QuestionInput, QuestionType } from '../types/types'

export type DraftQuestion = {
  id: string
  title: string
  type: QuestionType
  required: boolean
  options: string[]
}

export function createDraftQuestion(type: QuestionType): DraftQuestion {
  const id = crypto.randomUUID()
  return {
    id,
    title: '',
    type,
    required: false,
    options: type === 'TEXT' || type === 'DATE' ? [] : ['Option 1'],
  }
}

export function toQuestionInputs(draft: DraftQuestion[]): QuestionInput[] {
  return draft.map((q) => ({
    title: q.title.trim() || 'Untitled question',
    type: q.type,
    required: q.required,
    options:
      q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX'
        ? q.options.map((o) => o.trim()).filter(Boolean)
        : [],
  }))
}

export function validateDraft(
  form: { title: string; questions: DraftQuestion[] },
): string[] {
  const errors: string[] = []
  if (!form.title.trim()) errors.push('Form title is required')
  if (form.questions.length === 0) errors.push('Add at least one question')
  form.questions.forEach((q, idx) => {
    if (!q.title.trim()) errors.push(`Question ${idx + 1}: title is required`)
    if ((q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') && q.options.length === 0) {
      errors.push(`Question ${idx + 1}: add at least one option`)
    }
  })
  return errors
}

export function isChoiceType(t: QuestionType) {
  return t === 'MULTIPLE_CHOICE' || t === 'CHECKBOX'
}

