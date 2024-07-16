'use client'

import React, { useState } from 'react';
import Select from 'react-select';
import { perfil } from '@/helpers/data';  // Adjust the import path as needed

const Perfil: React.FC = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);
    
    const emailProfiles = perfil.map(item => ({
        value: item.id,
        label: item.titulo,
        conteudo: item.conteudo,
    }));

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
    };

    const handleProfileChange = (selectedOption: any) => {
        setSelectedProfile(selectedOption);
        if (selectedOption) {
            setBody(selectedOption.conteudo);
            setTitle(selectedOption.label);
        } else {
            setBody('');
            setTitle('');
        }
    };

    const handleSaveClick = () => {
        // Implement your save logic here
    };

    const handleEditClick = () => {
        // Implement your edit logic here
    };

    const handleCancelClick = () => {
        setTitle('');
        setBody('');
        setSelectedProfile(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Email Composição</h1>
            
            <label className="block mb-2">Perfis:</label>
            <Select
                value={selectedProfile}
                options={emailProfiles}
                onChange={handleProfileChange}
                isClearable
            />
            
            <label className="block mt-4 mb-2">Título:</label>
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-2 border rounded"
            />

            <label className="block mt-4 mb-2">Corpo do Email:</label>
            <textarea
                value={body}
                onChange={handleBodyChange}
                rows={6}
                className="w-full p-2 border rounded"
                placeholder="Use macros: @nome@, @cnpj@, @email@, @cadastro@, @tel1@, @tel2@"
            />

            <div className="mt-4 flex space-x-2">
                {selectedProfile ? (
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={handleSaveClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save
                    </button>
                )}
                <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Perfil;