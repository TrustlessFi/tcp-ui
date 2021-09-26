import { MouseEvent } from 'react'
import { withRouter, useHistory } from 'react-router'
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from 'carbon-components-react'
import { Aperture32 } from '@carbon/icons-react'
import { Tab } from '../../App'
import logo from '../../img/tcp-logo-white.svg'

import Wallet from './Wallet'

const PageHeader = () => {
  const history = useHistory()

  const navigateToRoute = (path: string, e: MouseEvent<Element>) => {
    history.push(path)
    e.preventDefault()
  }

  const tabs = Object.values(Tab).map((tab, index) => {
    const link = index === 0 ? '/' : '/' + tab.toLowerCase()
    return (
      <HeaderMenuItem key={index} href={link} onClick={navigateToRoute.bind(null, link)}>
        {tab}
      </HeaderMenuItem>
    )
  })

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Site Header">
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}>
            <SideNavItems>
              <HeaderSideNavItems>
                {tabs}
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
          <HeaderName href="/" prefix="" >
            <img src={logo} alt="logo" width={32} height={32} />
          </HeaderName>
          <HeaderNavigation aria-label="Main Site Navigation Links">
            {tabs}
          </HeaderNavigation>
          <div style={{marginLeft: 'auto', marginRight: 20}}>
            <Wallet />
          </div>
        </Header>
    )} />
  )
}

export default withRouter(PageHeader)
