import { useState, useEffect, useMemo, useRef, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { seo_Image, getCurrentUrl, typesense_search_items, get_all_masters } from '@/libs/api';
import dynamic from 'next/dynamic';
const ProductBox = dynamic(() => import('@/components/Product/ProductBox'))
const Filters = dynamic(() => import('@/components/Product/filters/Filters'))
const CurrentProductFilter = dynamic(() => import('@/components/Product/filters/CurrentProductFilter'))
const NoProductFound = dynamic(() => import('@/components/Common/NoProductFound'))
const MobileHeader = dynamic(() => import('@/components/Headers/mobileHeader/MobileHeader'))
const MobileCategoryFilter = dynamic(() => import('@/components/Product/filters/MobileCategoryFilter'))
import { useRouter } from 'next/router'
import Image from 'next/image';
import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import { setBoxView } from '@/redux/slice/websiteSettings'
import { resetSetFilters, setLoad } from '@/redux/slice/ProductListFilters'
import { resetFilters } from "@/redux/slice/filtersList";
import Head from 'next/head'
import { Switch } from '@headlessui/react';
import clsx from 'clsx'
import SearchCom from '@/components/Search/SearchCom';
import useTabView from '@/libs/hooks/useTabView';
import SearchProduct from '@/components/Search/SearchProduct';


export default function List({ productRoute, filterInfo, currentId, params, initialData, found }) {

  // console.log('maste', mastersData)
  const router = useRouter();
  const initialValue = {
    q: "*",
    page_no: 1,
    item_description: "",
    sort_by: '',
    hot_product: false,
    show_promotion: false,
    in_stock: false,
    brand: [],
    price_range: { min: 0, max: 100000 },
    stock_range: { min: 0, max: 100000 },
    product_type: '',
    has_variants: false,
    custom_in_bundle_item: false,
    category_list: [],
    item_group: [],
    beam_angle: [],
    lumen_output: [],
    mounting: [],
    ip_rate: [],
    lamp_type: [],
    power: [],
    input: [],
    dimension: '',
    material: [],
    body_finish: [],
    warranty_: [],
    output_voltage: [],
    output_current: [],
    color_temp_: []
  }
  const [filters, setFilters] = useState({
    ...initialValue,
    price_range: { min: 0, max: 100000 },
    stock_range: { min: 0, max: 100000 }
  });

  const [foundValue, setFoundValue] = useState(0);


  // useEffect(() => {
  //   setResults(initialData)
  //   setFoundValue(found)
  // }, [router])

  // console.log("foundValue", foundValue)

  const [mastersData, setMastersData] = useState([]);
  const tabView = useTabView();

  useEffect(() => {
    const getMasterData = async () => {
      const mastersRes = await get_all_masters();
      // console.log('master', mastersRes)
      if (mastersRes.message) {
        setMastersData(mastersRes.message)
      }
    }

    getMasterData()
  }, [])

  // console.log('maste', mastersData)



  let [productList, setProductList] = useState([]);

  let [loader, setLoader] = useState(true);
  let [pageLoading, setPageLoading] = useState(true);

  const [filtersList, setFiltersList] = useState();
  const cartItems = useSelector((state) => state.cartSettings.cartItems)
  const webSettings = useSelector((state) => state.webSettings.websiteSettings)
  const productBoxView = useSelector((state) => state.webSettings.productBoxView)
  let productFilters = useSelector((state) => state.ProductListFilters.filtersValue)
  const productFilter = useSelector((state) => state.FiltersList.filtersValue)
  let loadData = useSelector((state) => state.ProductListFilters.filtersValue.loadData)
  const address = useSelector((state) => state.webSettings.adddressInfo);
  const dispatch = useDispatch();
  let [top, setTop] = useState(true)
  let cardref = useRef();



  const filtersData = useSelector((state) => state.FiltersList)
  // console.log('filterdata', filtersData)

  let [loadSpinner, setLoadSpinner] = useState(false);
  let [no_product, setNoProduct] = useState(true);
  const [currentRoute, setCurrentRoute] = useState()
  // let min_price = 0
  // let max_price = 0
  let rating = 0
  // let productRoute = ''
  // let page_no = 1;


  useEffect(() => {
    // const store = createStore(resetSetFilters, initialState);
    if (typeof window != 'undefined') {
      // dispatch(resetSetFilters());
      setLoader(true);
      setPageLoading(false);
      setFiltersList(filterInfo)
      setCurrentRoute(currentId)
      no_product = false
      setNoProduct(no_product)
      getProductList();
      getCategoryFilters();
    }

  }, [router, address])

  useEffect(() => {
    router.events.on("routeChangeStart", exitingFunction);
    return () => {
      router.events.off("routeChangeStart", exitingFunction);
    };
  }, [router.events]);

  const exitingFunction = () => {
    dispatch(resetSetFilters());
  };

  // useEffect(() => {

  //     const intersectionObserver = new IntersectionObserver(entries => {
  //       if (entries[0].intersectionRatio <= 0) return;

  //       if (!no_product) {
  //          no_product = true
  //          setNoProduct(no_product)
  //          setTimeout(()=>{
  //           let updatedPageNo = productFilters.page_no + 1;
  //           let obj = { ...productFilters, page_no: updatedPageNo };
  //           setPageLoading(true);
  //           dispatch(setFilters(obj));
  //          },800)
  //       }
  //     },{
  //       root: null,
  //       rootMargin: "500px",
  //       threshold: 0.5,
  //     }
  //     );

  //     intersectionObserver.observe(cardref?.current);

  //     return () => {
  //       cardref?.current && intersectionObserver.unobserve(cardref?.current)
  //     }



  // }, [productFilters,no_product])

  // const handleScroll = () => {
  //   const cardElement = cardref.current;
  //   const windowHeight = window.innerHeight;
  //   const scrollY = window.scrollY;
  //   const cardPosition = cardElement.getBoundingClientRect().top;

  //   if (cardPosition - windowHeight < 2000) {
  //     if (!no_product) {
  //       no_product = true
  //       let obj = { page_no :productFilters.page_no + 1  } 
  //       dispatch(setFilters(obj));
  //     }
  //   }
  // };




  useEffect(() => {
    // no_product = false
    // setNoProduct(no_product)
    if (productFilters && productFilters.page_no) {
      if (productFilters.page_no * 16 == productList?.length) {
        no_product = false
      } else {
        no_product = true
      }
    }

    if (typeof window != 'undefined') {

      const handleScroll = () => {
        const cardElement = cardref.current;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const cardPosition = cardElement?.getBoundingClientRect().top;

        if (cardPosition - windowHeight < 2000 && top) {
          // Your logic here when the card is near the viewport
          // Example: dispatch an action or call a function
          // console.log(no_product, 'no_product');
          if (!no_product) {
            no_product = true
            // setNoProduct(no_product)
            // setTimeout(() => {
            let updatedPageNo = productFilters.page_no + 1;
            let obj = { ...productFilters, page_no: updatedPageNo };
            setPageLoading(true);
            // dispatch(setFilters(obj));

            // dispatch(setLoad(loadData ? false : true))
            // }, 800)
          }
        }
      };

      // Attach the scroll event listener
      window.addEventListener('scroll', handleScroll);

      // Cleanup: Remove the scroll event listener when the component unmounts
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [no_product, productList]);



  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768; // Adjust this value to define your mobile width threshold
      if (window.innerWidth <= mobileWidth) {
        dispatch(setBoxView('List View'));
      } else {
        dispatch(setBoxView('Grid View'));
      }
    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);

  async function getCategoryFilters() {
    // productRoute = router.asPath.substring(1);
    let data = { "route": productRoute }
    // let res = await get_category_filters(data);
    let res = [];
    if (res && res.message) {
      setFiltersList(res.message)
      if (res.message.category_list && res.message.category_list.current_category && res.message.category_list.current_category.category_name) {
        // setCurrentRoute(res.message.category_list.current_category)
        // setMeta({meta_title:res.message.category_list.current_category.category_name,meta_description:res.message.category_list.current_category.category_name})
      }
    }
  }

  useMemo(() => {
    if (typeof window !== 'undefined') {
      if (loadData) {
        // console.log("loaddata")
        getProductList()
        dispatch(setLoad(false))
      }

    }
  }, [loadData])

  // const memoizedCallback = useCallback(() => {
  //   getProductList();
  // }, [productFilters]);

  // useMemo(() => {
  //   if (typeof window !== 'undefined') {
  //     getProductList()
  //   }
  // }, [productFilters])

  function ProductFilter(value) {
    no_product = false
    setNoProduct(no_product)
    // no_product = true
    let obj = { page_no: 1 }
    let data = { ...value, ...obj }
    top = false
    setTop(top)
    window.scrollTo(0, 0);
    setLoader(true);
    setLoadSpinner(true)
    dispatch(setFilters(data));
    setTimeout(() => {
      top = true
      setTop(top)
    }, [200])

    // if (value) {
    //   let key = Object.keys(value)[0];
    //   if (key.length != 0) {
    //     if (key == 'brands') {
    //       brands = value[key];
    //       // setBrand((prevBrand) => brands);
    //       setBrands(brands)
    //     } else if (key == 'attribute') {
    //       attributes = value[key];
    //       setAttribute(attributes)
    //     } else if (key == 'sort') {
    //       sort = value[key];
    //       setSort(sort)
    //     } else if (key == 'minPrice') {
    //       min_price = value[key];
    //       let key_1 = Object.keys(value)[1];
    //       max_price = value[key_1];
    //     }else if (key == 'rating') {
    //       rating = value[key];
    //     }


    //     page_no = 1;
    //     // setPageNo(page_no)
    //     // no_product = false;
    //     setLoader(true);
    //     getProductList()
    //   }
    // }


  }




  async function getProductList() {

    // let data = await val
    // console.log('data')
    // setProductList(d => d = )
    // productRoute = router.asPath.substring(1);



    let datas = {
      "route": productRoute,
      "sort_by": productFilters.sort,//sort,
      "min_price": productFilters.min_price > 0 ? productFilters.min_price : undefined,// min,
      "max_price": productFilters.max_price > 0 ? productFilters.max_price : undefined,//max,
      "page_no": productFilters.page_no,//page,
      "page_size": 16,
      "brands": productFilters.brands, //brands,   this.db.choosed_attributes.toString()
      "attributes": productFilters.attributes, //attributes,
      "rating": productFilters.rating > 0 ? productFilters.rating : undefined,
      "code": productFilters.code,
      "description": productFilters.description,
    }


    try {
      // let res = await get_category_products(datas);
      let res = [];

      setLoader(false);
      setPageLoading(false);
      setLoadSpinner(false);
      // console.log(res,'res')
      if (res && res.message && res.message.status != "Failed") {

        if (res.message.length != 0) {
          productFilters.page_no == 1 ? setProductList(res.message) : setProductList(d => d = [...d, ...res.message])
          no_product = false;
          setNoProduct(no_product)
          dispatch(setLoad(false))
        } else {
          productFilters.page_no == 1 ? setProductList([]) : setProductList([...productList])
          no_product = true;
          setNoProduct(no_product)
          dispatch(setLoad(false))
        }


      } else {
        productFilters.page_no == 1 ? setProductList([]) : null;
        no_product = true;
        setNoProduct(no_product)
        dispatch(setLoad(false))
      }
    } catch (error) {
      router.push('/404')
    }

  }



  const [theme_settings, setTheme_settings] = useState()


  useMemo(() => {

    if (webSettings && webSettings.app_settings) {
      let settings = webSettings.app_settings;
      setTheme_settings(settings);

      let route = router.asPath.split('/')[1]
      let value = webSettings.all_categories.find(res => { return res.route == route })
      if (value) {
        setCurrentRoute(value);
      }
    }

  }, [webSettings, router])


  const [isOpenCat, setIsOpenCat] = useState(false)

  function closeModal() {
    setIsOpenCat(false)
  }

  function titleClick() {
    setIsOpenCat(true)
  }

  const clearFilter = (filters, type) => {
    // dispatch(clearFilters(filters));
    let obj = filters;
    productFilters = JSON.stringify(productFilters)
    productFilters = JSON.parse(productFilters)

    if (type == 'clearAll') {
      ProductFilter({ 'attribute': [], 'brands': '', selectedAttributes: [], minPrice: 0, maxPrice: 0, rating: 0 })
      removeAttributeFilter(productFilters, type, obj)
      removeBrandsFilter(productFilters, type, obj)
    } else {
      checkFilter(productFilters, type, obj)
    }
  }

  function checkFilter(productFilters, type, obj) {
    if (obj.filterType == 'Attribute') {
      removeAttributeFilter(productFilters, type, obj)
    } else if (obj.filterType == 'Brand') {
      removeBrandsFilter(productFilters, type, obj)
    } else if (obj.filterType == 'Min_price') {
      removeMinPrice(productFilters, type)
    } else if (obj.filterType == 'Max_price') {
      removeMaxPrice(productFilters, type)
    } else if (obj.filterType == 'Rating') {
      let selectedAttributes = productFilters.selectedAttributes.filter(res => { return res.filterType != 'Rating' })
      ProductFilter({ 'rating': rating, value: rating, 'selectedAttributes': selectedAttributes })
    }
  }

  function removeMinPrice(productFilters, type) {
    let selectedAttributes = productFilters.selectedAttributes
    let checkValue = selectedAttributes.findIndex(res => { return (res.filterType && res.filterType == 'Min_price') })
    selectedAttributes.splice(checkValue, 1)
    type == 'clearAll' ? '' : ProductFilter({ 'minPrice': 0, 'selectedAttributes': selectedAttributes })
  }

  function removeMaxPrice(productFilters, type) {
    let selectedAttributes = productFilters.selectedAttributes
    let checkValue = selectedAttributes.findIndex(res => { return (res.filterType && res.filterType == 'Max_price') })
    selectedAttributes.splice(checkValue, 1)
    type == 'clearAll' ? '' : ProductFilter({ 'maxPrice': 0, 'selectedAttributes': selectedAttributes })
  }

  function removeBrandsFilter(productFilters, type, obj) {
    if (filtersList.brand_list && filtersList.brand_list.length != 0) {
      filtersList.brand_list.map(res => {
        if ((res.unique_name == (obj && obj.unique_name)) || type == 'clearAll') {
          res.isActive = false
          type == 'clearAll' ? '' : brandFilters(productFilters, obj)
        }
      })
    }
  }

  function brandFilters(productFilters, obj) {
    productFilters.selectedAttributes = productFilters.selectedAttributes.filter(j => { return j.unique_name != obj.unique_name })
    productFilters.brands = productFilters.brands.replace((obj.unique_name + ','), '')
    ProductFilter({ 'brands': productFilters.brands, 'selectedAttributes': productFilters.selectedAttributes })
  }


  function removeAttributeFilter(productFilters, type, obj) {
    if (filtersList.attribute_list && filtersList.attribute_list.length != 0) {

      filtersList.attribute_list.map(attr => {

        if ((attr.attribute_unique_name == (obj && obj.attr)) || type == 'clearAll') {

          attr.options.map((option, index) => {

            if ((option.unique_name == (obj && obj.unique_name)) || type == 'clearAll') {
              option.isActive = false
              type == 'clearAll' ? '' : attributeFilters(productFilters, attr, option, obj)
            }

          })

        }

      })

    }
  }

  function attributeFilters(productFilters, attr, option, obj) {

    productFilters.attributes.map(r => {
      if (r.attribute == attr.attribute_unique_name) {
        r.value = r.value.replace((obj.unique_name + ','), '')
      }
      productFilters.selectedAttributes = productFilters.selectedAttributes.filter(j => { return j.unique_name != option.unique_name })
    })

    ProductFilter({ 'attribute': productFilters.attributes, 'selectedAttributes': productFilters.selectedAttributes })
  }

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceBetween, setPriceBetween] = useState({ min: 0.0, max: 100 })
  const [pageNo, setpageNo] = useState(1)
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { category, brand } = router.query;
  // console.log(category, brand)



  // console.log("fiterValue", filters)

  useEffect(() => {
    if (!router.isReady) return;

    // console.log('Query Params:', router.query);

    setFilters((prevFilters) => ({
      ...prevFilters,
      item_group: category ? (Array.isArray(category) ? category : category.split(",")) : [],
      brand: brand ? (Array.isArray(brand) ? brand : brand.split(",")) : [],
    }));
  }, [router.isReady, category, brand, router]);

  // console.log('querFilter', filters)

  // useEffect(()=>{
  //   if(filters.item_group.length === 0){
  //     router.replace('/list?category=')
  //   }
  // },[filters.item_group])


  const buildFilterQuery = () => {
    const filterParams = [];
    const { price_range, stock_range, ...rest } = filters;

    // if (rest.item_code) filterParams.push(`item_code:${rest.item_code}*`);
    if (rest.item_description) filterParams.push(`item_description:${rest.item_description}*`);
    if (rest.product_type) filterParams.push(`product_type:${rest.product_type}`);
    if (rest.dimension) filterParams.push(`dimension:${rest.dimension}`);
    if (rest.hot_product) filterParams.push(`hot_product:=${rest.hot_product ? 1 : 0}`);
    if (rest.show_promotion) filterParams.push(`offer_rate:>0`);
    if (rest.in_stock) filterParams.push(`stock:>0`);
    if (rest.has_variants) filterParams.push(`has_variants:=${rest.has_variants ? 1 : 0}`);
    if (rest.custom_in_bundle_item) filterParams.push(`is_bundle_item:=${rest.custom_in_bundle_item ? 1 : 0}`);
    // if (rest.sort_by) filterParams.push(`sort_by:=${rest.sort_by}`);

    [
      "brand", "color_temp_", "item_group", "beam_angle", "lumen_output", "mounting", "ip_rate", "lamp_type",
      "power", "input", "material", "body_finish", "warranty_",
      "output_voltage", "output_current", "category_list"
    ].forEach(key => {
      if (rest[key]?.length) {
        const values = rest[key].map(v => `"${v}"`).join(",")
        filterParams.push(`${key}:=[${values}]`);
      }
    });



    if (price_range?.min > 0 && price_range?.max) {
      filterParams.push(`rate:>${price_range.min} && rate:<${price_range.max}`);
    }
    if (stock_range?.min > 0 && stock_range?.max) {
      filterParams.push(`stock:>${stock_range.min} && stock:<${parseFloat(stock_range.max)}`);
    }

    // console.log("params", filterParams);
    return filterParams.length > 0 ? filterParams.join(" && ") : "";
  };


  const [removeAllFilter, setRemoveAllFilter] = useState(false);
  const removeFilter = () => {
    // console.log('filter')
    setpageNo(1)
    // dispatch(resetFilters())
    // if (category) {
    //   setFilters((prevFilters) => ({
    //     ...initialValue,
    //     item_group: prevFilters.item_group,
    //     price_range: { min: 0, max: 100000 },
    //     stock_range: { min: 0, max: 100000 },
    //   }));
    // }
    // else if (brand) {
    //   setFilters((prevFilters) => ({
    //     ...initialValue,
    //     brand: prevFilters.brand,
    //     price_range: { min: 0, max: 100000 },
    //     stock_range: { min: 0, max: 100000 },
    //   }));
    // }
    setFilters((prevFilters) => ({
      ...initialValue,
      price_range: { min: 0, max: 100000 },
      stock_range: { min: 0, max: 100000 },
    }));
    setRemoveAllFilter((prev) => !prev);

    // console.log("checkRange",filters)
    // router.replace(`/list?category=`)
  }

  const fetchResults = async (reset = false, initialPageNo, group_change = false) => {
    setError(null);
    // console.log("queryfilter", filters)
    // const perPage = window.innerWidth >= 1400 ? "15" : "12";
    console.log("itemCheck", productFilter.item_group, group_change)
    const addFilterQuery = () => {
      const itemGroupFilter =
        productFilter?.item_group?.length > 0
          ? `item_group:=[${productFilter.item_group.map((item) => `"${item}"`).join(",")}]`
          : "";

      const brandFilter =
        productFilter?.brand?.length > 0
          ? `brand:=[${productFilter.brand.map((item) => `"${item}"`).join(",")}]`
          : "";

          if (itemGroupFilter && brandFilter) {
            return `${itemGroupFilter} && ${brandFilter}`;
          }
        
          if (itemGroupFilter) {
            return itemGroupFilter;
          }
        
          if (brandFilter) {
            return brandFilter;
          }
    }
    const queryParams = new URLSearchParams({
      q: '*',
      query_by: "item_name,item_description,brand",
      page: initialPageNo ? 1 : pageNo,
      per_page: "15",
      // query_by_weights: "1,2,3",
      filter_by: group_change ? addFilterQuery() : buildFilterQuery(),
      // ...buildFilterQuery() && { filter_by: buildFilterQuery() },
      sort_by: filters.sort_by
    });
    if (initialPageNo) {
      setpageNo(1)
      setResults([])
    }
    try {
      setLoading(true);
      // console.log('query', buildFilterQuery);
      // console.log('queParam', filters)
      const data = await typesense_search_items(queryParams);
      if (data.hits.length === 0) {
        if (pageNo > 1) {
          setHasMore(false);
        } else {
          setResults([]);
          setHasMore(false);
        }
      } else {
        setHasMore(true);
        setResults((prevResults) =>
          reset ? data.hits : [...prevResults, ...data.hits]
        );
      }

      setFoundValue(data.found || 0);

    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
      setHasMore(false)
      setFoundValue(0)
      // setResults([])
    } finally {
      setLoading(false);
    }
  };

  const [filterUpdated, setFilterUpdated] = useState(false);

  useEffect(() => {
    if ((productFilter?.item_group?.length > 0)) {
      console.log(productFilter, "productFilter");

      setFilters((prevFilters) => ({
        ...prevFilters,
        item_group: productFilter.item_group,
      }));

      setFilterUpdated(true);
      console.log("productUpdate")

    } if ((productFilter?.brand?.length > 0)) {
      setFilters((prevFilter) => ({
        ...prevFilter,
        brand: productFilter.brand
      }))
      setFilterUpdated(true);
    }
    else {
      fetchResults(false, true)
    }
  }, [productFilter]);

  useEffect(() => {
    if (filterUpdated) {
      fetchResults(true, true, true);
      setFilterUpdated(false);
    }
  }, [filterUpdated])


  // useMemo(() => {
  //   if (productFilter && productFilter.item_group && productFilter.item_group.length > 0) {
  //     console.log(productFilter, "productFilter")
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       item_group: productFilter.item_group,
  //     }));
  //     fetchResults(false, true, true)
  //   }

  // }, [productFilter])


  // useEffect(()=>{
  //   fetchResults()
  // }, [filters])

  // console.log('result', filters)

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  // useEffect(() => {
  //   resetFilters
  // }, [filters]);


  useEffect(() => {
    if (category) {
      setFilters((prevFilters) => ({
        ...initialValue,
        item_group: prevFilters.item_group,
      }));
    }
    if (brand) {
      setFilters((prevFilters) => ({
        ...initialValue,
        brand: prevFilters.brand,
      }));
    }
  }, [router.query])

  const [pageLoad, setPageLoad] = useState(false)

  const lastResultRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setpageNo((prevPage) => prevPage + 1);
          setPageLoad((prev) => !prev);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );


  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }


    fetchResults();

  }, [pageLoad]);


  // useEffect(()=>{
  //   if(filters.item_group.length === 0){
  //     router.push('/')
  //   }
  // },[category, brand])

  const handleFilterClick = () => {
    setResults([]);

    // setpageNo(1)

    fetchResults(true, true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // useEffect(()=>{
  //   setTimeout(()=>{
  //     applyFilter()
  //   }, 500)
  // }, [filters])


  // useEffect(() => {
  //     fetchResults();
  //   }, [filters, priceBetween]);

  // useEffect(() => {
  //   // Create an IntersectionObserver instance
  //   const observer = new IntersectionObserver((entries) => {
  //     // Loop through each entry (in case multiple elements are being observed)
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         // Trigger the event when the footer is visible
  //         console.log('Footer is visible!');
  //         const ele = document.getElementById('filter-sec')
  //         ele.classList.add('!absolute')
  //         // You can trigger any custom function here
  //         // Example: call a function or update state
  //       }else{
  //         const ele = document.getElementById('filter-sec')
  //         ele.classList.remove('!absolute')
  //       }
  //     });
  //   }, {
  //     threshold: 0.1, // This means 10% of the footer must be visible for the event to be triggered
  //   });

  //   // Target the element with id "footer"
  //   const footerElement = document.getElementById('footer');
  //   if (footerElement) {
  //     observer.observe(footerElement); // Start observing the footer
  //   }

  //   // Cleanup observer when the component is unmounted
  //   return () => {
  //     if (footerElement) {
  //       observer.unobserve(footerElement); // Stop observing on unmount
  //     }
  //   };
  // }, []); // Empty dependency array to run this only once on mount


  let sortByOptions = [
    { text: 'Select Sort By', value: '' },
    { text: 'Created Date', value: 'created_date' },
    { text: 'Price low to high', value: 'rate:asc' },
    { text: 'Price high to low', value: 'rate:desc' },
    { text: 'Stock low to high', value: 'stock:asc' },
    { text: 'Stock high to low', value: 'stock:desc' },
    { text: 'Mostly Sold', value: 'sold_last_30_days:desc' },
    { text: 'Least Sold', value: 'sold_last_30_days:asc' },
  ]

  const handleSortBy = (e, type = "") => {
    // console.log('targetvalue', e.target.value)
    let sortByValue = ""
    if (type == "select") {
      sortByValue = e.target.value;
    } else {
      sortByValue = e
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort_by: sortByValue
    }));
    // console.log('sort', filters)
    // setResults([])
    // setpageNo(1)
    // fetchResults()
  }

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      fetchResults(false, true)
    }
  }, [filters.sort_by, filters.hot_product, filters.has_variants, filters.in_stock, filters.show_promotion, filters.custom_in_bundle_item, removeAllFilter])

  console.log('tabView', (tabView && openFilter) || !tabView, openFilter, tabView)
  return (

    <>

      <Head>
        <title>{filterInfo?.meta_info?.meta_title}</title>
        <meta name="description" content={filterInfo?.meta_info?.meta_description} />
        <meta property="og:type" content={'List'} />
        <meta property="og:title" content={filterInfo?.meta_info?.meta_title} />
        <meta key="og_description" property="og:description" content={filterInfo?.meta_info?.meta_description} />
        <meta property="og:image" content={seo_Image(filterInfo?.meta_info?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(filterInfo?.meta_info?.meta_image)}></meta>
      </Head>


      {loadSpinner && <Backdrop />}
      {isOpenCat && <div className='filtersPopup'>
        <Rodal visible={isOpenCat} enterAnimation='slideDown' animation='' onClose={closeModal}>
          <MobileCategoryFilter closeModal={closeModal} />
        </Rodal>
      </div>
      }

      {<MobileHeader titleClick={titleClick} titleDropDown={true} back_btn={true} search={true} theme_settings={theme_settings} />}


      {/* Baner Section */}
      {/* <div className='primary_bg py-[40px] md:py-[15px]'>
        <div className='grid justify-center text-center'>
          <h1 className='text-white text-[30px] md:text-[18px]  font-semibold'>Discover a new device</h1>
          <p className='text-white text-[16px] md:text-[14px]'>Explore a wide range of smartphones, from the iconic iPhones to the latest Android devices. </p>
        </div>
      </div> */}


      <div className='md:hidden tab:hidden main-width pt-3 flex justify-end gap-4'>
        <div onClick={() => { dispatch(setBoxView(productBoxView == 'Grid View' ? 'List View' : 'Grid View')); }} className='h-full flex items-center justify-end gap-[7px] cursor-pointer border border-[1px] border-[#ddd] rounded-[5px] p-[5px_10px]'>
          <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={productBoxView == 'Grid View' ? '/filters/list.svg' : '/filters/grid.svg'}></Image>
          <span className={`text-[14px] font-normal line-clamp-1`}>{productBoxView == 'Grid View' ? 'List' : 'Grid'}</span>
        </div>

        <div className=''>
          {/* <label htmlFor="" className={`${label_classname}`}>Sort by</label> */}
          <select value={filters.sort_by} onChange={(e) => handleSortBy(e, "select")} className={` outline-none border-[1px] p-2 rounded-md border-gray-300`} placeholder="Select options" defaultValue={"Select Options"}>
            {
              sortByOptions.map((item, i) => (
                <option value={item.value}>{item.text}</option>
              ))
            }
          </select>
        </div>
      </div>



      <div class={`md:mb-[60px] lg:flex tab:flex tab:flex-col lg:py-5 lg:gap-[17px] md:gap-[10px] transition-all duration-300 ease-in`}>

        {/* <div className="md:hidden flex-[0_0_calc(20%_-_7px)] mr-[10px] sticky top-[170px] overflow-auto scrollbarHide h-[calc(100vh_-_160px)] bg-[#fff] z-[98]">
          {filtersList && <Filters filtersList={filtersList} ProductFilter={ProductFilter} />}
        </div> */}

        {/* flex-[0_0_calc(20%_-_7px)] */}
        {
          ((tabView && openFilter) || !tabView) && (
            <div id='filter-sec' className={`md:hidden ${(tabView && openFilter) && 'tab:w-[35%] tab:z-0'} border-r border-r-[1px] border-r-[#0000001F] fixed  lg:w-[20%]  transition-all duration-300 ease-in  mr-[10px] lg:top-[124px] tab:top-[186px] overflow-auto scrollbarHide h-[calc(100vh_-_125px)] bg-[#fff] z-[98]`}>
              {<Filters mastersData={mastersData || []} filtersList={filtersList} ProductFilter={ProductFilter} priceBetween={priceBetween} setPriceBetween={setPriceBetween} filters={filters} setFilters={setFilters} fetchResults={handleFilterClick} clearFilter={removeFilter} foundValue={foundValue} />}
            </div>
          )
        }

        <div className="lg:hidden tab:hidden sticky top-[50px] bg-[#f1f5f9] z-[99]">
          {/* {filtersList && <CurrentProductFilter isMobile={true} category_list={filtersList.category_list} />} */}
          {<MobileFilters mastersData={mastersData || []} filtersList={filters} handleSortBy={handleSortBy} filters={filters} setFilters={setFilters} productBoxView={productBoxView} ProductFilter={ProductFilter} fetchResults={handleFilterClick} clearFilter={removeFilter} foundValue={foundValue} />}
        </div>

        <div className='md:hidden tab:block lg:hidden sticky top-[120px] bg-[#f1f5f9] z-[10] w-full'>
          {<TabFilters mastersData={mastersData || []} filtersList={filters} handleSortBy={handleSortBy} setOpenFilter={setOpenFilter} filters={filters} setFilters={setFilters} productBoxView={productBoxView} openFilter={openFilter} />}
        </div>


        {/* <div className="lg:flex-[0_0_calc(80%_-_7px)] md:w-full">
          <>
            {productFilters.selectedAttributes.length != 0 &&
              <div className='md:hidden flex gap-[8px] items-center flex-wrap mb-[10px]'>

                <div onClick={() => { clearFilter('', 'clearAll') }} className={`cursor-pointer flex items-center bg-[#f1f1f157] gap-[8px] border-[1px] border-slate-100 rounded-[20px] p-[5px_15px] w-max`}>
                  <h5 className='text-[13px]'>Clear All</h5>
                  <Image className='h-[12px] w-[12px] object-contain' src={'/cancel.svg'} alt='Close' height={20} width={20} />
                </div>


                {productFilters.selectedAttributes.map((res, i) => {
                  return (
                    <div onClick={() => { productFilters.selectedAttributes.length == 1 ? clearFilter('', 'clearAll') : clearFilter(res, '') }} key={i} className={`cursor-pointer flex items-center bg-[#f1f1f157] gap-[8px] border-[1px] border-slate-100 rounded-[20px] p-[5px_15px] w-max`}>
                      <h5 className='text-[13px]'>{res.option_value}</h5>
                      <Image className=' h-[12px] w-[12px] object-contain' src={'/cancel.svg'} alt='Close' height={20} width={20} />
                    </div>
                  )
                })}

              </div>
            }
            {loader ?
              <Skeleton />
              :
              <>
                {((productList.length != 0 && Array.isArray(productList)) && productBoxView) ? <ProductBox productList={productList} rowCount={'flex-[0_0_calc(33.333%_-_8px)]'} productBoxView={productBoxView} /> :
                  <>{theme_settings && <NoProductFound cssClass={'flex-col lg:h-[calc(100vh_-_265px)] md:h-[calc(100vh_-_200px)]'} api_empty_icon={theme_settings.nofound_img} heading={'No Products Found!'} />}</>
                }
              </>
            }
            <div className='more' ref={cardref}></div>

            {pageLoading &&
              <div id="wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            }

          </>
        </div> */}


        {/* lg:flex-[0_0_calc(80%_-_7px)] */}
        <div className={`${(tabView && openFilter) ? 'tab:ml-[35%] tab:w-[65%] flex-[0_0_auto]' : 'tab:w-full tab:ml-0'} lg:w-[80%] lg:ml-[20%]  md:w-full main-width transition-all duration-300 ease-in`}>
          <>
            {loader ?
              <Skeleton />
              :
              <div className='min-h-screen'>
                {((results.length != 0 && Array.isArray(results))) ? <ProductBox tabView={tabView} productList={results} openFilter={openFilter} rowCount={'lg:flex-[0_0_calc(25%_-_8px)] 2xl:flex-[0_0_calc(20%_-_8px)]'} productBoxView={productBoxView} /> :
                  <>{theme_settings && !loading && <NoProductFound cssClass={'flex-col lg:h-[calc(100vh_-_265px)] md:h-[calc(100vh_-_200px)]'} api_empty_icon={theme_settings.nofound_img} heading={'No Products Found!'} />}</>
                }
              </div>
            }
            {/* <div className='more' ref={cardref}></div> */}
            <div className="" ref={lastResultRef}></div>

            {loading &&
              <div id="wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            }

          </>
        </div>


        {/* <div>
          <Typesense />
        </div> */}

      </div>

      {/* Shop By Brands */}



      {(cartItems && cartItems.length > 0) &&
        <div className='lg:hidden h-[60px] bg-[#fff] flex items-center justify-between fixed w-full bottom-0 z-[9] p-[10px] shadow-[0_0_5px_#ddd]'>
          <div onClick={() => { router.push('/tabs/yourcart') }} className='flex items-center gap-[5px]'>
            <Image className='h-[35px] w-[35px] object-contain' height={60} width={60} alt='logo' src={'/cart.svg'}></Image>
            <h6 className='primary_color text-[14px] font-medium'>{cartItems.length} Items</h6>
          </div>
          <button onClick={() => { router.push('/tabs/yourcart') }} className='primary_btn p-[8px_12px]'>View Cart</button>
        </div>
      }

    </>
    // </ProductList.Provider>
  )

}

const MobileFilters = ({ filtersList, ProductFilter, productBoxView, clearFilter, setFilters, handleSortBy, mastersData, filters, fetchResults, foundValue }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenSort, setIsOpenSort] = useState(false)
  const dispatch = useDispatch();

  function closeModal() {
    setIsOpen(false);
    setIsOpenSort(false);
  }

  return (
    <>
      {isOpen && <div className='filtersPopup'>
        <Rodal visible={isOpen} enterAnimation='slideDown' animation='' onClose={closeModal}>
          <Filters mastersData={mastersData || []} filters={filters} setFilters={setFilters} filtersList={filtersList} ProductFilter={ProductFilter} closeModal={closeModal} clearFilter={clearFilter} fetchResults={fetchResults} foundValue={foundValue} />
        </Rodal>
      </div>
      }

      {isOpenSort && <div className='sortByPopup'>
        <Rodal visible={isOpenSort} enterAnimation='slideDown' animation='' onClose={closeModal}>
          <SortByFilter setFilters={setFilters} handleSortBy={handleSortBy} closeModal={closeModal} />
        </Rodal>
      </div>
      }

      <div className='flex items-center h-[45px] border-b-[1px] border-b-slate-100 bg-[#fff]'>
        <div onClick={() => { dispatch(setBoxView(productBoxView == 'Grid View' ? 'List View' : 'Grid View')); }} className='h-full flex items-center justify-center flex-[0_0_33.333%] gap-[7px]'>
          <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={productBoxView == 'Grid View' ? '/filters/list.svg' : '/filters/grid.svg'}></Image>
          <span className={`text-[14px] font-normal line-clamp-1`}>{productBoxView == 'Grid View' ? 'List' : 'Grid'}</span>
        </div>
        <div onClick={() => { setIsOpenSort(true) }} className='h-full flex items-center justify-center flex-[0_0_33.333%] border-r-[1px] border-r-slate-100  border-l-[1px] border-l-slate-100 gap-[7px]'>
          <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={'/filters/sort-by.svg'}></Image>
          <span className={`text-[14px] font-normal line-clamp-1`}>Sort By</span>
        </div>
        <div onClick={() => { setIsOpen(true) }} className='h-full flex items-center justify-center flex-[0_0_33.333%] gap-[7px]'>
          <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={'/filters/filter.svg'}></Image>
          <span className={`text-[14px] font-normal line-clamp-1`}>Filters</span>
        </div>
      </div>
    </>
  )
}



