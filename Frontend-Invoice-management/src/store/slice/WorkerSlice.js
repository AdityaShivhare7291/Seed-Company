import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    workers: [],
    loading: false,
    error: null,
};

const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        fetchWorkersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchWorkersSuccess: (state, action) => {
            state.workers = action.payload;
            state.loading = false;
        },
        fetchWorkersFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addWorker: (state, action) => {
            state.workers.push(action.payload);
        },
    },
});

export const {
    fetchWorkersStart,
    fetchWorkersSuccess,
    fetchWorkersFailure,
    addWorker,
} = workerSlice.actions;

export default workerSlice.reducer;
