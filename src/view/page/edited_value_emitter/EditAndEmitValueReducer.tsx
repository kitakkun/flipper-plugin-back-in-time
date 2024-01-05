import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface EditAndEmitValueState {
  initialValue: any;
  editingValue: any;
  open: boolean;
  instanceUUID: string;
  propertyName: string;
  valueType: string;
}

const initialState: EditAndEmitValueState = {
  initialValue: undefined,
  editingValue: undefined,
  open: false,
  instanceUUID: "",
  propertyName: "",
  valueType: "",
};

interface EditAndEmitValueParams {
  initialValue: any;
  instanceUUID: string;
  propertyName: string;
  valueType: string;
}

const editAndEmitValueSlice = createSlice({
  name: "editAndEmitValue",
  initialState: initialState,
  reducers: {
    open: (state, action: PayloadAction<EditAndEmitValueParams>) => {
      state.initialValue = action.payload.initialValue;
      state.editingValue = action.payload.initialValue;
      state.instanceUUID = action.payload.instanceUUID;
      state.propertyName = action.payload.propertyName;
      state.valueType = action.payload.valueType;
      state.open = true;
    },
    confirmValueEdit: (state) => {
      state.open = false;
    },
    close: (state) => {
      state.open = false;
    },
    updateEditingValue: (state, action: PayloadAction<object>) => {
      state.editingValue = action.payload;
    },
  },
});

export const editAndEmitValueActions = editAndEmitValueSlice.actions;
export const editAndEmitValueReducer = editAndEmitValueSlice.reducer;

export const editAndEmitValueStateSelector = (state: any) => state.editAndEmitValue as EditAndEmitValueState;