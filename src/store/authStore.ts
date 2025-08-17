import { create } from "zustand";

type authStore = {
  modalOpen: boolean;
  toggleModal: () => void;
};

export default create<authStore>((set, get) => ({
  modalOpen: true,
  toggleModal: () => set({ modalOpen: !get().modalOpen }),
}));
