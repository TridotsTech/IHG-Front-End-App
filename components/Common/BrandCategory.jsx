
import { setBrand, setFilter } from "@/redux/slice/filtersList"
import Link from "next/link"
import { Fragment } from "react"
import { useDispatch } from "react-redux"

const BrandCategory = ({ masterValue, title, keys, sliceKey }) => {
  const dispatch = useDispatch()
  const changeCategory = (item) => {
    // router.push("/list")
    // router.push("/" + item.redirect_url)
    const val = item
    // console.log(val, "val")
    dispatch(setFilter([val]))
    dispatch(setBrand([]))
  }
  return (
    <>
      <div className="main-width md:px-[10px]">
        <h1 className={`text-[#000000B2] text-[22px] md:text-[18px] font-semibold`}>{title}</h1>

        <div className='grid-cols-6 md:grid-cols-3 grid gap-[10px] py-5 overflow-hidden'>
          {masterValue[keys].slice(0, sliceKey ? sliceKey : masterValue[keys].length).map(res => (
            <Link onClick={() => changeCategory(res)} href={`${keys === "item_group" ? '/list' : `/list?brand=${res}`}`} key={res}>
              {/* <Link href={`/list?${keys === "item_group" ? "category" : "brand"}=${res}`} key={res}> */}
              <h6 className="text-[#00000080] text-[14px] md:text-[13px] font-medium">{res}</h6>
            </Link>
          ))}

        </div>

      </div>
    </>
  )
}

export default BrandCategory