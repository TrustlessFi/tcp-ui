import { Component, CSSProperties } from "react";

import { Tile } from "carbon-components-react";

interface AppTile {
  className?: string,
  title: string
  style?: CSSProperties
}

class BorrowCoinTile extends Component<AppTile> {

  constructor(props: AppTile) {
    super(props);
  }

  render() {
    let { children, className, title, style } = this.props

    return (
      <Tile style={{ margin: 2, ...style }} className={className}>
        <span style={{fontSize: 24}}>{title}</span>
        <div style={{marginTop: 12, marginBottom: 12}}>
          {children}
        </div>
      </Tile>
    );
  }
}

export default BorrowCoinTile;
