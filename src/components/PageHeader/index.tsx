import { MouseEvent, useCallback } from 'react'
import { ChainID } from "@trustlessfi/addresses"
import { withRouter, useHistory, useLocation } from 'react-router-dom'
import { useAppSelector as selector } from '../../app/hooks'
import { useState, useEffect, CSSProperties } from 'react'
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
import { Menu32, List32 } from '@carbon/icons-react'
import { Tab, tabDisplay, tabHidden } from '../../App'
import { UI_VERSION } from '../../constants'

import DebugUtils from '../library/DebugUtils'
import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator'
import LargeText from '../library/LargeText'
import SpacedList from '../library/SpacedList'
import Center from '../library/Center'
import { first } from '../../utils'

const logo = require('../../img/tcp_logo_white.svg')
const logo_name = require('../../img/tcp_logo_name_white.svg')

const PageHeader = () => {
  const [ areNavLinksHidden, setAreNavLinksHidden ] = useState(false)
  const chainID = selector(state => state.chainID)

  const isSmallViewport = useWindowWidth(() => {
    const navLinksElement = document.getElementById('headerNavigationLinks')
    if (navLinksElement !== null) setAreNavLinksHidden(window.getComputedStyle(navLinksElement).display === 'none')
  })

  const history = useHistory()
  const location = useLocation()

  const [currentTab, setCurrentTab] = useState<Tab | null>(null)

  useEffect(() => {
    setCurrentTab(pathToTab(location.pathname))
  }, [])

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

  const tabToPath = (tab: Tab) => `/${tab.toLowerCase()}`

  const pathToTab = (path: string): Tab => {
    if (path === '/' || path === '') return first(Object.values(Tab))
    console.log({path})

    return first(Object.values(Tab).filter(tab => tab.toLowerCase() === extractPathBase(path).toLowerCase()))
  }

  const updateTab = (tab: Tab, e: MouseEvent<Element>) => {
    history.replace(tabToPath(tab))
    setCurrentTab(tab)
    e.preventDefault()
  }

  const tabs =
    Object.values(Tab)
      .filter(tab => tabHidden[tab] !== true)
      .map((tab, index) => {
        const display = tabDisplay[tab]
        const link = index === 0 ? '/' : '/' + tab.toLowerCase()
        const key = `${location.pathname}_tab_key_${tab}_${index}`
        return (
          <HeaderMenuItem
            key={key}
            href={link}
            onClick={(e: MouseEvent<Element>) => updateTab(tab, e)}
            isCurrentPage={tab === currentTab}>
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
        onClick={updateTab.bind(null, tab)}
        style={style}
        kind="secondary">
        {tab}
      </Button>
    )
  })

  const iconSize = 28
  const iconMarginHorizontal = 12

  return (
    <>
      <HeaderContainer
        render={useCallback(() => (
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
      ), [areNavLinksHidden, chainID, isSmallViewport])} />
    </>
  )
}

export default withRouter(PageHeader)
