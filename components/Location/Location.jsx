import React, { useEffect, useState } from 'react'
import { check_Image, stored_locations_info, pincode_availability } from '@/libs/api';
import Image from 'next/image';
import { useDispatch, useSelector, Provider } from 'react-redux'
import { setBusiness } from '@/redux/slice/websiteSettings'

export default function Location({theme_settings, closeModal}) {

  useEffect(()=>{
    if(typeof window !== 'undefined' && (localStorage['zipcode'] && localStorage['zipcode'] != 'undefined')){
        // checkPincode(localStorage['zipcode'])
    }
  },[])

  let locations = [
    {
        "name": "Eranakulam",
        "restaurant_name": "Eranakulam",
        "state": "Kerala",
        "city": "Eranakulam",
        "business": "BS-00001"
    },
    {
        "name": "Bangalore",
        "restaurant_name": "Bangalore",
        "state": "Karnataka",
        "city": "Bangalore",
        "business": "BS-00002"
    }
]

let location_areas = [
    {
        "name": "SH-A-00104",
        "area": "Banaswadi ",
        "zipcode": "560033",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00072",
        "area": "Bangalore",
        "zipcode": "560068",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00081",
        "area": "Bangalore",
        "zipcode": "560005",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00083",
        "area": "Bangalore",
        "zipcode": "560084",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00085",
        "area": "Bangalore",
        "zipcode": "560024",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00086",
        "area": "Bangalore",
        "zipcode": "560064",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00087",
        "area": "Bangalore",
        "zipcode": "560036",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00088",
        "area": "Bangalore",
        "zipcode": "560043",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00099",
        "area": "Bangalore",
        "zipcode": "560076",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00100",
        "area": "Bangalore",
        "zipcode": "560077",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00103",
        "area": "Bangalore",
        "zipcode": "560077",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00107",
        "area": "C V Raman Nagar",
        "zipcode": "560093",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00108",
        "area": "chiter",
        "zipcode": "6820111",
        "city": "Hyderabad"
    },
    {
        "name": "SH-A-00109",
        "area": "Eloor",
        "zipcode": "683501",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00023",
        "area": "Eranakulam",
        "zipcode": "682020",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00024",
        "area": "Eranakulam",
        "zipcode": "682012",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00025",
        "area": "Eranakulam",
        "zipcode": "682018",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00026",
        "area": "Eranakulam",
        "zipcode": "682017",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00027",
        "area": "Eranakulam",
        "zipcode": "682026",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00028",
        "area": "Eranakulam",
        "zipcode": "682011",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00029",
        "area": "Eranakulam",
        "zipcode": "682016",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00030",
        "area": "Eranakulam",
        "zipcode": "682013",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00031",
        "area": "Eranakulam",
        "zipcode": "682030",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00032",
        "area": "Eranakulam",
        "zipcode": "682037",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00033",
        "area": "Eranakulam",
        "zipcode": "682303",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00035",
        "area": "Eranakulam",
        "zipcode": "682028",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00036",
        "area": "Eranakulam",
        "zipcode": "682034",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00037",
        "area": "Eranakulam",
        "zipcode": "682025",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00038",
        "area": "Eranakulam",
        "zipcode": "682506",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00039",
        "area": "Eranakulam",
        "zipcode": "682302",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00040",
        "area": "Eranakulam",
        "zipcode": "682309",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00041",
        "area": "Eranakulam",
        "zipcode": "682305",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00042",
        "area": "Eranakulam",
        "zipcode": "682304",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00043",
        "area": "Eranakulam",
        "zipcode": "682306",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00044",
        "area": "Eranakulam",
        "zipcode": "682307",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00045",
        "area": "Eranakulam",
        "zipcode": "682314",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00047",
        "area": "Eranakulam",
        "zipcode": "682023",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00048",
        "area": "Eranakulam",
        "zipcode": "682026",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00050",
        "area": "Eranakulam",
        "zipcode": "682032",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00051",
        "area": "Eranakulam",
        "zipcode": "682019",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00052",
        "area": "Eranakulam",
        "zipcode": "683105",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00053",
        "area": "Eranakulam",
        "zipcode": "683108",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00054",
        "area": "Eranakulam",
        "zipcode": "683106",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00055",
        "area": "Eranakulam",
        "zipcode": "682004",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00056",
        "area": "Eranakulam",
        "zipcode": "682003",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00057",
        "area": "Eranakulam",
        "zipcode": "682002",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00059",
        "area": "Eranakulam",
        "zipcode": "682022",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00060",
        "area": "Eranakulam",
        "zipcode": "682028",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00061",
        "area": "Eranakulam",
        "zipcode": "683104",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00062",
        "area": "Eranakulam",
        "zipcode": "682565",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00063",
        "area": "Eranakulam",
        "zipcode": "682041",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00064",
        "area": "Eranakulam",
        "zipcode": "682039",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00065",
        "area": "Eranakulam",
        "zipcode": "682036",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00066",
        "area": "Eranakulam",
        "zipcode": "682035",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00067",
        "area": "Eranakulam",
        "zipcode": "682034",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00068",
        "area": "Eranakulam",
        "zipcode": "682033",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00069",
        "area": "Eranakulam",
        "zipcode": "682027",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00070",
        "area": "Eranakulam",
        "zipcode": "682023",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00071",
        "area": "Eranakulam",
        "zipcode": "682015",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00090",
        "area": "Eranakulam",
        "zipcode": "682028",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00091",
        "area": "Eranakulam",
        "zipcode": "682030",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00092",
        "area": "Eranakulam",
        "zipcode": "682037",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00093",
        "area": "Eranakulam",
        "zipcode": "682303",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00094",
        "area": "Eranakulam",
        "zipcode": "682306",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00095",
        "area": "Eranakulam",
        "zipcode": "685237",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00101",
        "area": "Eranakulam",
        "zipcode": "683503",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00102",
        "area": "Eranakulam",
        "zipcode": "683501",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00019",
        "area": "Hyderabad",
        "zipcode": "500001",
        "city": "Telangana"
    },
    {
        "name": "SH-A-00096",
        "area": "Kalamassery ",
        "zipcode": "682021",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00097",
        "area": "Kalamassery ",
        "zipcode": "683022",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00098",
        "area": "Kalamassery ",
        "zipcode": "683563",
        "city": "Eranakulam"
    },
    {
        "name": "SH-A-00018",
        "area": "Lodi Road",
        "zipcode": "110003",
        "city": "Delhi"
    },
    {
        "name": "SH-A-00105",
        "area": "Nagavara ",
        "zipcode": "560045",
        "city": "Bangalore"
    },
    {
        "name": "SH-A-00106",
        "area": "Ramamurthy Nagar",
        "zipcode": "560016",
        "city": "Bangalore"
    }
]

useEffect(() => {
    // Implement logic to use Google Places Autocomplete API

    const input = document.getElementById('autocomplete');
    const options = {
      types: ['establishment'],  // 'establishment' / 'address' / 'geocode'
      componentRestrictions: { country: 'in' } // Restrict results to India
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      getLocationDetails(place)
    //   console.log('Selected place:', place);
  
    });

}, []);

