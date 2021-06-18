import React, { MouseEvent, useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import {
  Header,
  HeaderContainer,
  HeaderPanel,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  Switcher,
  SwitcherItem,
  SideNavItems,
  HeaderSideNavItems,
} from 'carbon-components-react';
import { Activity20, Aperture32 } from '@carbon/icons-react';

import MetamaskConnectButton from './MetamaskConnectButton';

const PageHeader = ({}) => {
  const [ txsOpen, setTxsOpen ] = useState(false);

  let history = useHistory()

  const toggleTxsOpen = () => setTxsOpen(!txsOpen)

  const navigateToRoute = (path: string, e: MouseEvent<Element>) => {
    history.push(path);
    e.preventDefault();
  }

  const pages = [
    {display: 'Positions', link: '/'},
    {display: 'Liquidity', link: '/liquidity'},
  ]

  const headerItems = pages.map((page, index) => (
    <HeaderMenuItem key={index} href={page.link} onClick={navigateToRoute.bind(null, page.link)}>
      {page.display}
    </HeaderMenuItem>
  ));

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Site Header">
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <div style={{marginLeft: 16}}>
            <HeaderName href="/" prefix="">
              <Aperture32 />
            </HeaderName>
          </div>
          <HeaderNavigation aria-label="Main Site Navigation Links">
            {headerItems}
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}>
            <SideNavItems>
              <HeaderSideNavItems>
                {headerItems}
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Account" className="metamask-connect-container">
              <MetamaskConnectButton />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Txs" onClick={toggleTxsOpen}>
              <Activity20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <HeaderPanel aria-label="Recent Transactions" expanded={txsOpen}>
            <Switcher aria-label="Recent Transactions List">
              <SwitcherItem aria-label="Transaction Item">
                <div>No recent transactions.</div>
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </Header>
    )} />
  );
}

export default withRouter(PageHeader);
