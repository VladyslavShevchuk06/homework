import { Card, CardContent } from '@/app/shared/components/ui'

const PLACEHOLDER_COUNT = 8

// component
export function ItemsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-slate-200" />
        <div className="h-10 w-44 animate-pulse rounded-md bg-slate-200" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-0">
              <div className="h-48 w-full animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
