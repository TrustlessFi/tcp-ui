import { MouseEvent } from 'react'
import { withRouter, useHistory, useLocation } from 'react-router'
import { useEffect, useState, useRef, CSSProperties } from 'react'
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  OverflowMenu,
  OverflowMenuItem,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
  Button,
} from 'carbon-components-react'
import { Menu32, Close32 } from '@carbon/icons-react';
import { Tab } from '../../App'
import logo from '../../img/tcp-logo-white.svg'

import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator';

const PageHeader = () => {
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)
  const [ areNavLinksHidden, setAreNavLinksHidden ] = useState(false)

  const navLinks = "headerNavigationLinks"

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      const navLinksElement = document.getElementById(navLinks)
      if (navLinksElement !== null) setAreNavLinksHidden(window.getComputedStyle(navLinksElement).display === 'none')
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', handleResize)
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

  const smallViewport = windowWidth < 650

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
          <HeaderName href="/" prefix="" className='header_logo'>
            <img src={logo} alt="logo" width={32} height={32} style={{marginRight: 16}}/>
            {smallViewport ? null : 'Trustless Currency Protocol'}
          </HeaderName>
          <HeaderNavigation aria-label="Main Site Navigation Links" id="headerNavigationLinks">
            {tabs}
          </HeaderNavigation>
          <div style={{marginLeft: 'auto', marginRight: 16 }}>
            {smallViewport ? null : <NetworkIndicator />}
            <span style={{marginLeft: 12}}>
              <Wallet />
            </span>
          </div>
        </Header>
    )} />
  )
}

export default withRouter(PageHeader)
