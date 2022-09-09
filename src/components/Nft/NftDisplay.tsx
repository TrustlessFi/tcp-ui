import OneColumnDisplay from '../library/OneColumnDisplay'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import DataList, { DataListRows } from '../library/DataList'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
} from 'carbon-components-react'
import { numDisplay } from '../../utils'

import { InlineLoading } from 'carbon-components-react'



const NftDisplay = () => {
  const dispatch = useAppDispatch()

  const {
    nftPyramid,
  } = waitFor([
    'nftPyramid',
  ], selector, dispatch)



  return (
    <OneColumnDisplay loading={false}>

      <Tile style={{padding: 40, marginTop: 40}}>
        {
          nftPyramid === null
            ? <InlineLoading />
            : <SpacedList spacing={15}>
                <div>
                  Hello
                </div>
                <div>
                  World
                </div>
                <div>
                  {JSON.stringify(nftPyramid)}
                </div>
              </SpacedList>
        }

      </Tile>
    </OneColumnDisplay>
  )
}

export default NftDisplay
