import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'

interface Item {
    text: string
    href?: string
}

interface Props {
    items: (Item | string)[]
}

const Breadcrumbs = ({ items }: Props) => {
    const history = useHistory()

    return (
        <Breadcrumb noTrailingSlash>
            {items.map((item, index) => {
                const text = typeof item === 'string' ? item : item.text
                const isLast = index === items.length - 1

                let href: string

                if(typeof item === 'object' && item.href) {
                    href = item.href
                } else {
                    href = `/${text.toLowerCase()}`
                }

                return (
                    <BreadcrumbItem
                        key={text}
                        href={!isLast ? href : undefined}
                        onClick={e => {
                            e.preventDefault()

                            if(!isLast) {
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