function getLocationDetails(place){
    const { address_components } = place;
    let addressInfo = {}
    addressInfo.address = place.formatted_address;

    for (let i = 0; i < address_components.length; i++) {
      const component = address_components[i];
      const componentType = component.types[0];
      switch (componentType) {
  
        case 'locality':
          addressInfo.city = component.long_name;
          break;
        case 'administrative_area_level_1':
          addressInfo.state = component.long_name;
          break;
        case 'country':
          addressInfo.county = component.long_name;
          break; 
        case 'administrative_area_level_2':
          addressInfo.county = component.long_name;
          break; 
        case 'postal_code':
          addressInfo.zipcode = component.long_name;
          break;
        default:
          break;
      }
    }

    
    // console.log('Address:', addressInfo);
    checkPincode(addressInfo.zipcode)
    stored_locations_info(addressInfo);
    dispatch(setBusiness(addressInfo));
}

function getCurrentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
  
            const geocoder = new window.google.maps.Geocoder();
            const latlng = new window.google.maps.LatLng(latitude, longitude);
  
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                getLocationDetails(results[0])
                const address = results[0].formatted_address;
                // console.log('Address:', address);
                // Additional logic or components based on address
              } else {
                console.error('Geocode failed:', status);
              }
            });
          },
          (error) => {
            console.error('Error getting location:', error.message);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
}



