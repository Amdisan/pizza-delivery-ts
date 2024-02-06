import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition(): Promise<
  GeolocationPosition | GeolocationPositionError
> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    try {
      // 1) We get the user's geolocation position
      const positionObj = await getPosition();

      if (positionObj instanceof GeolocationPosition) {
        const position = {
          latitude: positionObj.coords.latitude,
          longitude: positionObj.coords.longitude,
        };

        // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
        const addressObj = await getAddress(position);
        const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

        // 3) Then we return an object with the data that we are interested in
        //payload of the fulfilled state
        return { position, address };
      } else {
        throw positionObj;
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        console.error(error);
      } else {
        console.error('Unknown Error while getting geolocation');
      }
    }
  },
);

type UserPosition = {
  latitude: number;
  longitude: number;
};

type UserState = {
  username: string;
  status: 'loading' | 'idle' | 'error';
  position: Partial<UserPosition>;
  address: string;
  error: string;
};

const initialState: UserState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action: PayloadAction<UserState['username']>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        if (action.payload?.position) {
          state.position = action.payload.position;
          state.address = action.payload.address;
          state.status = 'idle';
        }
      })
      .addCase(fetchAddress.rejected, (state, _) => {
        state.status = 'error';
        state.error = 'Problem with getting address. Please, fill this field.';
      }),
});

//action creators
export const { updateName } = userSlice.actions;

export default userSlice.reducer;