const TabFilters = ({ filtersList, ProductFilter, productBoxView, clearFilter, setFilters, handleSortBy, mastersData, filters, fetchResults, foundValue, setOpenFilter, openFilter }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenSort, setIsOpenSort] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef(null)
  const dispatch = useDispatch();

  function closeModal() {
    setIsOpen(false);
    setIsOpenSort(false);
  }

  async function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (searchValue && searchValue != '') {
        navigateToSearch('/search/' + searchValue)
      }
    }
  }

  const label_classname = "text-[18px] md:text-[13px] font-semibold"

  return (
    <>
      {isOpenSort && <div className='sortByPopup'>
        <Rodal visible={isOpenSort} enterAnimation='slideDown' animation='' onClose={closeModal}>
          <SortByFilter setFilters={setFilters} handleSortBy={handleSortBy} closeModal={closeModal} />
        </Rodal>
      </div>
      }

      <div className='flex items-center justify-between h-[45px] px-5 border-b-[1px] border-b-slate-100 bg-[#fff]'>

        <div className=''>
          <div className='flex items-center gap-5 justify-between'>
            <h5 className={`${label_classname}`}>Filter</h5>
            <Switch checked={openFilter} onChange={(e) => setOpenFilter(e)} as={Fragment}>
              {({ checked, disabled }) => (
                <button
                  className={clsx(
                    'group inline-flex h-6 w-11 items-center rounded-full',
                    checked ? 'bg-[#000]' : 'bg-gray-200',
                    disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <span className="sr-only"></span>
                  <span
                    className={clsx('size-4 rounded-full bg-white transition', checked ? 'translate-x-6' : 'translate-x-1')}
                  />
                </button>
              )}
            </Switch>
          </div>
        </div>

        <div>
          {/* <div className={`flex-[0_0_calc(45%_-_0px)]`}>
                    <div  className={`'w-full'} relative flex justify-end`}>
                      <div className="p-[5px_10px_5px_20px] h-[35px] flex items-center w-[69.5%]  border_color rounded-[30px]">
                        <input value={searchValue} id='search' spellCheck="false" onKeyDown={handleKeyDown} ref={searchRef} onChange={(eve) => { getSearchTxt(eve) }} onFocus={() => { setActiveSearch(true) }} onBlur={() => { setActiveSearch(true) }} className='w-[95%] text-[14px]' placeholder='Search Products' />
                        <Image onClick={() => { searchValue == '' ? null : navigateToSearch('/search/' + searchValue) }} style={{ objectFit: 'contain' }} className='h-[18px] w-[15px] cursor-pointer' height={25} width={25} alt='vantage' src={'/search.svg'}></Image>
                      </div>
                      {(activeSearch && searchProducts && searchProducts.length > 0) && <div className='w-[69.5%] p-[10px] max-h-[350px] min-h-[150px] overflow-auto scrollbarHide absolute top-[43px] bg-[#fff] z-99 rounded-[8px] shadow-[0_0_5px_#ddd]'>
                        <SearchProduct router={router} loader={loader} all_categories={all_categories} searchValue={searchValue} get_search_products={get_search_products} searchProducts={searchProducts} theme_settings={theme_settings} navigateToSearch={navigateToSearch} /> </div>}
                    </div>
                  </div> */}
        </div>
        <div className='flex items-center'>
          <div onClick={() => { dispatch(setBoxView(productBoxView == 'Grid View' ? 'List View' : 'Grid View')); }} className='h-full flex items-center justify-center gap-[7px] mr-5'>
            <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={productBoxView == 'Grid View' ? '/filters/list.svg' : '/filters/grid.svg'}></Image>
            <span className={`text-[16px] font-normal`}>{productBoxView == 'Grid View' ? 'List' : 'Grid'}</span>
          </div>
          <div onClick={() => { setIsOpenSort(true) }} className='h-full flex items-center justify-center border-r-slate-100  border-l-[1px] border-l-slate-100 gap-[7px]'>
            <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={'/filters/sort-by.svg'}></Image>
            <span className={`text-[14px] font-normal`}>Sort By</span>
          </div>
          {/* <div onClick={() => { setIsOpen(true) }} className='h-full flex items-center justify-center flex-[0_0_33.333%] gap-[7px]'>
            <Image className='h-[20px] object-contain' height={25} width={25} alt='logo' src={'/filters/filter.svg'}></Image>
            <span className={`text-[14px] font-normal line-clamp-1`}>Filters</span>
          </div> */}
        </div>
      </div>
    </>
  )
}

const SortByFilter = ({ ProductFilter, closeModal, setFilters, handleSortBy }) => {

  let sorting = [
    { text: 'Select Sort By', value: '' },
    { text: 'Created Date', value: 'created_date' },
    { text: 'Price low to high', value: 'rate:asc' },
    { text: 'Price high to low', value: 'rate:desc' },
    { text: 'Stock low to high', value: 'stock:asc' },
    { text: 'Stock high to low', value: 'stock:desc' },
    { text: 'Mostly Sold', value: 'sold_last_30_days:desc' },
    { text: 'Least Sold', value: 'sold_last_30_days:asc' },
  ]


  return (
    <>
      <h5 className='text-[15px] font-semibold p-[10px]'>Sort By</h5>

      {sorting.map((res, index) => {
        return (
          <h6 onClick={() => { closeModal(), handleSortBy(res.value, "") }} className='text-[15px] font-medium p-[10px]'>{res.text}</h6>
        )
      })}
    </>
  )
}

const Skeleton = ({ }) => {
  return (
    <>
      <div className={`flex items-center animate-pulse lg:gap-[10px] flex-wrap`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((res, index) => {
          return (
            <div className='flex-[0_0_calc(33.3333%_-_8px)] md:flex-[0_0_calc(50%_-_0px)] h-[358px] border-[1px] border-slate-200 rounded-[5px]'>
              <div className='bg-slate-200 h-[200px] md:h-[140px] mb-[10px] md:m-[10px]'></div>
              <div className='p-[8px]'>
                <div className='bg-slate-200 h-[18px] mb-[5px] w-[80%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] mb-[5px] w-[100%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] mb-[5px] w-[60%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[30px] mb-[5px] w-[75%] rounded-[5px]'></div>
              </div>
              <div className='p-[0_8px_8px_8px] flex items-center justify-between'>
                <div className='bg-slate-200 h-[25px] w-[35%] rounded-[5px]'></div>
                <div className='bg-slate-200 h-[25px] text-end w-[35%] rounded-[5px]'></div>
              </div>
            </div>
          )
        })
        }
      </div>
    </>
  )
}

const Backdrop = () => {
  return (
    <div className='backdrop'>
      <div className="h-[100%] flex flex-col gap-[10px] items-center  justify-center">
        <div class="animate-spin rounded-full h-[40px] w-[40px] border-l-2 border-t-2 border-black"></div>
        <span className='text-[15px]'>Loading...</span>
      </div>
    </div>
  )
}

// export async function getServerSideProps(req) {

//   const { category, brand } = req.query;

//   // let productRoute = ''
//   // let value = params.list

//   // value.map((r, i) => {
//   //   productRoute = productRoute + r + ((value.length != (i + 1)) ? '/' : '')
//   // })

//   // let filterInfo = ''
//   // let currentId = ''

//   // let data = { "route": productRoute }
//   // let res = await get_category_filters(data);
//   // if (res && res.message) {
//   //   filterInfo = res.message
//   //   if (res.message.category_list && res.message.category_list.current_category && res.message.category_list.current_category.category_name) {
//   //     currentId = res.message.category_list.current_category
//   //   }
//   // }

//   // Fetch data from API

//   // const filters = {
//   //   item_group: category ? (Array.isArray(category) ? category : category.split(",")) : [],
//   //   brand: brand ? (Array.isArray(brand) ? brand : brand.split(",")) : [],
//   // };

//   // const buildFilterQuery = () => {
//   //   const filterParams = [];

//   //   if (filters.item_group.length) {
//   //     const values = filters.item_group.map(v => `"${v}"`).join(",");
//   //     filterParams.push(`item_group:=[${values}]`);
//   //   }

//   //   if (filters.brand.length) {
//   //     const values = filters.brand.map(v => `"${v}"`).join(",");
//   //     filterParams.push(`brand:=[${values}]`);
//   //   }

//   //   return filterParams.length > 0 ? filterParams.join(" && ") : "";
//   // };

//   // const queryParams = new URLSearchParams({
//   //   q: '*',
//   //   query_by: "item_name,item_description,brand",
//   //   page: "1",
//   //   per_page: "15",
//   //   query_by_weights: "1,2,3",
//   //   filter_by: buildFilterQuery(),
//   // });

//   // const data = await typesense_search_items(queryParams);
//   // const initialData = data.hits || [];
//   // const found = data.found || 0


//   return {
//     // props: { productRoute, filterInfo, currentId, params, mastersData }
//     // props: { initialData, found }
//   }

// }

// export async function getServerSideProps({ params }) {
//   let productRoute = ''
//   let value = params.list

//   value.map((r, i) => {
//     productRoute = productRoute + r + ((value.length != (i + 1)) ? '/' : '')
//   })

//   let datas = {
//     "route": productRoute,
//     "page_no": 1,
//     "page_size": 12,
//   }

//   let res = await get_category_products(datas);
//   let list = res.message

//   return {
//     props: { productRoute, list }
//   }

// }