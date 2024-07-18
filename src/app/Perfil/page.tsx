'use client'
import React, { useState } from 'react';
import Select from 'react-select';
import { perfil } from '@/helpers/data';  // Ajuste o caminho de importação conforme necessário

const Perfil: React.FC = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Definir o tipo do estado
    
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
        if (!title.trim()) {
            alert('O título não pode estar vazio.');
            return;
        }
        if (!body.trim()) {
            alert('O corpo do email não pode estar vazio.');
            return;
        }
        
        console.log('Dados a serem enviados:', { title, body});
    };

    const handleEditClick = () => {
        if (!title.trim()) {
            alert('O título não pode estar vazio.');
            return;
        }
        if (!body.trim()) {
            alert('O corpo do email não pode estar vazio.');
            return;
        }

        console.log('Edição:', { title, body, perfil: selectedProfile.value });
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
                        Editar
                    </button>
                ) : (
                    <button
                        onClick={handleSaveClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Salvar
                    </button>
                )}
                <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default Perfil;
