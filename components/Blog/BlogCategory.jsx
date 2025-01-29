import { useRouter } from "next/router";
import Link from 'next/link'

export default function BlogCategory({category}){

  const router = useRouter();

  return(
      <>
      <div className="lg:border rounded-[5px] md:flex md:overflow-x-auto md:w-[100%] scrollbarHide md:py-[10px]">
            <h1 className="bg-[#f2f2f2] md:hidden text-[#181b29] text-center py-[15px] px-[5px] text-[14px] font-semibold">
              BLOG Category
            </h1>
              {/* <li className="lg:hidden list-none text-[16px]" onClick={router.push('/blog')}><p className="w-max px-[10px]">All</p></li> */}
            {category && category.length != 0 &&
              category.map((item, id) => {
                return (
                  // onClick={() => router.push('/' + item.route)}
                  <Link href={'/' + item.route} key={id}className={`${(router.asPath == ('/' + item.route)) ? 'lg:bg-[#f1f1f1] active_blog' : ''} lg:last:border-b-[0] lg:border-b-[1px] lg:w-full lg:border-b-slate-100 list-none text-[16px] lg:pt-[10px] px-[10px] lg:pb-[5px] text-[#181b29] cursor-pointer block md:flex-[0_0_auto]`}>{ item.title}</Link>
                );
              })}
          </div>
      </>
  )

}