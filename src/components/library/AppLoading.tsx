import { Loading } from 'carbon-components-react';
import React, { FunctionComponent } from 'react';
import Center from './Center';

interface AppLoadingProps {
  active?: boolean
  description: string,
  small?: boolean
  withOverlay?: boolean,
}

const AppLoading: FunctionComponent<AppLoadingProps> = props => (
  <Center>
    <Loading
      {...props}
    />
  </Center>
);

export default AppLoading;