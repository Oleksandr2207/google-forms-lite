import {useMemo, useState } from 'react'

type Params = {
  totalItems: number
  itemsPerPage: number
}

export function usePagination({ totalItems, itemsPerPage }: Params) {
  const pageCount = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const [pageIndex, setPageIndex] = useState(0)

const safePageIndex = Math.min(pageIndex, pageCount - 1)

  const slice = useMemo(() => {
  const start = safePageIndex * itemsPerPage
  const end = start + itemsPerPage
  return { start, end }
}, [itemsPerPage, safePageIndex])

  return {
  pageIndex: safePageIndex,
  setPageIndex,
  pageCount,
  slice,
}
}

