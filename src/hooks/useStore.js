import {useContext} from 'react';
import { MobXProviderContext } from 'mobx-react'

export default function useStore() {
    return useContext(MobXProviderContext);
}
