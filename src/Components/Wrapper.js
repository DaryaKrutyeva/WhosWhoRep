import { useMediaQuery } from 'react-responsive'
import React from "react";


/** possibly more mobile friendly through react-responsive but will have to test on emulator*/


const MyWrapperComponent = (props) => {
    const isMobile = useMediaQuery({ maxHeight: 100, maxWidth: 100 }, {query:'(orientation: landscape)'});
    const textStyle = isMobile ? 'text-mobile' : 'text-mobile';
  
    return (
      <div className={textStyle}>
       {props.children}
      </div>
    )
  }

  export default MyWrapperComponent;