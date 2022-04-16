import ManagePosition from './ManagePosition'
import { red, orange, green } from '@carbon/colors';

const Positions = () => {
    return (
      <ManagePosition />
    )
}

export const getCollateralRatioColor = (
  collateralization: number,
  collateralRatioRequirement: number,
) => {
    if (collateralization < collateralRatioRequirement * 1.1) return red[50]
    else if (collateralization < collateralRatioRequirement * 1.5) return orange
    else return green[50]
}

export default Positions
