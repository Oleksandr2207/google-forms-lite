import { readFileSync } from 'node:fs'

export function loadTypeDefs(): string {
  return readFileSync(new URL('../schema.graphql', import.meta.url), 'utf-8')
}

