'use client'
// src/app/Email/page.tsx

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { data, perfil } from '@/helpers/data'; // Importar dados

const Email: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<{ value: number; label: string; conteudo: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedEmails = sessionStorage.getItem('selectedEmails');
            if (storedEmails) {
                const emails = JSON.parse(storedEmails);
                setSelectedEmails(emails);
            }
        }
    }, []);

    const initialSelectedValues = selectedEmails.map((email) => ({ value: email, label: email }));
    const options = data.map((item) => ({
        value: item.email,
        label: item.email,
    }));

    const perfilOptions = perfil.map((item) => ({
        value: item.id,
        label: item.titulo,
        conteudo: item.conteudo,
    }));

    const handleSelectChange = (newValue: any) => {
        setSelectedEmails(newValue.map((option: any) => option.value));
    };

    const handleProfileChange = (selectedOption: any) => {
        setSelectedProfile(selectedOption);
        if (selectedOption) {
            setBody(selectedOption.conteudo);
            setSubject(selectedOption.label);
        } else {
            setBody('');
            setSubject('');
        }
    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
    };

    const handleClearClick = () => {
        setSelectedEmails([]); // Limpar destinatários
        setSubject(''); // Limpar assunto
        setBody(''); // Limpar corpo do email
        setSelectedProfile(null); // Limpar perfil selecionado
        sessionStorage.clear();
    };

    const handleSendClick = () => {
        if (selectedEmails.length === 0 || !subject.trim() || !body.trim()) {
            alert('Por favor, preencha todos os campos antes de enviar o email.');
            return;
        }

        console.log('Enviar:', { destinatarios: selectedEmails, assunto: subject, corpo: body });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Enviar Email</h1>

            <div className="mb-4">
                <label className="block mb-2">Destinatários:</label>
                <Select
                    options={options}
                    value={initialSelectedValues}
                    onChange={handleSelectChange}
                    isMulti
                />
            </div>

            <div className="flex mb-4">
                <div className="w-1/2">
                    <label className="block mb-2">Assunto:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={handleSubjectChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="w-1/2 ml-4">
                    <label className="block mb-2">Perfil de Email:</label>
                    <Select
                        options={perfilOptions}
                        value={selectedProfile}
                        onChange={handleProfileChange}
                        isClearable
                    />
                </div>
            </div>

            <label className="block mt-4 mb-2">Corpo do Email:</label>
            <textarea
                value={body}
                onChange={handleBodyChange}
                rows={6}
                className="w-full p-2 border rounded"
                placeholder="Use macros: @nome@, @cnpj@, @email@, @cadastro@, @tel1@, @tel2@"
            />

            <div className="mt-4 flex space-x-2">
                <button
                    onClick={handleClearClick}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                    Limpar
                </button>
                <button
                    onClick={handleSendClick}
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Email;
