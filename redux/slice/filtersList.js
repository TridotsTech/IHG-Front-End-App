// import { createSlice } from '@reduxjs/toolkit'

// export const FiltersList = createSlice({
//   name: 'FiltersList',
//   initialState: {
//     filtersValue: {
//       item_code: "",
//       item_description: "",
//       item_name: "",
//       item_group: "",
//       upcoming_products: false,
//       show_promotion: false,
//       in_stock: false,
//       brands: '',
//       price_range: { min: 0.0, max: 100 }
//     },
//     clearAttributeFilters: {}
//   },

//   reducers: {

//     setFilters: (state, action) => {
//       let value = action.payload
//       if (value) {
//         let key = Object.keys(value);
//         state.filtersValue.loadData = state.filtersValue.loadData ? false : true
//         if (key.length != 0) {
//           state.filtersValue.scrollProduct = true,
//             key.map(res => {
//               if (res == 'page_no') {
//                 state.filtersValue.page_no = value[res];
//               } else if (res == 'item_code') {
//                 state.filtersValue.item_code = value[res];
//               } else if (res == 'item_description') {
//                 state.filtersValue.item_description = value[res];
//               } else if (res == 'item_group') {
//                 state.filtersValue.item_group = value[res];
//               } else if (res == 'upcoming_products') {
//                 state.filtersValue.upcoming_products = value[res];
//               } else if (res == 'show_promotion') {
//                 state.filtersValue.show_promotion = value[res];
//               } else if (res == 'in_stock') {
//                 state.filtersValue.in_stock = value[res];
//               } else if (res == 'brands') {
//                 state.filtersValue.brands = value[res];
//               } else if (res == 'price_range') {
//                 state.filtersValue.price_range = value[res];
//               }
//             })
//         }
//       }
//     },



//     setLoad: (state, action) => {
//       state.filtersValue.loadData = action.payload
//     },

//     clearFilters: (state, action) => {
//       state.clearAttributeFilters = action.payload
//     },

//     resetSetFilters: (state, action) => {
//       state.filtersValue.page_no = 1
//       state.filtersValue.sort = ''
//       state.filtersValue.min_price = undefined
//       state.filtersValue.max_price = undefined
//       state.filtersValue.brands = undefined
//       state.filtersValue.attributes = undefined
//       state.filtersValue.rating = undefined
//       state.filtersValue.no_product = true
//       state.filtersValue.scrollProduct = false
//       state.filtersValue.selectedAttributes = []
//       state.filtersValue.loadData = false;
//       state.filtersValue.code = ''
//       state.filtersValue.description = ''
//     }

//   },
// })

// // Action creators are generated for each case reducer function
// export const { setFilters, resetSetFilters, clearFilters, setLoad } = FiltersList.actions

// export default FiltersList.reducer




import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filtersValue: {
        item_group: [],
        brand : []
    }
};

const FiltersList = createSlice({
    name: "FiltersList",
    initialState,
    reducers: {
        setFilter(state, action) {
            const payload = action.payload;
            state.filtersValue.item_group = payload
        },

        setBrand(state, action) {
           const payload = action.payload;
           state.filtersValue.brand = payload
        },
        resetFilters(state) {
            state.filtersValue.item_group = [];
        },
    },
});

export const { setFilter, resetFilters, setBrand } = FiltersList.actions;
export default FiltersList.reducer;
