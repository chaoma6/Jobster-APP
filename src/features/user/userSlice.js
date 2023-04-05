import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from '../../utils/localstorage';

const initialState = {
	isLoading: false,
	user: getUserFromLocalStorage(),
};

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async (user, thunkAPI) => {
		try {
			const resp = await customFetch.post('/auth/register', user);
			return resp.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.msg);
		}
	}
);

export const LoginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
	try {
		const resp = await customFetch.post('/auth/login', user);
		return resp.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response.data.msg);
	}
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state, { payload }) => {
				const { user } = payload;
				state.isLoading = false;
				state.user = user;
				addUserToLocalStorage(user);
				toast.success(`Hello there ${user.name}`);
			})
			.addCase(registerUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			})
			.addCase(LoginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(LoginUser.fulfilled, (state, { payload }) => {
				const { user } = payload;
				state.isLoading = false;
				state.user = user;
				addUserToLocalStorage(user);
				toast.success(`Welcome Back ${user.name}`);
			})
			.addCase(LoginUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			});
	},
});

export default userSlice.reducer;
