import MetaMaskOnboarding from "@metamask/onboarding"
import { MouseEvent, useCallback } from 'react'
import { ChainID } from "@trustlessfi/addresses"
import { withRouter, useHistory, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { useState, useEffect, CSSProperties } from 'react'
import { Row } from 'react-flexbox-grid'
import { setTab } from '../../slices/tabs'
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
import { Tab, tabDisplay, tabHidden, tabToPath } from '../../App'

import DebugUtils from '../library/DebugUtils'
import GuardianModal from '../library/GuardianModal'
import MintEthModal from '../library/MintEthModal'
import Wallet from './Wallet'
import NetworkIndicator from '../library/NetworkIndicator'
import { first } from '../../utils'

const logo = require('../../img/tcp_logo_white.svg')
const logo_name = require('../../img/tcp_logo_name_white.svg')

const PageHeader = () => {
  const dispatch = useAppDispatch()

  const [ areNavLinksHidden, setAreNavLinksHidden ] = useState(false)
  const chainID = selector(state => state.chainID)

  const isSmallViewport = useWindowWidth(() => {
    const navLinksElement = document.getElementById('headerNavigationLinks')
    if (navLinksElement !== null) setAreNavLinksHidden(window.getComputedStyle(navLinksElement).display === 'none')
  })

  const {
    tabs,
  } = waitFor([
    'tabs',
  ], selector, dispatch)

  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    dispatch(setTab(pathToTab(location.pathname)))
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

  const pathToTab = (path: string): Tab => {
    const defaultTab = first(Object.values(Tab))
    if (path === '/' || path === '') return defaultTab

    const matchingTabs = Object.values(Tab).filter(tab => tab.toLowerCase() === extractPathBase(path).toLowerCase())

    if (matchingTabs.length === 0)  return defaultTab

    return first(matchingTabs)
  }

  const updateTab = (tab: Tab, e: MouseEvent<Element>) => {
    history.push(tabToPath(tab))
    dispatch(setTab(tab))
    e.preventDefault()
  }

  const tabsDisplay =
    Object.values(Tab)
      .filter(tab => tabHidden[tab] !== true)
      .map((tab, index) => {
        const display = tabDisplay[tab]
        return (
          <HeaderMenuItem
            key={`tab_key_${tab}_${index}`}
            href={index === 0 ? '/' : '/' + tab.toLowerCase()}
            onClick={(e: MouseEvent<Element>) => updateTab(tab, e)}
            isCurrentPage={tab === tabs.currentTab}>
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


  const debugSuite =
    <>
      {
        MetaMaskOnboarding.isMetaMaskInstalled() && chainID !== null
        ? <MintEthModal />
        : null
      }
      {chainID !== ChainID.Hardhat ? null : <DebugUtils />}
      <GuardianModal />
      <NetworkIndicator />
    </>

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
              {tabsDisplay}
            </HeaderNavigation>
            <div style={{marginLeft: 'auto', marginRight: 16 }}>
              {
                isSmallViewport
                ? null
                : debugSuite
              }
              <span style={{marginLeft: 16, marginRight: 8}}>
                <Wallet />
              </span>
            </div>
          </Header>
      ), [
        areNavLinksHidden,
        chainID, isSmallViewport,
        tabs,
        // truEthInfo
      ])
    } />
    </>
  )
}

export default withRouter(PageHeader)
