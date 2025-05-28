import React from 'react'
import ReactLoading from 'react-loading';

const Loading = ({styles}) => {
    return (
        <div style={{ width: '100vw', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", ...styles }}>
            <ReactLoading type={'spin'} color='#1976D2' height={'5%'} width={'5%'} />
        </div>
    )
}

export default Loading