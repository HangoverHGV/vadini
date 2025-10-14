

import { useIntl } from 'react-intl';

export default function Home(){
    const intl = useIntl();

    return <>
    <div className='container'>
        <h1>{intl.formatMessage({ id: 'home.title' })}</h1>
    </div>
    </>
}
