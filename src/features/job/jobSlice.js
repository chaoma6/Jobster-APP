import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserFromLocalStorage } from '../../utils/localstorage';

const initialState = {
	isLoading: false,
	position: '',
	company: '',
	jobLocation: '',
	jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
	jobType: 'full-time',
	statusOptions: ['interview', 'declined', 'pending'],
	status: 'pending',
	isEditing: false,
	editJobId: '',
};

const jobSlice = createSlice({
	name: 'job',
	initialState,
	reducers: {
		handleChange: (state, action) => {
			const { name, value } = action.payload;
			state[name] = value;
		},
		clearValues: () => {
			return initialState;
		},
	},
});

export default jobSlice.reducer;
export const { handleChange, clearValues } = jobSlice.actions;
