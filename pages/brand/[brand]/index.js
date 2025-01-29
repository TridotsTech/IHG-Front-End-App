import React, { useState, useEffect, useMemo, useRef } from 'react';
import SearchCom from '@/components/Search/SearchCom'
import { useRouter } from 'next/router'


export default function index({ }) {

  const router = useRouter();
  const [searchRoute,setSearchRoute] = useState()

  useEffect(()=>{

  },[])

  return (
    <>
     {router.query.brand && <SearchCom title={'Brand'} type={'brands'} searchRoute={router.query.brand} />}
    </>
  )

}

