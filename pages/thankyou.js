import dynamic from 'next/dynamic';
const RootLayout = dynamic(() => import('@/layouts/RootLayout'))
const OrderDetail = dynamic(() => import('@/components/Profile/OrderDetail'))
const MobileHeader = dynamic(() => import('@/components/Headers/mobileHeader/MobileHeader'))

// import RootLayout from '@/layouts/RootLayout'
// import OrderDetail from '@/components/Profile/OrderDetail';
// import MobileHeader from '@/components/Headers/mobileHeader/MobileHeader'

export default function thankyou({ order_id }) {
   return (
      <>
         <RootLayout>
            <MobileHeader navigateLink={'/'} back_btn={true} title={'Thankyou'} empty_div={true} />
            <div className='main-width lg:shadow-[0_0_5px_#f1f1f1] lg:p-[10px] lg:m-[20px_auto] rounded-[5px]'>
               {order_id && <OrderDetail loadPage={true} thankyou={true} order_id={order_id} />}
            </div>
         </RootLayout>

      </>
   )
}

export async function getServerSideProps({ query }) {
   let order_id = query.order_id
   return {
      props: { order_id }
   }
}