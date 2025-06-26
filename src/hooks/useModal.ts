import { useState, useCallback } from 'react';

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev: any) => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal };
};
