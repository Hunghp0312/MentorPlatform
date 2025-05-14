import React, { useState } from 'react';
import InputCustom from '../input/InputCustom';
import Button from '../ui/Button';
import { CategoryType } from '../../types/category';

interface CategoryAddDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (category: { name: string; description: string }) => void;
    initialData?: CategoryType;


const CategoryAddDialog: React.FC<CategoryAddDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const handleSubmit = () => {
    onSubmit({ name, description });
    onClose();
  };
  console.log("CategoryAddDialog", { name, description });

  if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl mb-4 text-white font-semibold">
                    {initialData ? 'Edit Category' : 'Add Category'}
                </h2>
                <form onSubmit={(e => e.preventDefault())}>
                    <div className="mb-4">
                        <InputCustom
                            label='Name'
                            name='name'
                            value={name}
                            type='text'
                            onChange={(e) => setName(e.target.value)}
                            isRequired={true}
                        />
                    </div>
                    <div className="mb-4">
                        <InputCustom
                            label='Description'
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            type="textarea"
                            isRequired={false}

                        />
                    </div>
                </form>
                <div className="px-6 py-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <Button variant='primary' size='md' onClick={handleSubmit} >
                        {initialData ? 'Update' : 'Add'}
                    </Button>
                </div>
            </div>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {initialData ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryAddDialog;
