import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

export type BreadcrumbItem = { text: string, href?: string } | string

const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const history = useHistory()

  return (
    <Breadcrumb noTrailingSlash>
      {items.map((item, index) => {
        const text = typeof item === 'string' ? item : item.text
        const isLast = index === items.length - 1

        const href = typeof item === 'object' && item.href !== undefined
          ? item.href
          : `/${text.toLowerCase()}`

        return (
          <BreadcrumbItem
            key={text}
            href={!isLast ? href : undefined}
            onClick={e => {
              e.preventDefault()

              if (!isLast) {
                history.push(href)
              }
            }}
          >
            {text}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  );
}

export default Breadcrumbs
