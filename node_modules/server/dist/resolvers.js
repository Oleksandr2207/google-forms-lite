import { formStore, responseStore } from './store.js';
export const resolvers = {
    Query: {
        forms: () => formStore.listForms(),
        form: (_parent, args) => formStore.getForm(args.id),
        responses: (_parent, args) => responseStore.listResponses(args.formId),
    },
    Mutation: {
        createForm: (_parent, args) => formStore.createForm({
            title: args.title,
            description: args.description ?? null,
            questions: args.questions ?? [],
        }),
        submitResponse: (_parent, args) => responseStore.submitResponse({
            formId: args.formId,
            answers: args.answers ?? [],
        }),
    },
    Answer: {
        values: (a) => a.values ?? [],
    },
    Question: {
        options: (q) => q.options ?? [],
    },
    Form: {
        questions: (f) => f.questions ?? [],
    },
    Response: {
        answers: (r) => r.answers ?? [],
    },
};
