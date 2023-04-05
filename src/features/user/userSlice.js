import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { registerUserThunk, loginUserThunk, updateUserThunk } from '../user/userThunk';
import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from '../../utils/localstorage';

const initialState = {
	isLoading: false,
	isSidebarOpen: false,
	user: getUserFromLocalStorage(),
};

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async (user, thunkAPI) => {
		return registerUserThunk('/auth/register', user, thunkAPI);
	}
);

export const LoginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
	return loginUserThunk('/auth/login', user, thunkAPI);
});

export const updateUser = createAsyncThunk('user/updateUser', async (user, thunkAPI) => {
	return updateUserThunk('/auth/updateUser', user, thunkAPI);
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		toggleSidebar: (state) => {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		logoutUser: (state, { payload }) => {
			state.user = null;
			state.isSidebarOpen = false;
			removeUserFromLocalStorage();
			if (payload) {
				toast.success(payload);
			}
		},
	},
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
			})
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateUser.fulfilled, (state, { payload }) => {
				const { user } = payload;
				state.isLoading = false;
				state.user = user;
				addUserToLocalStorage(user);
				toast.success('User Updated');
			})
			.addCase(updateUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
				console.log(payload);
			});
	},
});

export default userSlice.reducer;
export const { toggleSidebar, logoutUser } = userSlice.actions;
