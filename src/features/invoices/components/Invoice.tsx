import { BiX } from 'react-icons/bi';
import Button from '../../../components/UI/Button/Button';
import { useAppDispatch } from '../../../hooks/hooks';
import { clearPreviewUrl } from '../slices/invoicesSlice';
import { Modal } from '../../../components/UI/Modal/Modal';

interface InvoiceProps {
  previewUrl: string;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const Invoice: React.FC<InvoiceProps> = ({ previewUrl, isOpen, closeModal, error }) => {
  const dispatch = useAppDispatch();
  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className='max-w-full'>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-5/6 p-2 relative">
            <Button
              className="absolute top-2 right-2"
              onClick={() => dispatch(clearPreviewUrl())}
              size="icon"
              variant="icon"
              startIcon={<BiX />}
            ></Button>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}

            <iframe
              src={previewUrl}
              className="w-full h-full border"
              title="Vista previa Factura"
            ></iframe>
          </div>
        </div>
      </Modal>
    </>
  );
};
