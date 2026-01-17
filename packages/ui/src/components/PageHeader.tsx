
export interface PageHeaderProps {
  title: string
  description?: string
}

export const PageHeader = ({title, description}: PageHeaderProps ) => {
  return (
    <header className="mb-8 space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  )
}