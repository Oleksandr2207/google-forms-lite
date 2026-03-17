import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AnswerInput, Form, QuestionInput, Response } from '../types/types'

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL?.toString() ?? 'http://localhost:4000/'

type GraphQLRequest = {
  query: string
  variables?: Record<string, unknown>
}

type GraphQLError = { message: string }

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

function graphQLOperation<TVariables extends Record<string, unknown> | void>(query: string) {
  return (variables?: TVariables): GraphQLRequest => ({
    query,
    variables: (variables ?? undefined) as any,
  })
}

export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: GRAPHQL_URL,
      headers: { 'content-type': 'application/json' },
    })

    const result = await rawBaseQuery(
      {
        url: '',
        method: 'POST',
        body: args as GraphQLRequest,
      },
      api,
      extraOptions,
    )

    if (result.error) return result

    const payload = result.data as GraphQLResponse<unknown>
    if (payload.errors?.length) {
      return { error: { status: 500, data: payload.errors } }
    }
    return { data: payload.data }
  },
  tagTypes: ['Forms', 'Form', 'Responses'],
  endpoints: (build) => ({
    forms: build.query<Form[], void>({
      query: () =>
        graphQLOperation<void>(/* GraphQL */ `
          query Forms {
            forms {
              id
              title
              description
            }
          }
        `)(),
      transformResponse: (data: { forms: Form[] }) => data.forms,
      providesTags: (result) =>
        result
          ? [
              { type: 'Forms', id: 'LIST' },
              ...result.map((f) => ({ type: 'Form' as const, id: f.id })),
            ]
          : [{ type: 'Forms', id: 'LIST' }],
    }),

    form: build.query<Form, { id: string }>({
      query: ({ id }) =>
        graphQLOperation<{ id: string }>(/* GraphQL */ `
          query Form($id: ID!) {
            form(id: $id) {
              id
              title
              description
              questions {
                id
                title
                type
                required
                options
              }
            }
          }
        `)({ id }),
      transformResponse: (data: { form: Form | null }) => {
        if (!data.form) throw new Error('Form not found')
        return data.form
      },
      providesTags: (_result, _err, arg) => [{ type: 'Form', id: arg.id }],
    }),

    responses: build.query<Response[], { formId: string }>({
      query: ({ formId }) =>
        graphQLOperation<{ formId: string }>(
          /* GraphQL */ `
            query Responses($formId: ID!) {
              responses(formId: $formId) {
                id
                formId
                submittedAt
                answers {
                  questionId
                  value
                  values
                }
              }
            }
          `,
        )({ formId }),
      transformResponse: (data: { responses: Response[] }) => data.responses,
      providesTags: (_result, _err, arg) => [{ type: 'Responses', id: arg.formId }],
    }),

    createForm: build.mutation<
      Form,
      { title: string; description?: string | null; questions?: QuestionInput[] }
    >({
      query: ({ title, description, questions }) =>
        graphQLOperation<{
          title: string
          description?: string | null
          questions?: QuestionInput[]
        }>(
          /* GraphQL */ `
            mutation CreateForm(
              $title: String!
              $description: String
              $questions: [QuestionInput!]
            ) {
              createForm(
                title: $title
                description: $description
                questions: $questions
              ) {
                id
                title
                description
                questions {
                  id
                  title
                  type
                  required
                  options
                }
              }
            }
          `,
        )({ title, description: description ?? null, questions: questions ?? [] }),
      invalidatesTags: [{ type: 'Forms', id: 'LIST' }],
      transformResponse: (data: { createForm: Form }) => data.createForm,
    }),

    submitResponse: build.mutation<
      Response,
      { formId: string; answers?: AnswerInput[] }
    >({
      query: ({ formId, answers }) =>
        graphQLOperation<{ formId: string; answers?: AnswerInput[] }>(
          /* GraphQL */ `
            mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]) {
              submitResponse(formId: $formId, answers: $answers) {
                id
                formId
                submittedAt
                answers {
                  questionId
                  value
                  values
                }
              }
            }
          `,
        )({ formId, answers: answers ?? [] }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Responses', id: arg.formId }],
      transformResponse: (data: { submitResponse: Response }) => data.submitResponse,
    }),
  }),
})

export const {
  useFormsQuery,
  useFormQuery,
  useResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = formsApi

