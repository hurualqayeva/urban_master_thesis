import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={`rounded-lg border p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
Alert.displayName = "Alert"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className = "", ...props }, ref) => (
    <h5
      ref={ref}
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }