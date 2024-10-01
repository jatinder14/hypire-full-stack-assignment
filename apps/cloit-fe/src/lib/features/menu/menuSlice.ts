// import { axiosAuth } from "src/services/axios";
import { axiosV1ApiClient } from "@/lib/axios";
import { ICreateMenuItemPayload, IMenuItem } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isLoading: boolean;
  isError: boolean;
  data: IMenuItem[];
}

interface IUpdateItemPayload {
  menuId: string;
  payloadData: {
    name: string;
  };
}

const initialData = (type: string) =>
  createAsyncThunk(type, async () => {
    const { data } = await axiosV1ApiClient.get("/api/menus");
    return data;
  });

export const fetchMenus = initialData("fetchMenus");

export const revalidateMenuItems = initialData("revalidateMenuItems");

export const createMenuItem = createAsyncThunk(
  "createMenuItem",
  async (payload: ICreateMenuItemPayload, { rejectWithValue }) => {
    try {
      const { data } = await axiosV1ApiClient.post("/api/menus", payload);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to create menu item");
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  "deleteMenuItem",
  async (menuId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosV1ApiClient.delete(`/api/menus/${menuId}`);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to delete menu item");
    }
  }
);
export const updateMenuItem = createAsyncThunk(
  "updateMenuItem",
  async (payload: IUpdateItemPayload, { rejectWithValue }) => {
    const { menuId, payloadData } = payload;
    try {
      const { data } = await axiosV1ApiClient.put(
        `/api/menus/${menuId}`,
        payloadData
      );
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to delete menu item");
    }
  }
);

const initialState: InitialState = {
  data: [],
  isError: false,
  isLoading: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchMenus.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(createMenuItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteMenuItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateMenuItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(revalidateMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      });
  },
});

// export const { resetState } = menuSlice.actions;

export default menuSlice.reducer;
