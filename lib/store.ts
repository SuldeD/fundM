import { create } from "zustand";

type Store = {
  email: string;
  lastName: string;
  firstName: string;
  register: string;
  phone: string;
  firstStep: boolean;
  secondStep: boolean;
  thirdStep: boolean;
  finishStep: boolean;
  tmp_user_id: string;
  pin_code: string;
  password: string;
  setAddValues: ({
    email,
    lastName,
    firstName,
    register,
    firstStep,
    secondStep,
  }: {
    email: string;
    lastName: string;
    firstName: string;
    register: string;
    firstStep: boolean;
    secondStep: boolean;
  }) => void;
  setSecondValues: ({
    phone,
    tmp_user_id,
  }: {
    phone: string;
    tmp_user_id: string;
  }) => void;
  setAddFirstStep: (value: boolean) => void;
  setAddSecondStep: (value: boolean) => void;
  setAddThirdStep: (value: boolean) => void;
  setAddPinCode: (value: string) => void;
  setAddPassword: (value: string) => void;
  setAddFinishStep: (value: boolean) => void;
  setFinishValues: () => void;
};

export const useRegisterStore = create<Store>()((set) => ({
  email: "",
  lastName: "",
  firstName: "",
  register: "",
  phone: "",
  firstStep: true,
  secondStep: false,
  thirdStep: false,
  finishStep: false,
  tmp_user_id: "",
  pin_code: "",
  password: "",
  setAddValues: ({
    email,
    lastName,
    firstName,
    register,
    firstStep,
    secondStep,
  }: {
    email: string;
    lastName: string;
    firstName: string;
    register: string;
    firstStep: boolean;
    secondStep: boolean;
  }) => set({ email, lastName, firstName, register, firstStep, secondStep }),
  setSecondValues: ({
    phone,
    tmp_user_id,
  }: {
    phone: string;
    tmp_user_id: string;
  }) => set({ phone, tmp_user_id }),
  setAddFirstStep: (value: boolean) => set({ firstStep: value }),
  setAddSecondStep: (value: boolean) => set({ secondStep: value }),
  setAddThirdStep: (value: boolean) => set({ thirdStep: value }),
  setAddFinishStep: (value: boolean) => set({ finishStep: value }),
  setAddPinCode: (value: string) => set({ pin_code: value }),
  setAddPassword: (value: string) => set({ password: value }),

  setFinishValues: () =>
    set({
      email: "",
      lastName: "",
      firstName: "",
      register: "",
      phone: "",
      firstStep: true,
      secondStep: false,
      thirdStep: false,
      finishStep: false,
      tmp_user_id: "",
      pin_code: "",
      password: "",
    }),
}));
