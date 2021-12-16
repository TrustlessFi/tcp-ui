import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

export type BreadcrumbItemType = { text: string, href: string } | string

const Breadcrumbs = ({ crumbs }: { crumbs?: BreadcrumbItemType[] }) => {
  const history = useHistory()

  if (crumbs === undefined || crumbs.length === 0) return null

  return (
    <Breadcrumb noTrailingSlash>
      {crumbs.map((crumb, index) => (
        typeof crumb === 'object'
        ? <BreadcrumbItem
            key={index}
            href={crumb.href}
            onClick={e => {
              e.preventDefault()
              history.push(crumb.href)
            }}>
            {crumb.text}
          </BreadcrumbItem>
        : <BreadcrumbItem key={index} isCurrentPage={true}>
            {crumb}
          </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

export default Breadcrumbs
