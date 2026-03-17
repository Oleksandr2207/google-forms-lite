import { formStore, responseStore } from './store.js'
import type { Form, Response } from './domain.js'

export const resolvers: any = {
  Query: {
    forms: () => formStore.listForms(),
    form: (_parent: unknown, args: { id: string }) => formStore.getForm(args.id),
    responses: (_parent: unknown, args: { formId: string }) =>
      responseStore.listResponses(args.formId),
  },
  Mutation: {
    createForm: (
      _parent: unknown,
      args: { title: string; description?: string | null; questions?: unknown[] | null },
    ) =>
      formStore.createForm({
        title: args.title,
        description: args.description ?? null,
        questions: (args.questions ?? []) as any,
      }),
    submitResponse: (
      _parent: unknown,
      args: { formId: string; answers?: unknown[] | null },
    ) =>
      responseStore.submitResponse({
        formId: args.formId,
        answers: (args.answers ?? []) as any,
      }),
  },
  Answer: {
    values: (a: { values?: string[] | null }) => a.values ?? [],
  },
  Question: {
    options: (q: { options?: string[] | null }) => q.options ?? [],
  },
  Form: {
    questions: (f: Form) => f.questions ?? [],
  },
  Response: {
    answers: (r: Response) => r.answers ?? [],
  },
}

