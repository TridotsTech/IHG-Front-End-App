
import { Fragment } from "react"

const BrandCategory = ({ masterValue,title,keys,sliceKey }) => {
  return (
    <>
      <div className="main-width md:px-[10px]">
        <h1 className={`text-[#000000B2] text-[22px] md:text-[18px] font-semibold`}>{title}</h1>

        <div className='grid-cols-6 md:grid-cols-3 grid gap-[10px] py-5'>
          {masterValue[keys].slice(0,sliceKey ? sliceKey : masterValue[keys].length).map(res => (
            <Fragment key={res}>
              <h6 className="text-[#00000080] text-[14px] md:text-[13px] font-medium">{res}</h6>
            </Fragment>
          ))}

        </div>

      </div>
    </>
  )
}

export default BrandCategory