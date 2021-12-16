import { MouseEvent } from 'react'
import { withRouter, useHistory, useLocation } from 'react-router-dom'
import { useState, CSSProperties } from 'react'
import { Row } from 'react-flexbox-grid'
import useWindowWidth from '../../hooks/useWindowWidth'
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  // HeaderMenu,
  // HeaderMenuButton,
  HeaderMenuItem,
  OverflowMenu,
  // OverflowMenuItem,
  // SideNav,
  // SideNavItems,
  // HeaderSideNavItems,
  Button,
} from 'carbon-components-react'
import { Menu32 } from '@carbon/icons-react';
import { Tab } from '../../App'

import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator';

const logo = require('../../img/tcp_logo_white.svg')
const logo_name = require('../../img/tcp_logo_name_white.svg')

const PageHeader = () => {
  const [ areNavLinksHidden, setAreNavLinksHidden ] = useState(false)

  const isSmallViewport = useWindowWidth(() => {
    const navLinksElement = document.getElementById('headerNavigationLinks')
    if (navLinksElement !== null) setAreNavLinksHidden(window.getComputedStyle(navLinksElement).display === 'none')
  })

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

  const tabsAsButtons = Object.values(Tab).map((tab, index) => {
    const link = index === 0 ? '/' : '/' + tab.toLowerCase()
    const isCurrentPage = location.pathname === link
    const style: CSSProperties = {
      width: '100%',
      backgroundColor: 'transparent',
    }
    if (isCurrentPage) style.borderLeft = '3px solid #0f62fe'
    return (
      <Button
        className={isCurrentPage ? 'selectedOption' : ''}
        key={index}
        href={link}
        onClick={navigateToRoute.bind(null, link)}
        style={style}
        kind="secondary">
        {tab}
      </Button>
    )
  })

  const iconSize = 28
  const iconMarginHorizontal = 12

  return (
    <HeaderContainer
      render={() => (
        <Header aria-label="Site Header">
          <div style={areNavLinksHidden ? {marginLeft: 8 } : {marginLeft: 8, display: 'none'}}>
            <OverflowMenu
              renderIcon={Menu32}
              selectorPrimaryFocus={'.selectedOption'}
              data-floating-menu-container>
              {tabsAsButtons}
            </OverflowMenu>
          </div>
          <HeaderName href="/" prefix="" className='header_logo' >
            <div style={{marginRight: iconMarginHorizontal, marginLeft: iconMarginHorizontal}}>
              <Row middle="xs">
                { isSmallViewport
                  ? <img src={logo.default} alt="logo" width={iconSize} height={iconSize} />
                  : <img src={logo_name.default} alt="logo" height={iconSize} />
                }
              </Row>
            </div>
          </HeaderName>
          <HeaderNavigation aria-label="Main Site Navigation Links" id="headerNavigationLinks">
            {tabs}
          </HeaderNavigation>
          <div style={{marginLeft: 'auto', marginRight: 16 }}>
            {isSmallViewport ? null : <NetworkIndicator />}
            <span style={{marginLeft: 12}}>
              <Wallet />
            </span>
          </div>
        </Header>
    )} />
  )
}

export default withRouter(PageHeader)
