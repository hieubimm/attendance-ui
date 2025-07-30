import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceState, CheckinRequest, CheckoutRequest, AttendanceRecord } from '../../types/auth';
import { attendanceAPI } from '../../services/api';

// Async thunks
export const checkin = createAsyncThunk(
  'attendance/checkin',
  async (data: CheckinRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await attendanceAPI.checkin(data);
      // Sau khi checkin thành công, gọi API để lấy thông tin attendance hôm nay
      dispatch(getTodayAttendance());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Checkin thất bại');
    }
  }
);

export const checkout = createAsyncThunk(
  'attendance/checkout',
  async (data: CheckoutRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await attendanceAPI.checkout(data);
      // Sau khi checkout thành công, gọi API để lấy thông tin attendance hôm nay
      dispatch(getTodayAttendance());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Checkout thất bại');
    }
  }
);

export const getTodayAttendance = createAsyncThunk(
  'attendance/getTodayAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getTodayAttendance();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Không thể lấy thông tin attendance hôm nay');
    }
  }
);

// Initial state
const initialState: AttendanceState = {
  currentRecord: null,
  todayRecord: null,
  isLoading: false,
  error: null,
  lastCheckinTime: null,
  lastCheckoutTime: null,
};

// Attendance slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.currentRecord = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Checkin
    builder
      .addCase(checkin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.todayRecord = action.payload;
        state.lastCheckinTime = action.payload?.checkin_time || null;
        state.error = null;
      })
      .addCase(checkin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Checkout
    builder
      .addCase(checkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.todayRecord = action.payload;
        state.lastCheckoutTime = action.payload?.checkout_time || null;
        state.error = null;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get today attendance
    builder
      .addCase(getTodayAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayRecord = action.payload;
        if (action.payload) {
          state.lastCheckinTime = action.payload.checkin_time;
          state.lastCheckoutTime = action.payload.checkout_time || null;
        } else {
          state.lastCheckinTime = null;
          state.lastCheckoutTime = null;
        }
      })
      .addCase(getTodayAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer; 