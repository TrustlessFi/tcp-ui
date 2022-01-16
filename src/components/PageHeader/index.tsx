import { MouseEvent } from 'react'
import { ChainID } from "@trustlessfi/addresses"
import { withRouter, useHistory, useLocation } from 'react-router-dom'
import { useAppSelector as selector } from '../../app/hooks'
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
import { Menu32 } from '@carbon/icons-react'
import { Tab, tabDisplay } from '../../App'

import DebugUtils from '../library/DebugUtils'
import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator'
import { first } from '../../utils'

const logo = require('../../img/tcp_logo_white.svg')
const logo_name = require('../../img/tcp_logo_name_white.svg')

const PageHeader = () => {
  const [ areNavLinksHidden, setAreNavLinksHidden ] = useState(false)
  const chainID = selector(state => state.chainID.chainID)

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

  const extractPathBase = (path: string) => {
    path =
      path.substring(0, 1) === '/'
      ? path.substring(1)
      : path

    const slashLocation = path.indexOf('/')
    return slashLocation === -1
      ? path
      : path.substring(0, slashLocation)
  }

  const pagePath = location.pathname
  const currentPage =
    pagePath === '/' || pagePath === ''
    ? first(Object.values(Tab))
    : extractPathBase(pagePath)

  const tabs = Object.values(Tab).map((tab, index) => {
    const tabIsCurrentPage = currentPage.toLowerCase() === tab.toLowerCase()
    const display = tabDisplay[tab]
    const link = index === 0 ? '/' : '/' + tab.toLowerCase()
    return (
      <HeaderMenuItem
      key={index}
      href={link}
      onClick={navigateToRoute.bind(null, link)}
      isCurrentPage={tabIsCurrentPage}>
        {display === undefined ? tab : display}
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
          <div style={{marginLeft: 'auto', marginRight: 8 }}>
            {isSmallViewport || chainID !== ChainID.Hardhat ? null : <DebugUtils />}
            {isSmallViewport ? null : <NetworkIndicator />}
            <span style={{marginLeft: 8}}>
              <Wallet />
            </span>
          </div>
        </Header>
    )} />
  )
}

export default withRouter(PageHeader)
