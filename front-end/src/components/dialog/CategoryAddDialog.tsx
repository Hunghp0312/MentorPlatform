import React, { useState } from 'react';
import InputCustom from '../input/InputCustom';
import Button from '../ui/Button';
import { CategoryType } from '../../types/category';

interface CategoryAddDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (category: { name: string; description: string }) => void;
    initialData?: CategoryType;
}

const CategoryAddDialog: React.FC<CategoryAddDialogProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = () => {
        onSubmit({ name, description });
        onClose();
    };
    console.log('CategoryAddDialog', { name, description });

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
    );
};

export default CategoryAddDialog;