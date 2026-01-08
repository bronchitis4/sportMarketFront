import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Для використання fetch (як ви просили)
// import axios from 'axios'; // Не використовуємо

// =========================================================
// 1. АСИНХРОННИЙ THUNK: Завантаження категорій (залишається без змін)
// =========================================================
export const fetchCategories = createAsyncThunk(
  'filters/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sportmarketback.onrender.com/categories/');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData); 
      }
      
      return response.json(); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =========================================================
// 2. АСИНХРОННИЙ THUNK: Завантаження брендів з бази
// =========================================================
export const fetchBrands = createAsyncThunk(
  'filters/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sportmarketback.onrender.com/brands/');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData); 
      }
      
      return response.json(); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  activeFilters: {
    category_ids: [], 
    brand_ids: [],
    isOnSale: false,
    priceMin: 0,
    priceMax: 100000,
  },
  availableFilters: {
    categories: [], 
    brands: [],
  },
  status: 'idle', 
  error: null,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // 💡 ЗМІНЕНО: Редюсер тепер перемикає ID в масиві (логіка схожа на toggleBrandFilter)
    setCategoryFilter: (state, action) => {
      const categoryId = action.payload;
      const index = state.activeFilters.category_ids.indexOf(categoryId);

      if (index > -1) {
        // ID знайдено: видаляємо його (скидаємо фільтр)
        state.activeFilters.category_ids.splice(index, 1);
      } else {
        // ID не знайдено: додаємо його (активуємо фільтр)
        state.activeFilters.category_ids.push(categoryId);
      }
    },
    
    // Новий редюсер: встановити категорію та очистити всі інші
    setCategoryFilterExclusive: (state, action) => {
      const categoryId = action.payload;
      const index = state.activeFilters.category_ids.indexOf(categoryId);

      if (index > -1) {
        // Якщо вже активна — видаляємо
        state.activeFilters.category_ids.splice(index, 1);
      } else {
        // Якщо не активна — очищуємо все й додаємо тільки цю
        state.activeFilters.category_ids = [categoryId];
      }
    },
    
    toggleBrandFilter: (state, action) => {
      const brandId = action.payload;
      const index = state.activeFilters.brand_ids.indexOf(brandId);

      if (index > -1) {
        state.activeFilters.brand_ids.splice(index, 1);
      } else {
        state.activeFilters.brand_ids.push(brandId);
      }
    },
    
    // 💡 ЗМІНЕНО: Скидаємо category_ids до порожнього масиву
    resetAllFilters: (state) => {
      state.activeFilters.category_ids = []; 
      state.activeFilters.brand_ids = [];
      state.activeFilters.isOnSale = false;
      state.activeFilters.priceMin = 0;
      state.activeFilters.priceMax = 100000;
    },
    
    toggleOnSaleFilter: (state) => {
      state.activeFilters.isOnSale = !state.activeFilters.isOnSale;
    },
    
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.activeFilters.priceMin = min;
      state.activeFilters.priceMax = max;
    },
    
    setAvailableBrands: (state, action) => {
      state.availableFilters.brands = action.payload;
    }
  },
  
  // =========================================================
  // 2. EXTRA REDUCERS: Обробка результатів Thunk
  // =========================================================
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableFilters.categories = action.payload; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("Помилка завантаження категорій:", action.payload);
      })
      .addCase(fetchBrands.pending, (state) => {
        // Не змінюємо основний status, щоб не блокувати категорії
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.availableFilters.brands = action.payload; 
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        console.error("Помилка завантаження брендів:", action.payload);
      });
  },
});

export const { setCategoryFilter, setCategoryFilterExclusive, toggleBrandFilter, resetAllFilters, toggleOnSaleFilter, setPriceRange, setAvailableBrands } = filterSlice.actions;

export default filterSlice.reducer;