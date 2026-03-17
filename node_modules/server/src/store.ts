import { randomUUID } from 'node:crypto'
import type {
  CreateFormInput,
  CreateQuestionInput,
  Form,
  Question,
  Response,
  SubmitResponseInput,
} from './domain.js'

type Store = {
  forms: Map<string, Form>
  responsesByFormId: Map<string, Response[]>
}

const store: Store = {
  forms: new Map(),
  responsesByFormId: new Map(),
}

function normalizeOptions(options?: string[] | null): string[] {
  return (options ?? []).map((o) => o.trim()).filter(Boolean)
}

function createQuestion(input: CreateQuestionInput): Question {
  return {
    id: randomUUID(),
    title: input.title.trim() || 'Untitled question',
    type: input.type,
    required: Boolean(input.required ?? false),
    options: normalizeOptions(input.options),
  }
}

export const formStore = {
  listForms(): Form[] {
    return Array.from(store.forms.values())
  },

  getForm(id: string): Form | null {
    return store.forms.get(id) ?? null
  },

  createForm(input: CreateFormInput): Form {
    const form: Form = {
      id: randomUUID(),
      title: input.title.trim() || 'Untitled form',
      description: input.description?.trim() ? input.description.trim() : null,
      questions: (input.questions ?? []).map((q) => createQuestion(q)),
    }

    store.forms.set(form.id, form)
    store.responsesByFormId.set(form.id, [])
    return form
  },
}

function answersMatchForm(
  form: Form,
  answers: { questionId: string; value?: string | null; values?: string[] | null }[],
): { ok: true } | { ok: false; message: string } {
  const questionById = new Map(form.questions.map((q) => [q.id, q]))
  for (const ans of answers) {
    const q = questionById.get(ans.questionId)
    if (!q) return { ok: false, message: `Unknown questionId: ${ans.questionId}` }

    if (q.type === 'CHECKBOX') {
      const values = (ans.values ?? []).map((v) => v.trim()).filter(Boolean)
      if (q.required && values.length === 0) {
        return { ok: false, message: `Question "${q.title}" is required` }
      }
      if (q.options.length > 0 && values.some((v) => !q.options.includes(v))) {
        return { ok: false, message: `Invalid checkbox value for "${q.title}"` }
      }
      continue
    }

    const value = (ans.value ?? '').trim()
    if (q.required && !value) {
      return { ok: false, message: `Question "${q.title}" is required` }
    }
    if (q.type === 'MULTIPLE_CHOICE' && q.options.length > 0 && value) {
      if (!q.options.includes(value)) {
        return { ok: false, message: `Invalid option for "${q.title}"` }
      }
    }
  }
  return { ok: true }
}

export const responseStore = {
  listResponses(formId: string): Response[] {
    return store.responsesByFormId.get(formId) ?? []
  },

  submitResponse(input: SubmitResponseInput): Response {
    const form = formStore.getForm(input.formId)
    if (!form) throw new Error('Form not found')

    const rawAnswers = (input.answers ?? []).map((a) => ({
      questionId: a.questionId,
      value: a.value ?? null,
      values: a.values ?? [],
    }))

    const validation = answersMatchForm(form, rawAnswers)
    if (!validation.ok) throw new Error(validation.message)

    const response: Response = {
      id: randomUUID(),
      formId: input.formId,
      submittedAt: new Date().toISOString(),
      answers: rawAnswers.map((a) => ({
        questionId: a.questionId,
        value: a.value ?? null,
        values: (a.values ?? []).map((v) => v.trim()).filter(Boolean),
      })),
    }

    const existing = store.responsesByFormId.get(input.formId) ?? []
    existing.push(response)
    store.responsesByFormId.set(input.formId, existing)
    return response
  },
}

