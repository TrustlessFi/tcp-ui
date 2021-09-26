import { MouseEvent } from 'react'
import { withRouter, useHistory, useLocation } from 'react-router'
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
import { Tab } from '../../App'
import logo from '../../img/tcp-logo-white.svg'

import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator';

const PageHeader = () => {
  const history = useHistory()
  const location = useLocation()

  const navigateToRoute = (path: string, e: MouseEvent<Element>) => {
    history.push(path)
    e.preventDefault()
  }

  const tabs = Object.values(Tab).map((tab, index) => {
    const link = index === 0 ? '/' : '/' + tab.toLowerCase()
    const isCurrentPage = location.pathname === link
    return (
      <HeaderMenuItem key={index} href={link} onClick={navigateToRoute.bind(null, link)} isCurrentPage={isCurrentPage}>
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
          <HeaderName href="/" prefix="" className='header_logo'>
            <img src={logo} alt="logo" width={32} height={32} style={{marginRight: 16}}/>
            Trustless Currency Protocol
          </HeaderName>
          <HeaderNavigation aria-label="Main Site Navigation Links">
            {tabs}
          </HeaderNavigation>
          <div style={{marginLeft: 'auto', marginRight: 16 }}>
            <NetworkIndicator />
            <span style={{marginLeft: 12}}>
              <Wallet />
            </span>
          </div>
        </Header>
    )} />
  )
}

export default withRouter(PageHeader)
