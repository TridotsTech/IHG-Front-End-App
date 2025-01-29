import Link from "next/link"

const BrandCategory = ({ category }) => {
  return (
    <>
      <div className="bg-[#F0F0F0] py-[30px]">
        <div className="main-width md:px-[10px]">
          <h1 className={`text-[#000000B2] text-[22px] md:text-[18px] font-semibold`}>Brand & Categories</h1>

          {category && category.length > 0 &&
            <div className={`grid grid-cols-4 gap-5 md:gap-3 md:grid-cols-2 py-5 md:py-3`}>
              {category.map(res => (
                <div key={res.name}>
                  <h6 className="text-[#000000B2] text-[16px] md:text-[14px] font-semibold">{res.category_name}</h6>
                  {res.child && res.child.length > 0 && <div className="grid gap-[5px] pt-[10px] md:pt-[5px]">
                    {res.child.map((ch, index) => (
                      <Link key={ch.name} className="text-[#00000080]" href={'/' + ch.route}>{ch.category_name}</Link>
                    ))}
                  </div>}
                </div>
              ))}
            </div>
          }


        </div>
      </div>
    </>
  )
}

export default BrandCategory