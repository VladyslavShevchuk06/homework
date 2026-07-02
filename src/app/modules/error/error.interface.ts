// interface
export interface IErrorModuleProps {
  title?: string
  description?: string
  reset?: () => void
  error?: Error & { digest?: string }
}
