import React from 'react'
import Image from 'next/image';

export default function LoaderButton(props) {

  function clickBtn(){
    props.loader ? null : props.buttonClick() 
  }

  return (
    <>
       <button className={`${props.cssClass ? props.cssClass : 'm-[0px_auto]'} ${props.loader ? 'opacity-[0.9]' : null} flex items-center justify-center text-[14px] h-[40px] focus:outline-none focus-visible:ring-2`} onClick={() => clickBtn()}>
          {!props.loader && props.image_left && <span className={'mr-[10px] h-[18px]'}  > <Image className={'h-[18px] object-contain'} height={10} width={20} alt={'add cart'} src={props.image_left} /></span>}
          {!props.loader && props.button_name}
          {!props.loader && props.image_right && <span className={'ml-[10px] h-[18px]'}  > <Image className={'h-[18px] object-contain'} height={10} width={20} alt={'add cart'} src={props.image_right} /></span>}
          {props.loader && <div class="animate-spin rounded-full h-[15px] w-[15px] border-l-2 border-t-2 border-white"></div>}
       </button>
    </>
  )
}
