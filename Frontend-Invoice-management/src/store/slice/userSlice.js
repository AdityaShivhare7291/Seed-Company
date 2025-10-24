import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'userDetails',
    initialState: {
        userDetails: null
    },
    reducers: {
        addUserDetails: (state, action) => {
            state.userDetails = action.payload
            console.log({ ans: state.userDetails })
        }
    },
});

export const { addUserDetails } = userSlice.actions;
export default userSlice.reducer;
