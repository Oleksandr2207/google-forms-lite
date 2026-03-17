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

export type CreateQuestionInput = {
  title: string
  type: QuestionType
  required?: boolean | null
  options?: string[] | null
}

export type CreateFormInput = {
  title: string
  description?: string | null
  questions?: CreateQuestionInput[] | null
}

export type SubmitAnswerInput = {
  questionId: string
  value?: string | null
  values?: string[] | null
}

export type SubmitResponseInput = {
  formId: string
  answers?: SubmitAnswerInput[] | null
}

