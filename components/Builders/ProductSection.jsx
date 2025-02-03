import { typesense_search_items } from '@/libs/api'
import { useEffect, useState } from 'react'
import ProductBox from '../Product/ProductBox'
import ViewAll from '../Common/ViewAll'

const ProductSection = ({ data,isMobile }) => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (data && data.filters && JSON.parse(data.filters)) {
            getProducts(JSON.parse(data.filters))
        }
    }, [data])



    const getProducts = async (queryParams) => {
        const data = await typesense_search_items(new URLSearchParams(queryParams));
        const initialData = data.hits || [];
        if (initialData && initialData.length > 0) {
            setProducts(initialData)
        } else {
            setProducts([])
        }
    }

    return (
        <>
            {products && products.length > 0 && <div className="main-width lg:max-w-[1350px] ">
                <ViewAll data={data} viewAll={false} />
                <ProductBox
                    productList={products}
                    remove_bg={true}
                    home={true}
                    rowCount={"flex-[0_0_calc(20%_-_16px)]"}
                    scroll_button={isMobile ? true : false}
                    scroll_id={isMobile ? data.section_name + i : null}
                />
            </div>}
        </>
    )
}

export default ProductSection