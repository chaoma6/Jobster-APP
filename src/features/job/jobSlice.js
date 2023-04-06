import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserFromLocalStorage } from '../../utils/localstorage';
import { logoutUser } from '../user/userSlice';
import { getAllJobs, hideLoading, showLoading } from '../allJobs/allJobsSlice';

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

export const createJob = createAsyncThunk('job/createJob', async (job, thunkAPI) => {
	try {
		const response = await customFetch.post('/jobs', job, {
			headers: {
				authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
			},
		});
		thunkAPI.dispatch(clearValues());
		return response.data;
	} catch (error) {
		if (error.response.status === 401) {
			thunkAPI.dispatch(logoutUser());
			return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
		}
		return thunkAPI.rejectWithValue(error.response.data.msg);
	}
});

export const deleJob = createAsyncThunk('job/deleteJob', async (jobId, thunkAPI) => {
	thunkAPI.dispatch(showLoading());
	try {
		const resp = await customFetch.delete(`/jobs/${jobId}`, {
			headers: {
				authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
			},
		});
		thunkAPI.dispatch(getAllJobs());
		return resp.data;
	} catch (error) {
		thunkAPI.dispatch(hideLoading());
		thunkAPI.rejectWithValue(error.response.data.msg);
	}
});

export const editJob = createAsyncThunk(
	'job/editJob',
	async ({ jobId, job }, thunkAPI) => {
		try {
			const resp = await customFetch.patch(`/jobs/${jobId}`, job, {
				headers: {
					authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
				},
			});
			thunkAPI.dispatch(clearValues());
			return resp.data;
		} catch (error) {
			thunkAPI.rejectWithValue(error.response.data.msg);
		}
	}
);

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
