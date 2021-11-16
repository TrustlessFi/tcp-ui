import { Button } from 'carbon-components-react'
import { useAppDispatch } from '../../app/hooks'
import { close } from '../../slices/liquidityPositionsEditor'

const BackButton = () => {
    const dispatch = useAppDispatch()

    return (
        <div style={{marginBottom: 32}}>
        <Button onClick={() => dispatch(close())}>Go Back</Button>
        </div>
    );
}

export default BackButton