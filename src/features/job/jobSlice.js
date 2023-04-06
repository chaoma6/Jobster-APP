import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localstorage';
import { createJobThunk, deleteJobThunk, editJobThunk } from './jobThunk';

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

export const createJob = createAsyncThunk('job/createJob', createJobThunk);

export const deleJob = createAsyncThunk('job/deleteJob', deleteJobThunk);

export const editJob = createAsyncThunk('job/editJob', editJobThunk);

const jobSlice = createSlice({
	name: 'job',
	initialState,
	reducers: {
		handleChange: (state, action) => {
			const { name, value } = action.payload;
			state[name] = value;
		},
		clearValues: () => {
			return {
				...initialState,
				jobLocation: getUserFromLocalStorage()?.location || '',
			};
		},
		setEditJob: (state, { payload }) => {
			return { ...state, isEditing: true, ...payload };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createJob.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createJob.fulfilled, (state, action) => {
				state.isLoading = false;
				toast.success('Job Created');
			})
			.addCase(createJob.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			})
			.addCase(deleJob.fulfilled, (state, { payload }) => {
				toast.success(payload);
			})
			.addCase(deleJob.rejected, (state, { payload }) => {
				toast.error(payload);
			})
			.addCase(editJob.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editJob.fulfilled, (state) => {
				state.isLoading = false;
				toast.success('Job Modified...');
			})
			.addCase(editJob.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			});
	},
});

export default jobSlice.reducer;
export const { handleChange, clearValues, setEditJob } = jobSlice.actions;
