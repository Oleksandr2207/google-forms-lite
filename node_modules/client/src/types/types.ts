export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE'

export type Question = {
  id: string
  title: string
  type: QuestionType
  required: boolean
  options: string[]
}

export type Form = {
  id: string
  title: string
  description?: string | null
  questions: Question[]
}

export type Answer = {
  questionId: string
  value?: string | null
  values: string[]
}

export type Response = {
  id: string
  formId: string
  submittedAt: string
  answers: Answer[]
}

export type QuestionInput = {
  title: string
  type: QuestionType
  required?: boolean | null
  options?: string[] | null
}

export type AnswerInput = {
  questionId: string
  value?: string | null
  values?: string[] | null
}