const [selectedAreaList,setSelectedAreaList] = useState([])
let [selectLocation, setLocation] = useState(-1)
let [errorMsg, setErrorMsg] = useState()
let [showShake, setShake] = useState(false)

const dispatch = useDispatch()

async function checkPincode(zipcode) {
  let res = await pincode_availability(zipcode);
  if(res && res.message && res.message.is_available == 1){
    setErrorMsg()
    closeModal()
  }else{
    setErrorMsg('Shipping is not available to your location! ' + localStorage['address'] )
    setShake(true)
    setTimeout(()=>{
      setShake(false)
    },1500)
  }
}

const getAreasList = (obj) =>{
    if(selectedAreaList.length != 0){
        const div = document.getElementById('myDiv');
        div.scrollTop = 0;
    }
    let array = location_areas.filter(res=>{ return res.city == obj.city})
    setSelectedAreaList(array)
    stored_locations_info(obj)
    dispatch(setBusiness(obj.business));
}

const getList = (obj) =>{
    obj.address = obj.area + ',' + obj.city + ' - ' + obj.zipcode
    stored_locations_info(obj)
    dispatch(setBusiness(obj.business));
    checkPincode(obj.zipcode)
}

  return (
    <div className='p-[10px] flex flex-col h-full w-full'>
      <h5 className='text-[15px] font-semibold'>Choose Your Location</h5>

      <div className='h-full overflow-auto scrollbarHide'>
        <div className='flex items-center gap-[5px] py-[10px] border-b-[1px] border-b-slate-100'>
        <div className="p-[5px_10px] h-[45px] flex items-center w-full border_color rounded-[5px]">
            <input id="autocomplete" className='w-[95%] text-[14px]' placeholder='Search your location'/>
            {theme_settings.header_search_icon && <Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px] cursor-pointer' height={25}  width={25} alt='vantage' src={check_Image(theme_settings.header_search_icon)}></Image>}
        </div>
        <div onClick={()=>{getCurrentLocation()}} className='flex items-center justify-center h-[45px] w-[45px] rounded-[5px] bg-[#f5f5f5] cursor-pointer'><Image style={{ objectFit: 'contain' }} className='h-[18px] w-[15px]' height={25}  width={25} alt='vantage' src={'/locate.svg'}></Image></div>
        </div>

        {errorMsg && <p className={`${showShake ? 'shakeCss' :''} text-[12px] text-red-600 bg-red-200 rounded-[5px] p-[8px]`}>{errorMsg}</p>}

        <h5 className='text-[15px] font-semibold py-[10px]'>Available Locations</h5>

        <div className='flex items-center flex-wrap gap-[8px]'>
        {locations.map((res,index)=>{
            return(
            <label onClick={()=>{setLocation(index),getAreasList(res)}} className={`${selectLocation == index ? 'primary_bg text-[#fff]' :  'border-[1px] border-slate-200'} w-max p-[5px_10px] rounded-[20px] text-[13px] cursor-pointer`}>{res.restaurant_name}</label>
            ) 
        })}
        </div>

        {(selectedAreaList && selectedAreaList.length != 0) &&
        <ul id='myDiv' className='fixed top-[210px] w-[210px] max-h-[220px] overflow-auto customScrollBar bg-[#fff] mt-[15px] shadow-[0_0_5px_#ddd] rounded-[5px]'>
        {selectedAreaList.map((res,index)=>{
            return(
            <li onClick={()=>{getList(res)}} className='p-[5px_10px] tex-[13px] border-b-[1px] border-b-slate-100 last:border-b-[0] hoverLocationArea cursor-pointer'>{res.area} - {res.zipcode}</li>
            ) 
        })}
        </ul>
        }

      </div>

    </div>
  )


}
