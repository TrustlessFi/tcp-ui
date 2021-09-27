import { MouseEvent } from 'react'
import { withRouter, useHistory, useLocation } from 'react-router'
import { useEffect, useState, CSSProperties } from 'react'
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
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
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
          <OverflowMenu
            renderIcon={isMenuOpen ? Close32 : Menu32}
            selectorPrimaryFocus={'.selectedOption'}
            data-floating-menu-container>
            {tabsAsButtons}
          </OverflowMenu>
          <HeaderName href="/" prefix="" className='header_logo'>
            <img src={logo} alt="logo" width={32} height={32} style={{marginRight: 16}}/>
            {smallViewport ? null : 'Trustless Currency Protocol'}
          </HeaderName>
          <HeaderNavigation aria-label="Main Site Navigation Links">
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
